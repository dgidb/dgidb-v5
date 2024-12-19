module Genome; module Importers; module FileImporters; module MyCancerGenomeClinicalTrial;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'MyCancerGenomeClinicalTrial'
    end

    def create_claims
      create_interaction_claims
    end

    private
    def default_filename
      'clinical_trial_claims'
    end

    def handle_file_location(file_path)
      return file_path unless file_path.nil?

      src_name = "my_cancer_genome"
      "#{default_data_dir}/#{src_name}/#{src_name}_#{default_filename}.#{default_filetype}"
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.mycancergenome.org/',
          citation: 'Jain N, Mittendorf KF, Holt M, Lenoue-Newton M, Maurer I, Miller C, Stachowiak M, Botyrius M, Cole J, Micheel C, Levy M. The My Cancer Genome clinical trial data model and trial curation workflow. J Am Med Inform Assoc. 2020 Jul 1;27(7):1057-1066. doi: 10.1093/jamia/ocaa066. PMID: 32483629; PMCID: PMC7647323.',
          citation_short: 'Jain N, et al. The My Cancer Genome clinical trial data model and trial curation workflow. J Am Med Inform Assoc. 2020 Jul 1;27(7):1057-1066.',
          pmid: '32483629',
          pmcid: 'PMC7647323',
          doi: '10.1093/jamia/ocaa066',
          site_url: 'http://www.mycancergenome.org/',
          source_db_version: '30-Feburary-2014',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'MyCancerGenome Clinical Trial',
          license: 'Restrictive, custom, non-commercial',
          license_link: 'https://www.mycancergenome.org/content/page/legal-policies-licensing/',
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, :headers => true, :col_sep => "\t") do |row|
        next if row['Entrez gene name'] == 'N/A' or row['pubchem drug name'] == 'N/A'

        gene_claim = create_gene_claim(row['Entrez gene name'].upcase, GeneNomenclature::NAME)
        unless row['Gene ID'] == 'N/A' || row['Gene ID'].include?('.')
          create_gene_claim_alias(gene_claim, "ncbigene:#{row['Gene ID']}", GeneNomenclature::NCBI_ID)
        end
        unless row['genes'] == 'N/A'
          create_gene_claim_attribute(gene_claim, GeneAttributeName::TARGET_EVENT, row['genes'])
        end

        drug_claim = create_drug_claim(row['pubchem drug name'].upcase)
        unless row['Drug name'] == 'N/A'
          create_drug_claim_alias(drug_claim, row['Drug name'], DrugNomenclature::TRADE_NAME)
        end
        unless row['pubchem drug id'] == 'N/A'
          create_drug_claim_alias(drug_claim, "pubchem.compound:#{row['pubchem drug id']}",
                                  DrugNomenclature::PUBCHEM_COMPOUND_ID)
        end
        unless row['Other drug names'] == 'N/A'
          if row['Other drug names'].starts_with?('PF-')
            create_drug_claim_alias(drug_claim, "pfam:#{row['Other drug names'].gsub(' ', '')}",
                                    DrugNomenclature::PFAM_ID)
          else
            create_drug_claim_alias(drug_claim, row['Other drug names'], DrugNomenclature::ALIAS)
          end
        end

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_type(interaction_claim, row['Interaction type'])
        unless row['clinical trial ID'] == 'N/A'
          create_interaction_claim_attribute(
            interaction_claim,
            InteractionAttributeName::CLINICAL_TRIAL_ID,
            row['clinical trial ID']
          )
        end
        create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::CANCER_TYPE, row['Disease'])
        unless row['indication of drug-gene interaction'] == 'N/A'
          create_interaction_claim_attribute(
            interaction_claim,
            InteractionAttributeName::INDICATION,
            row['indication of drug-gene interaction']
          )
        end
        create_interaction_claim_link(interaction_claim, 'Clinical Trials', "https://www.mycancergenome.org/content/clinical_trials/")
      end
    end
  end
end; end; end; end;
