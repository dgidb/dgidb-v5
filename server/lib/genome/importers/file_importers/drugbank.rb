module Genome; module Importers; module FileImporters; module Drugbank;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_reader :source_db_name
    attr_reader :source
    attr_reader :drug_filter

    def initialize(file_path)
      @file_path = file_path
      @source_db_name = 'DrugBank'
    end

    def run_parser
      @drug_filter = DrugFilter.new
      parser = Nokogiri::XML::SAX::Parser.new(drug_filter)
      parser.parse(File.open(file_path))
    end

    def create_new_source
      @source ||= Source.create(
        {
            base_url: 'https://go.drugbank.com/',
            site_url: 'https://go.drugbank.com/',
            citation: "DrugBank 5.0: a major update to the DrugBank database for 2018. Wishart DS, Feunang YD, Guo AC, Lo EJ, Marcu A, Grant JR, Sajed T, Johnson D, Li C, Sayeeda Z, Assempour N, Iynkkaran I, Liu Y, Maciejewski A, Gale N, Wilson A, Chin L, Cummings R, Le D, Pon A, Knox C, Wilson M. Nucleic Acids Res. 2017 Nov 8. doi 10.1093/nar/gkx1037. PubMed ID: 29126136",
            source_db_version: get_version,
            source_type_id: DataModel::SourceType.INTERACTION,
            source_db_name: 'DrugBank',
            full_name: 'DrugBank - Open Data Drug & Drug Target Database',
            source_trust_level_id: DataModel::SourceTrustLevel.EXPERT_CURATED,
            license: '',
            license_link: 'https://dev.drugbankplus.com/guides/drugbank/citing?_ga=2.29505343.1251048939.1591976592-781844916.1591645816' # license link double check?
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_claims
        @drug_filter.all_records.each do |record|
            # Create claims
        end
    end


  end

  class DrugFilter < Nokogiri::XML::SAX::Document
    attr_reader :record
    attr_reader :all_records

    # Flags for retrieving data points
    attr_reader :drugbank_id_flag
    attr_reader :name_flag

    # Flags for excluding data points that share namespace
    attr_reader :is_primary_drug
    attr_reader :is_not_salts


    def start_document
        @record = []
        @all_records = []
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

        when 'salts'
            @is_not_salts = false


        end
    end

    def characters(string)


        if @drugbank_id_flag
            @drugbank_id_flag = false
            if is_not_salts
                p string
            end
        end

        if @name_flag
            if is_not_salts
                @name_flag = false
                @is_primary_drug = false
                p string unless string.include?"\n"
            end
        end



    end

    def end_element(name)
        case name

        when 'salts'
            @is_not_salts = true

        when 'hello'
            @all_records.append(@record)
            @record = []
        end
    end

    def end_document
    end

  end

end;end; end; end
