module Genome; module Importers; module FileImporters; module Nci;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_reader :all_genes
    attr_reader :nci_db
    attr_reader :drug_interactions
    attr_reader :drug_pmids
    attr_reader :drug_alias
    attr_reader :drug_records
    attr_reader :sax_result


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
      time_open = Benchmark.measure {
      p 'Opening file'
      open_db
      p 'Successfully opened'
    }
      p time_open

      time_genes = Benchmark.measure {
      p 'Grabbing Gene Entries'
      get_gene_entries
      p 'Genes Grabbed'
    }
      p time_genes

      time_records = Benchmark.measure {
      p 'Grabbing Drug Interaction Records'
      grab_records
      p 'Records grabbed'
    }

      time_creation = Benchmark.measure {
        p 'Creating Gene/Drug/Interaction Claims'
        test_loop
        p 'Claims created'
      }
        p time_open
        p time_genes
        p time_records
        p time_creation
    end

    def sax_processing

      time_sax_large = Benchmark.measure {
        p 'Creating Gene/Drug/Interaction Claims'
        parser = Nokogiri::XML::SAX::Parser.new(DrugFilter.new)
        parser.parse(File.open('db/NCI_CancerIndex_allphases_compound.xml'))
        p 'Claims created'
    }
    end

    def make_claims(record)



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

  end # end of class

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
          @all_records.each do |record|
            # Create claim logic will have to go here in this end document bubble
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
        Genome::Importers::Base.backfill_publication_information
    end
  end

end;end; end; end # end of module
