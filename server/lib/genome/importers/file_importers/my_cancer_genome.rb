module Genome; module Importers; module FileImporters; module MyCancerGenome;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'MyCancerGenome'
    end

    def create_claims
      create_interaction_claims
    end

    private
    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.mycancergenome.org/content/molecular-medicine/overview-of-targeted-therapies-for-cancer/',
          site_url: 'http://www.mycancergenome.org/',
          citation: 'Jain N, Mittendorf KF, Holt M, Lenoue-Newton M, Maurer I, Miller C, Stachowiak M, Botyrius M, Cole J, Micheel C, Levy M. The My Cancer Genome clinical trial data model and trial curation workflow. J Am Med Inform Assoc. 2020 Jul 1;27(7):1057-1066. doi: 10.1093/jamia/ocaa066. PMID: 32483629; PMCID: PMC7647323.',
          citation_short: 'Jain N, et al. The My Cancer Genome clinical trial data model and trial curation workflow. J Am Med Inform Assoc. 2020 Jul 1;27(7):1057-1066.',
          pmid: '32483629',
          pmcid: 'PMC7647323',
          doi: '10.1093/jamia/ocaa066',
          source_db_version: '20-Jun-2017',
          source_db_name: source_db_name,
          full_name: 'My Cancer Genome',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          license: 'Restrictive, custom, non-commercial',
          license_link: 'https://www.mycancergenome.org/content/page/legal-policies-licensing/'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['Gene Symbol'])
        create_gene_claim_alias(gene_claim, "ncbigene:#{row['Entrez Gene Id']}", GeneNomenclature::NCBI_ID)
        create_gene_claim_alias(gene_claim, row['Gene Symbol'], GeneNomenclature::SYMBOL)
        create_gene_claim_alias(gene_claim, row['Reported Gene Name'], GeneNomenclature::NAME)

        drug_claim = create_drug_claim(row['Primary Drug Name'].upcase)
        unless row['Drug Development Name'].blank?
          create_drug_claim_alias(drug_claim, row['Drug Development Name'].upcase, DrugNomenclature::DEVELOPMENT_NAME)
        end
        unless row['Drug Generic Name'].blank?
          create_drug_claim_alias(drug_claim, row['Drug Generic Name'].upcase, DrugNomenclature::GENERIC_NAME)
        end
        unless row['Drug Trade Name'].blank?
          create_drug_claim_alias(drug_claim, row['Drug Trade Name'].upcase, DrugNomenclature::TRADE_NAME)
        end
        create_drug_claim_attribute(drug_claim, DrugAttributeName::DRUG_CLASS, row['Drug Class'])
        create_drug_claim_attribute(drug_claim, DrugAttributeName::NOTES, row['Notes']) unless row['Notes'].blank?

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_type(interaction_claim, row['Interaction Type'])
        create_interaction_claim_link(
          interaction_claim,
          'Overview of Targeted Therapies for Cancer',
          'https://www.mycancergenome.org/content/page/overview-of-targeted-therapies-for-cancer/'
        )
      end
    end
  end
end; end; end; end;
