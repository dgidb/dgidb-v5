require 'net/http'

module Genome
  module Importers
    module ApiImporters
      module Civic
        class Importer < Genome::Importers::Base
          attr_reader :new_version

          def initialize
            @source_db_name = 'CIViC'
            @api_client = ApiClient.new
          end

          def create_claims
            create_drug_claims
            create_gene_claims
            create_interaction_claims
          end

          private

          # this should be rare -- maybe impossible under the latest schema changes?
          def importable_drug?(drug)
            drug.name.upcase != 'N/A' && !drug.name.include?(';')
          end

          def importable_evidence_item?(ei)
              [
                ei.evidence_direction == 'SUPPORTS',
                ei.evidence_level != 'E',
                ei.evidence_rating.present? && ei.evidence_rating > 2
              ].all?
          end

          def create_drug_claims
            @api_client.enumerate_drugs.each do |drug|
              next if !importable_drug?(drug)

              dc = create_drug_claim(drug.name.upcase, DrugNomenclature::PRIMARY_NAME)
              create_drug_claim_alias(dc, "civic.tid:#{drug.id}", DrugNomenclature::CIVIC_TID)
              create_drug_claim_alias(dc, "ncit:#{drug.ncit_id}", DrugNomenclature::NCIT_ID) if drug.ncit_id
            end
          end

          def create_gene_claims
            @api_client.enumerate_genes.each do |gene|
              gc = create_gene_claim(gene.name.upcase, GeneNomenclature::SYMBOL)
              create_gene_claim_alias(gc, "civic.gid:#{gene.id}", GeneNomenclature::CIVIC_GID)
              create_gene_claim_alias(gc, "ncbi.gene:#{gene.entrez_id}", GeneNomenclature::NCBI_ID) if gene.entrez_id
              create_gene_claim_alias(gc, gene.full_name, GeneNomenclature::NAME) if gene.full_name
              gene.feature_aliases.uniq.reject { |n| n == gene.name }.each do |gene_alias|
                create_gene_claim_alias(gc, gene_alias, GeneNomenclature::SYMBOL)
              end
            end
          end

          def create_entries_for_evidence_item(ei, dc, gc)
            ic = create_interaction_claim(gc, dc)
            if ei.source.citation_id.present? && ei.source.source_type == 'PubMed'
              create_interaction_claim_publication(ic, ei.source.citation_id)
            end
            create_interaction_claim_link(ic, "EID#{ei.id}", "https://civicdb.org/evidence/#{ei.id}")
          end

          # current policy is to skip items with poor rating/level, anything that doesn't support the claim,
          # or any item with >1 genes (e.g. a fusion)
          def create_interaction_claims
            @api_client.enumerate_evidence_items.each do |ei|
              next if !importable_evidence_item?(ei)

              # retain molecular profiles consisting of multiple variations on the same gene,
              # but skip multi-gene profiles (eg fusions)
              gene_names = ei.molecular_profile.variants.map do |variant|
                feature_instance = variant.feature.feature_instance
                if feature_instance.respond_to?(:name)
                  feature_instance.name.upcase
                else  # skip Factors for now
                  nil
                end
              end.compact.uniq
              next if gene_names.length != 1
              gc = GeneClaim.joins(:source).where(sources: {source_db_name: "CIViC"}, gene_claims: {name: gene_names[0]}).first

              drug_claims = ei.therapies.map do |therapy|
                drug_name = therapy.name.upcase
                DrugClaim.joins(:source).where(sources: { source_db_name: "CIViC" }, drug_claims: { name: drug_name }).first
              end
              drug_claims = drug_claims.uniq.compact
              next if drug_claims.length == 0

              create_gene_claim_category(gc, 'DRUG RESISTANCE') if ei.significance.downcase == 'resistance'
              create_gene_claim_category(gc, 'CLINICALLY ACTIONABLE') if ei.evidence_level == 'A'
              drug_claims.each do |dc|
                create_entries_for_evidence_item(ei, dc, gc)
              end
            end
            backfill_publication_information
          end

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
        end
      end
    end
  end
end
