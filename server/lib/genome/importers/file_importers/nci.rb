module Genome; module Importers; module FileImporters; module Nci;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_reader :all_genes
    attr_reader :nci_db
    attr_reader :drug_interactions
    attr_reader :drug_pmids
    attr_reader :drug_alias
    attr_reader :drug_records

    def initialize(file_path)
      @file_path = file_path
      @source_db_name = 'NCI'
    end

    def create_claims
      create_interaction_claims
    end

    def open_db
      @nci_db = File.open(file_path) { |f| Nokogiri::XML(f) }
    end

    def get_gene_entries
      genes = nci_db.xpath("GeneEntryCollection/GeneEntry")
      @all_genes = genes.children.map { |n| n.text if n.name.include?"HUGOGeneSymbol"}.compact!.uniq
    end

    def grab_records
    @drug_records = {}
    @all_genes.each do |gene|
      entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/DrugData/DrugTerm[../../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
      interaction = entry.map { |n| n.text }#.uniq

      entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/PubMedID[../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
      pmid = entry.map { |n| n.text }#.uniq

      entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/DrugData/NCIDrugConceptCode[../../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
      aliase = entry.map { |n| n.text }#.uniq

      @drug_records[gene] = [interaction,pmid,aliase]
      end
    end

    def test_loop
      @all_genes.each do |gene|

        record = @drug_records[gene] # [0] = drug, [1] = pmid, [2] = nci id

        p gene

        max = record[0].count

        i = 0

        while i < max

          p 'NCI Drug Name: ' + record[0][i]
          p 'NCI Drug Code: ' + record[2][i]
          p 'Interaction Claim PMID: ' + record[1][i]

          i += 1

          end
          p i.to_s
          p 'Max: ' + max.to_s
        end
    end

    def run_all_test
      time = Benchmark.measure {
      p 'Opening file'
      open_db
      p 'Successfully opened'
    }
      p time

      time = Benchmark.measure {
      p 'Grabbing Gene Entries'
      get_gene_entries
      p 'Genes Grabbed'
    }
      p time

      time_s = Benchmark.measure {
      p 'Grabbing Drug Interaction Records'
      grab_records
      p 'Records grabbed'
    }
      p time_s

      time = Benchmark.measure {
        p 'Creating Gene/Drug/Interaction Claims'
        test_loop
        p 'Claims created'
      }
        p time_s
        p time

    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://wiki.nci.nih.gov/display/cageneindex/The+Cancer+Gene+Index+Gene-Disease+and+Gene-Compound+XML+Documents',
          site_url: 'https://wiki.nci.nih.gov/display/cageneindex',
          citation: 'https://wiki.nci.nih.gov/display/cageneindex',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'NCI Cancer Gene Index',
          license: 'Public domain',
          license_link: 'https://www.cancer.gov/policies/copyright-reuse'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
    @all_genes.each do |gene|

      record = @drug_records[gene] # [0] = drug, [1] = pmid, [2] = nci id

      gene_claim = create_gene_claim(gene,'CGI Gene Name')

      max = record[0].count
      i = 0

      while i < max
        drug_claim = create_drug_claim(record[0][i],record[0][i],'NCI Drug Name')
        create_drug_claim_alias(drug_claim, record[2][i], 'NCI Drug Code')
        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_publication(interaction_claim, record[1][i])
        create_interaction_claim_link(interaction_claim, 'The Cancer Gene Index Gene-Disease and Gene-Compound XML Documents', 'https://wiki.nci.nih.gov/display/cageneindex/The+Cancer+Gene+Index+Gene-Disease+and+Gene-Compound+XML+Documents' )
        i += 1
        end
      end
    backfill_publication_information
    end


  end
end; end; end; end;
