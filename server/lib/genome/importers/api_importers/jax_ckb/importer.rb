module Genome; module Importers; module ApiImporters; module JaxCkb;
  class Importer < Genome::Importers::Base
    attr_reader :new_version

    def initialize
      @source_db_name = 'JAX-CKB'
    end

    def create_claims
      create_interaction_claims
    end

    def create_new_source
      @source ||= Source.create(
        {
          source_db_name: source_db_name,
          source_db_version: set_current_date_version,
          base_url: 'https://ckb.jax.org/gene/show?geneId=',
          site_url: 'https://ckb.jax.org',
          citation: 'Patterson SE, Liu R, Statz CM, Durkin D, Lakshminarayana A, Mockus SM. The clinical trial landscape in oncology and connectivity of somatic mutational profiles to targeted therapies. Hum Genomics. 2016 Jan 16;10:4. doi: 10.1186/s40246-016-0061-7. PMID: 26772741; PMCID: PMC4715272.',
          citation_short: 'Patterson SE, et al. The clinical trial landscape in oncology and connectivity of somatic mutational profiles to targeted therapies. Hum Genomics. 2016 Jan 16;10:4.',
          pmid: '26772741',
          pmcid: 'PMC4715272',
          doi: '10.1186/s40246-016-0061-7',
          full_name: 'The Jackson Laboratory Clinical Knowledgebase',
          license: License::CC_BY_NC_SA_4_0,
          license_link: 'https://ckb.jax.org/about/index',
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      api_client = ApiClient.new
      api_client.genes.each do |gene|
        gene_claim = create_gene_claim(gene['geneName'], 'Primary Gene Name')
        create_gene_claim_aliases(gene_claim, gene)
        api_client.interactions_for_gene_id(gene['id']).each do |interaction|
          drug_name = interaction['Therapy Name']
          if drug_name.include? '+'
            combination_drug_name = drug_name
            combination_drug_name.split(' + ').each do |individual_drug_name|
              drug_claim = create_drug_claim(individual_drug_name, DrugNomenclature::PRIMARY_NAME)
              interaction_claim = create_interaction_claim(gene_claim, drug_claim)
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION, combination_drug_name)
              create_interaction_claim_publications(interaction_claim, interaction['References'])
              create_interaction_claim_attributes(interaction_claim, interaction)
              create_interaction_claim_link(interaction_claim, "#{gene['geneName']} Gene Level Evidence", "https://ckb.jax.org/gene/show?geneId=#{gene['id']}&tabType=GENE_LEVEL_EVIDENCE")
            end
          else
            next if drug_name.upcase == 'N/A'

            drug_claim = create_drug_claim(drug_name, DrugNomenclature::PRIMARY_NAME)
            interaction_claim = create_interaction_claim(gene_claim, drug_claim)
            create_interaction_claim_publications(interaction_claim, interaction['References'])
            create_interaction_claim_attributes(interaction_claim, interaction)
            create_interaction_claim_link(interaction_claim, "#{gene['geneName']} Gene Level Evidence", "https://ckb.jax.org/gene/show?geneId=#{gene['id']}&tabType=GENE_LEVEL_EVIDENCE")
          end
        end
      end
      backfill_publication_information()
    end

    def create_gene_claim_aliases(gene_claim, gene)
      create_gene_claim_alias(gene_claim, "ncbigene:#{gene['id']}", 'NCBI Gene ID')
      gene['text'].split(' | ').each do |synonym|
        create_gene_claim_alias(gene_claim, synonym, 'Gene Synonym')
      end
    end

    def create_interaction_claim_publications(interaction_claim, publications)
      publications.split.select { |p| valid_pmid?(p) }.each do |pmid|
        if pmid == '30715168'
          pmid = '31987360'
        end
        create_interaction_claim_publication(interaction_claim, pmid)
      end
    end

    def valid_pmid?(pmid)
      pmid.to_i.to_s == pmid
    end

    def create_interaction_claim_attributes(interaction_claim, interaction)
      {
        InteractionAttributeName::INDICATION => 'Indication/Tumor Type',
        InteractionAttributeName::RESPONSE => 'Response Type',
        InteractionAttributeName::APPROVAL_STATUS => 'Approval Status',
        InteractionAttributeName::EV_TYPE => 'Evidence Type'
      }.each do |name, key|
        create_interaction_claim_attribute(interaction_claim, name, interaction[key])
      end
    end
  end
end; end; end; end
