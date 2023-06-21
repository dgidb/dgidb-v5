module Genome; module Importers; module FileImporters; module Ttd;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'TTD'
    end

    def create_claims
      import_claims
    end

    private

    def default_filetype
      'csv'
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://db.idrblab.net/ttd/',
          site_url: 'http://bidd.nus.edu.sg/group/cjttd/',
          citation: 'Wang Y, Zhang S, Li F, Zhou Y, Zhang Y, Wang Z, Zhang R, Zhu J, Ren Y, Tan Y, Qin C, Li Y, Li X, Chen Y, Zhu F. Therapeutic target database 2020: enriched resource for facilitating research and early development of targeted therapeutics. Nucleic Acids Res. 2020 Jan 8;48(D1):D1031-D1041. doi: 10.1093/nar/gkz981. PMID: 31691823; PMCID: PMC7145558.',
          citation_short: 'Wang Y, et al. Therapeutic target database 2020: enriched resource for facilitating research and early development of targeted therapeutics. Nucleic Acids Res. 2020 Jan 8;48(D1):D1031-D1041.',
          pmid: '31691823',
          pmcid: 'PMC7145558',
          doi: '10.1093/nar/gkz981',
          source_db_version: '2020.06.01',
          source_db_name: source_db_name,
          full_name: 'Therapeutic Target Database',
          license: 'Unclear. Website states "All Rights Reserved" but resource structure and description in 2002 publication indicate "open-access".',
          license_link: 'https://academic.oup.com/nar/article/30/1/412/1331814'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def import_claims
      CSV.foreach(file_path, headers: true, col_sep: ',') do |row|
        highest_status = row['Highest_status']
        if ['Terminated', 'Withdrawn from market', 'Investigative'].include?(highest_status) || highest_status =~ /Discontinued/
          next
        end

        gene_name, gene_abbreviation = row['Target_Name'].split(' (', 2)
        gene_abbreviation.sub!(')', '')
        gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
        create_gene_claim_alias(gene_claim, gene_abbreviation, GeneNomenclature::SYMBOL)
        create_gene_claim_alias(gene_claim, "ttd.target:#{row['TargetID']}", GeneNomenclature::TTD_ID)

        drug_claim = create_drug_claim(row['Drug_Name'].gsub(/\A"|"\Z/, ''), DrugNomenclature::PRIMARY_NAME)
        create_drug_claim_alias(drug_claim, "ttd.drug:#{row['DrugID']}", DrugNomenclature::TTD_ID)

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        if !row['MOA'].nil? && !row['MOA'] == '.'
          create_interaction_claim_type(
            interaction_claim,
            Genome::Normalizers::InteractionClaimType.name_normalzier(row['MOA'])
          )
        end

        # this is not a typo but the actual column header from the source file
        unless row['Referecnce'].nil?
          row['Referecnce'].split('; ').each do |ref|
            if ref.include? 'pubmed'
              url, _sep, pmid = ref.rpartition('/')
              pmid = url.rpartition('/').last if pmid == ''
              create_interaction_claim_publication(interaction_claim, pmid) if !pmid == '217546303'
            end
            if ref.include? 'pmc'
              url, _sep, pmcid = ref.rpartition('/')
              pmcid = url.rpartition('/').last if pmcid == ''
              create_interaction_claim_publication_by_pmcid(interaction_claim, pmcid)
            end
          end
        end

        create_interaction_claim_link(interaction_claim, 'TTD Target Information', "http://idrblab.net/ttd/data/target/details/#{row['TargetID']}")
      end
      backfill_publication_information
    end
  end
end; end; end; end;
