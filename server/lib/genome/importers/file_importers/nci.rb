module Genome; module Importers; module FileImporters; module Nci;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_reader :all_genes
    attr_reader :nci_db
    attr_reader :drug_interactions
    attr_reader :drug_pmids
    attr_reader :drug_alias
    attr_reader :linked_records

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

    def get_drug_alias_by_genes
      @drug_alias = {}
      @all_genes.each do |gene|
        entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/DrugData/NCIDrugConceptCode[../../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
        record = entry.map { |n| n.text }#.uniq
        @drug_alias[gene] = record
      end
    end

    def get_drug_pmids_by_genes
      @drug_pmids = {}
      @all_genes.each do |gene|
        entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/PubMedID[../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
        pmid = entry.map { |n| n.text }#.uniq
        @drug_pmids[gene] = pmid
      end
    end

    def get_drug_interactions_for_genes
      @drug_interactions = {}
      @all_genes.each do |gene|
        entry = @nci_db.xpath("GeneEntryCollection/GeneEntry/Sentence/DrugData/DrugTerm[../../.././HUGOGeneSymbol[contains(text(), '" + gene + "')]]")
        interaction = entry.map { |n| n.text }#.uniq
        @drug_interactions[gene] = interaction
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

      time = Benchmark.measure {
      p 'Grabbing Drug Interactions'
      get_drug_interactions_for_genes
      p 'Interactions recorded'
    }
      p time

      time = Benchmark.measure {
      p 'Grabbing Drug Aliases'
      get_drug_alias_by_genes
      p 'Aliases recorded'
    }
      p time

      time = Benchmark.measure {
      p 'Grabbing Drug PMIDs'
      get_drug_pmids_by_genes
      p 'PMIDs recorded'
    }
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
      CSV.foreach(file_path, encoding:'iso-8859-1:utf-8', headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['Gene'], 'CGI Gene Name')
        drug = row['Drug'].upcase
        drug_claim = create_drug_claim(drug, drug, 'NCI Drug Name')
        create_drug_claim_alias(drug_claim, row['NCI drug code'], 'NCI drug code')
        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_publication(interaction_claim, row['PMID'])
        create_interaction_claim_link(interaction_claim, 'The Cancer Gene Index Gene-Disease and Gene-Compound XML Documents', 'https://wiki.nci.nih.gov/display/cageneindex/The+Cancer+Gene+Index+Gene-Disease+and+Gene-Compound+XML+Documents')
      end
      backfill_publication_information
    end
  end
end; end; end; end;
