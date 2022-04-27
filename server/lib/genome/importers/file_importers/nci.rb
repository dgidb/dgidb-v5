module Genome; module Importers; module FileImporters; module Nci;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_reader :source_db_name
    attr_reader :source
    attr_reader :drug_filter

    def initialize(file_path)
      @file_path = file_path
      @source_db_name = 'NCI'
    end

    def run_parser
      @drug_filter = DrugFilter.new

      # Create parser
      parser = Nokogiri::XML::SAX::Parser.new(drug_filter)

      # Send XML to parser
      parser.parse(File.open(file_path))

      @drug_filter.all_records
    end

    def create_claims
      @drug_filter.all_records.each do |record|

        gene_claim = create_gene_claim(record[0],'CGI Gene Name')
        p 'GENE CLAIM: ' + record[0]

        drug_claim = create_drug_claim(record[1],record[1],'NCI Drug Name')
        p 'DRUG CLAIM: ' + record[1]

        create_drug_claim_alias(drug_claim, record[2], 'NCI Drug Code')
        p 'NCI Drug Code: ' + record[2]

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)

        create_interaction_claim_publication(interaction_claim, record[3])
        p 'Interaction PMID: ' + record[3]

        create_interaction_claim_link(interaction_claim, 'The Cancer Gene Index Gene-Disease and Gene-Compound XML Documents', 'https://wiki.nci.nih.gov/display/cageneindex/The+Cancer+Gene+Index+Gene-Disease+and+Gene-Compound+XML+Documents' )
        end
      backfill_publication_information
    end

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
  end # end of class

  private


  class DrugFilter < Nokogiri::XML::SAX::Document
    attr_reader :HUGO_flag
    attr_reader :DrugTerm_flag
    attr_reader :NCIDrugConceptCode_flag
    attr_reader :PubMedID_flag
    attr_reader :current_gene
    attr_reader :current_drug
    attr_reader :current_NCIDrugConceptCode
    attr_reader :current_PubMedID
    attr_reader :record
    attr_reader :all_records

    def start_document
        @record = []
        @all_records = []
    end

    def start_element(name, attrs = [])
        case name
        when 'HUGOGeneSymbol'
            @HUGO_flag = true
        when 'DrugTerm'
            @DrugTerm_flag = true
        when 'NCIDrugConceptCode'
            @NCIDrugConceptCode_flag = true
        when 'PubMedID'
            @PubMedID_flag = true
        end
    end

    def characters(string)

        if @HUGO_flag
            @current_gene = string
            @HUGO_flag = false
        end

        if @DrugTerm_flag
            @current_drug = string
            @DrugTerm_flag = false
            @record.append(@current_gene)
            @record.append(@current_drug)
        end

        if @NCIDrugConceptCode_flag
            @current_NCIDrugConceptCode = string
            @NCIDrugConceptCode_flag = false
            @record.append(@current_NCIDrugConceptCode)
        end

        if @PubMedID_flag
            @current_PubMedID = string
            @PubMedID_flag = false
            @record.append(@current_PubMedID)
        end
    end

    def end_element(name)
        case name
        when 'Sentence'
            @all_records.append(@record)
            @record = []
        end
    end

    def end_document
    end

  end # end of class

end;end; end; end # end of module
