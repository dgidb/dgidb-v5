module Genome; module Importers; module FileImporters; module Drugbank;
  class Importer < Genome::Importers::Base
    # TODO check whether redundant drug claims or gene claims are getting created
    attr_reader :file_path
    attr_reader :source_db_name
    attr_reader :source
    attr_reader :drug_filter

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'DrugBank'
    end

    def default_filetype
      'xml'
    end

    def run_parser
      @drug_filter = DrugFilter.new
      parser = Nokogiri::XML::SAX::Parser.new(drug_filter)
      parser.parse(File.open(@file_path))
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://go.drugbank.com/drugs',
          site_url: 'https://go.drugbank.com/',
          citation: "DrugBank 5.0: a major update to the DrugBank database for 2018. Wishart DS, Feunang YD, Guo AC, Lo EJ, Marcu A, Grant JR, Sajed T, Johnson D, Li C, Sayeeda Z, Assempour N, Iynkkaran I, Liu Y, Maciejewski A, Gale N, Wilson A, Chin L, Cummings R, Le D, Pon A, Knox C, Wilson M. Nucleic Acids Res. 2017 Nov 8. doi 10.1093/nar/gkx1037. PubMed ID: 29126136",
          source_db_version: '5.1.9',
          source_db_name: 'DrugBank',
          full_name: 'DrugBank - Open Data Drug & Drug Target Database',
          license: License::CUSTOM_NON_COMMERCIAL,
          license_link: 'https://dev.drugbankplus.com/guides/drugbank/citing?_ga=2.29505343.1251048939.1591976592-781844916.1591645816'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_claims
      run_parser

      @drug_filter.all_records.each do |record|
        next if record[1].strip == '' || !record[2].exclude?('n/a')

        gene_claim = create_gene_claim(record[2], 'DrugBank Gene Name')

        Hash[record[6].zip(record[5])].each do |nomen, syn|
          case nomen
          when 'UniProtKB'
            create_gene_claim_alias(gene_claim, "uniprot:#{syn}", 'UniProtKB ID')
          when 'UniProt Accession'
            create_gene_claim_alias(gene_claim, syn, 'UniProtKB Entry Name')
          when 'IUPHAR', 'Guide to Pharmacology'
            create_gene_claim_alias(gene_claim, "iuphar.receptor:#{syn}", 'GuideToPharmacology Target ID')
          when 'HUGO Gene Nomenclature Committee (HGNC)'
            create_gene_claim_alias(gene_claim, syn, 'HGNC ID')
          else
            if nomen == 'GenAtlas'
              create_gene_claim_alias(gene_claim, syn, 'GenAtlas Gene Symbol')
            else
              create_gene_claim_alias(gene_claim, syn, nomen)
            end
          end
        end

        drug_claim = create_drug_claim(record[1], 'DrugBank Drug Name')
        create_drug_claim_alias(drug_claim, "drugbank:#{record[0]}", 'DrugBank ID')
        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        unless record[3] == 'n/a'
          create_interaction_claim_attribute(interaction_claim, 'Mechanism of Action', record[3])
        end

        record[4].each do |pmid|
          create_interaction_claim_publication(interaction_claim, pmid)
        end
      end
      backfill_publication_information
    end
  end

  class DrugFilter < Nokogiri::XML::SAX::Document
    attr_reader :record
    attr_reader :all_records

    # Flags for retrieving data points
    attr_reader :drugbank_id_flag
    attr_reader :name_flag
    attr_reader :target_name_flag
    attr_reader :target_action_flag
    attr_reader :target_pubmed_flag
    attr_reader :target_gene_identifier_flag
    attr_reader :target_gene_id_resource_flag

    # Flags for excluding data points that share namespace
    attr_reader :is_primary_drug
    attr_reader :is_not_salts
    attr_reader :is_target
    attr_reader :is_gene_identifier

    # Variables for individual data points
    attr_reader :current_drug_id
    attr_reader :current_drug_name
    attr_reader :current_target_name
    attr_reader :current_target_action
    attr_reader :current_target_pmid
    attr_reader :current_target_gene_identifiers
    attr_reader :current_target_gene_id_resources

    def start_document
        @record = []
        @all_records = []
        @is_not_salts = true
        @is_gene_identifier = false
    end

    def start_element(name, attrs = [])
        attrs = attrs.to_h

        case name
        when 'drugbank-id'
            if attrs['primary']
                @drugbank_id_flag = true
                @is_primary_drug = true
            end

        when 'name'
            if @is_primary_drug
              @name_flag = true
            end

        when 'gene-name'
            if @is_target
              @target_name_flag = true
            end

        when 'salts'
            @is_not_salts = false

        when 'target'
            @is_target = true
            @current_target_pmid = []
            @current_target_name = 'n/a'
            @current_target_action = 'n/a'

        when 'action'
            @target_action_flag = true

        when 'pubmed-id'
            @target_pubmed_flag = true

        when 'external-identifiers'
            @is_gene_identifier = true
            @current_target_gene_identifiers = []
            @current_target_gene_id_resources = []

        when 'identifier'
            if @is_gene_identifier
                @target_gene_identifier_flag = true
            end

        when 'resource'
            if @is_gene_identifier
                @target_gene_id_resource_flag = true
            end
        end
    end

    def characters(string)

        if @drugbank_id_flag
            @drugbank_id_flag = false
            if is_not_salts
                @current_drug_id = string
            end
        end

        if @name_flag
            if is_not_salts
                @name_flag = false
                @is_primary_drug = false
                @current_drug_name = string
            end
        end

        if @target_name_flag
            if @is_target
                @target_name_flag = false
                @current_target_name = string
            end
        end

        if target_action_flag
            if is_target
                @target_action_flag = false
                @current_target_action = string
            end
        end

        if target_pubmed_flag
            if is_target
                @target_pubmed_flag = false
                @current_target_pmid.append(string) unless string.include?"\n"
            end
        end

        if target_gene_identifier_flag
            if is_gene_identifier
                @target_gene_identifier_flag = false
                @current_target_gene_identifiers.append(string) unless string.include?"\n"
            end
        end

        if target_gene_id_resource_flag
            if is_gene_identifier
                @target_gene_id_resource_flag = false
                @current_target_gene_id_resources.append(string) unless string.include?"\n"
            end
        end
    end

    def end_element(name)
        case name

        when 'salts'
            @is_not_salts = true

        when 'external-identifiers'
            @is_gene_identifier = false

        when 'target'
            @is_target = false
            @record.append(current_drug_id,@current_drug_name,@current_target_name,@current_target_action,@current_target_pmid,@current_target_gene_identifiers,@current_target_gene_id_resources)
            @all_records.append(@record)
            @record = []

        when 'targets'
        end
    end

    def end_document
    end

  end
end;end; end; end
