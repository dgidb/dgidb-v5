require 'net/http'

module Genome
  module Importers
    module ApiImporters
      module Civic
        class Importer < Genome::Importers::Base
          attr_reader :new_version

          def initialize
            @source_db_name = 'CIViC'
          end

          def create_claims
            create_interaction_claims
          end

          private

          def create_new_source
            @source ||= Source.create(
              {
                source_db_name: source_db_name,
                source_db_version: set_current_date_version,
                base_url: 'https://www.civicdb.org',
                site_url: 'https://www.civicdb.org',
                citation: 'Krysiak K, Danos AM, Saliba J, McMichael JF, Coffman AC, Kiwala S, Barnell EK, Sheta L, Grisdale CJ, Kujan L, Pema S, Lever J, Ridd S, Spies NC, Andric V, Chiorean A, Rieke DT, Clark KA, Reisle C, Venigalla AC, Evans M, Jani P, Takahashi H, Suda A, Horak P, Ritter DI, Zhou X, Ainscough BJ, Delong S, Kesserwan C, Lamping M, Shen H, Marr AR, Hoang MH, Singhal K, Khanfar M, Li BV, Lin WH, Terraf P, Corson LB, Salama Y, Campbell KM, Farncombe KM, Ji J, Zhao X, Xu X, Kanagal-Shamanna R, King I, Cotto KC, Skidmore ZL, Walker JR, Zhang J, Milosavljevic A, Patel RY, Giles RH, Kim RH, Schriml LM, Mardis ER, Jones SJM, Raca G, Rao S, Madhavan S, Wagner AH, Griffith M, Griffith OL. CIViCdb 2022: evolution of an open-access cancer variant interpretation knowledgebase. Nucleic Acids Res. 2022 Nov 14:gkac979. doi: 10.1093/nar/gkac979. Epub ahead of print. PMID: 36373660.',
                citation_short: 'Krysiak K, et al. CIViCdb 2022: evolution of an open-access cancer variant interpretation knowledgebase. Nucleic Acids Res. 2022 Nov 14:gkac979.',
                pmid: '28138153',
                doi: '10.1093/nar/gkac979',
                source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
                full_name: 'CIViC: Clinical Interpretation of Variants in Cancer',
                license: License::CC0_1_0,
                license_link: 'https://docs.civicdb.org/en/latest/about/faq.html#how-is-civic-licensed'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.source_types << SourceType.find_by(type: 'potentially_druggable')
            @source.save
          end

          def importable_eid?(evidence_item)
            [
              evidence_item.evidence_type == 'PREDICTIVE',
              evidence_item.evidence_direction == 'SUPPORTS',
              evidence_item.evidence_level != 'E',
              evidence_item.evidence_rating.present? && evidence_item.evidence_rating > 2
            ].all?
          end

          def importable_drug?(drug)
            drug.name.upcase != 'N/A' && !drug.name.include?(';')
          end

          def create_gene_claim_entries(gene)
            gc = create_gene_claim(gene.name)
            base_aliases = gene.gene_aliases + [gene.official_name]
            base_aliases.uniq.reject { |n| n == gene.name }.each do |gene_alias|
              create_gene_claim_alias(gc, gene_alias, GeneNomenclature::SYMBOL)
            end
            create_gene_claim_alias(gc, "ncbigene:#{gene.entrez_id}", GeneNomenclature::NCBI_ID)
            create_gene_claim_alias(gc, "civic.gid:#{gene.id}", GeneNomenclature::CIVIC_ID)
            gc
          end

          def create_entries_for_evidence_item(gc, ei)
            ei.therapies.select { |d| importable_drug?(d) }.each do |drug|
              create_gene_claim_category(gc, 'DRUG RESISTANCE') if ei.significance.downcase == 'resistance'
              create_gene_claim_category(gc, 'CLINICALLY ACTIONABLE') if ei.evidence_level == 'A'

              dc = create_drug_claim(drug.name.upcase, DrugNomenclature::PRIMARY_NAME)
              create_drug_claim_alias(dc, "ncit:#{drug.ncit_id}", DrugNomenclature::NCIT_ID) if drug.ncit_id

              ic = create_interaction_claim(gc, dc)
              if ei.source.citation_id.present? && ei.source.source_type == 'PubMed'
                create_interaction_claim_publication(ic, ei.source.citation_id)
              end
              create_interaction_claim_link(ic, ei.name, "https://civicdb.org/#{ei.link}")
            end
          end

          def create_interaction_claims
            api_client = ApiClient.new
            api_client.enumerate_variants.each do |variant_edge|
              mp_nodes = variant_edge.node.molecular_profiles.nodes.select { |mp| mp.variants.size == 1 }
              ei_nodes = mp_nodes.reduce([]) { |tot, node| tot.concat(node.evidence_items.nodes) }
              ei_nodes = ei_nodes.select { |ei| importable_eid?(ei) }
              next if ei_nodes.length.zero?

              gc = create_gene_claim_entries(variant_edge.node.gene)
              ei_nodes.each do |ei_node|
                create_entries_for_evidence_item(gc, ei_node)
              end
            end
            backfill_publication_information
          end
        end
      end
    end
  end
end
