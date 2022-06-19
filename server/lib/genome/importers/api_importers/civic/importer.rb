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
                citation: 'Griffith M, Spies NC, Krysiak K, McMichael JF, Coffman AC, Danos AM, Ainscough BJ, Ramirez CA, Rieke DT, Kujan L, Barnell EK, Wagner AH, Skidmore ZL, Wollam A, Liu CJ, Jones MR, Bilski RL, Lesurf R, Feng YY, Shah NM, Bonakdar M, Trani L, Matlock M, Ramu A, Campbell KM, Spies GC, Graubert AP, Gangavarapu K, Eldred JM, Larson DE, Walker JR, Good BM, Wu C, Su AI, Dienstmann R, Margolin AA, Tamborero D, Lopez-Bigas N, Jones SJ, Bose R, Spencer DH Wartman LD, Wilson RK, Mardis ER, Griffith OL. 2016. CIViC is a community knowledgebase for expert crowdsourcing the clinical interpretation of variants in cancer. Nat Genet. 49, 170–174 (2017); doi: doi.org/10.1038/ng.3774. PMID: 28138153',
                source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
                full_name: 'CIViC: Clinical Interpretation of Variants in Cancer',
                license: 'Creative Commons Public Domain Dedication (CC0 1.0 Universal)',
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
            gc = create_gene_claim(gene.official_name, 'Gene Symbol')
            base_aliases = gene.gene_aliases + [gene.name]
            base_aliases.uniq.reject { |n| n == gene.official_name }.each do |gene_alias|
              create_gene_claim_alias(gc, gene_alias, 'Gene Symbol')
            end
            create_gene_claim_alias(gc, "ncbigene:#{gene.entrez_id}", 'NCBI Gene ID')
            create_gene_claim_alias(gc, "civic.gid:#{gene.id}", 'CIViC ID')
            gc
          end

          def create_entries_for_evidence_item(gc, ei)
            ei.drugs.select { |d| importable_drug?(d) }.each do |drug|
              create_gene_claim_category(gc, 'DRUG RESISTANCE') if ei.clinical_significance == 'Resistance'
              create_gene_claim_category(gc, 'CLINICALLY ACTIONABLE') if ei.evidence_level == 'A'

              dc = create_drug_claim(drug.name.upcase, 'Primary Drug Name')
              create_drug_claim_alias(dc, "ncit:#{drug.ncit_id}", 'NCIt ID')

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
              node = variant_edge.node
              ei_nodes = node.evidence_items.nodes.select { |ei| importable_eid?(ei) }
              next if ei_nodes.length.zero?

              gc = create_gene_claim_entries(node.gene)
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
