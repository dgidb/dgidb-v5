module Genome; module Importers; module FileImporters; module HopkinsGroom;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'HopkinsGroom'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.uniprot.org/uniprot/',
          site_url: 'http://www.ncbi.nlm.nih.gov/pubmed/12209152/',
          citation: 'Hopkins AL, Groom CR. The druggable genome. Nat Rev Drug Discov. 2002 Sep;1(9):727-30. doi: 10.1038/nrd892. PMID: 12209152.',
          citation_short: 'Hopkins AL, et al. The druggable genome. Nat Rev Drug Discov. 2002 Sep;1(9):727-30.',
          pmid: '12209152',
          doi: '10.1038/nrd892',
          source_db_version: '11-Sep-2012',
          source_db_name: source_db_name,
          full_name: 'The druggable genome (Hopkins & Groom, 2002)',
          license: 'Supplementary data from Nature Publishing Group copyright publication',
          license_link: 'https://www.nature.com/articles/nrd892'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim("uniprot:#{row['Uniprot_Acc']}", GeneNomenclature::UNIPROTKB_ID)
        create_gene_claim_alias(gene_claim, row['Uniprot_Id'].upcase, GeneNomenclature::UNIPROTKB_NAME)
        create_gene_claim_alias(gene_claim, row['Uniprot_Protein_Name'].upcase, GeneNomenclature::UNIPROTKB_PROTEIN_NAME)
        unless row['Uniprot_Gene_Name'] == 'N/A'
          create_gene_claim_alias(gene_claim, row['Uniprot_Gene_Name'].upcase, GeneNomenclature::UNIPROTKB_GENE_NAME)
        end
        unless row['Entrez_Id'] == 'N/A'
          create_gene_claim_alias(gene_claim, "ncbigene:#{row['Entrez_Id'].upcase}", GeneNomenclature::NCBI_ID)
        end
        row['Ensembl_Id'].split('; ').each do |ensembl_id|
          create_gene_claim_alias(gene_claim, "ensembl:#{ensembl_id.upcase}", GeneNomenclature::ENSEMBL_ID) unless ensembl_id == 'N/A'
        end
        create_gene_claim_category(gene_claim, 'DRUGGABLE GENOME')
        unless row['DGIDB_Human_Readable'] == 'N/A'
          create_gene_claim_category(gene_claim, row['DGIDB_Human_Readable'].gsub('/', ' ').gsub('.', '_').upcase.strip)
        end
        create_gene_claim_attribute(gene_claim, GeneAttributeName::INTERPRO_ACC_ID, "interpro:#{row['Interpro_Acc']}")
        create_gene_claim_attribute(gene_claim, GeneAttributeName::UNIPROTKB_EV, row['Uniprot_Evidence'])
        create_gene_claim_attribute(gene_claim, GeneAttributeName::UNIPROTKB_STATUS, row['Uniprot_Status'])
        create_gene_claim_attribute(gene_claim, GeneAttributeName::INTERPRO_NAME_SHORT, row['Interpro_Short_Name'])
        create_gene_claim_attribute(gene_claim, GeneAttributeName::INTERPRO_TYPE, row['Interpro_Type'])
      end
    end
  end
end; end; end; end;
