include ActionView::Helpers::SanitizeHelper

module Genome; module Importers; module FileImporters; module GuideToPharmacology;
  # gene_file_path should point to `gtop_targets_and_families_*.tsv`
  # interaction_file_path should point to `gtop_interactions_*.tsv`
  class Importer < Genome::Importers::Base
    attr_reader :interaction_file_path, :gene_file_path, :target_to_entrez

    def initialize(interaction_file_path, gene_file_path)
      @interaction_file_path = handle_gtop_file_location(interaction_file_path, "interactions")
      @gene_file_path = handle_gtop_file_location(gene_file_path, "targets_and_families")
      @target_to_entrez = {}
      @source_db_name = 'GuideToPharmacology'
    end

    def create_claims
      import_gene_claims
      import_interaction_claims
    end

    private

    def handle_gtop_file_location(file_path, datatype)
      return file_path unless file_path.nil?

      raise "Unrecognized GtoP datatype: #{datatype}" unless %w[targets_and_families interactions].include? datatype

      directory = "#{default_data_dir}/guidetopharmacology/"
      Dir.glob(File.join(directory, "gtop_#{datatype}_*.tsv"))
         .max_by { |file| file.match(/gtop_#{datatype}_(\d+)\.db/)[1].to_i rescue 0 }
    end

    def get_version
      version = ''
      File.open(@interaction_file_path, 'r') do |file|
        header = file.readline.strip
        match = header.match(/^"# GtoPdb Version: (\d+\.\d+)/)
        version = match[1] if match
      end
      if version.empty?
        Rails.logger.error("Could not extract version number from GtoP interactions file")
      end
      version
    end

    def create_new_source
      @source ||= Source.create(
        base_url: 'http://www.guidetopharmacology.org/DATA/',
        citation: 'Armstrong JF, Faccenda E, Harding SD, Pawson AJ, Southan C, Sharman JL, Campo B, Cavanagh DR, Alexander SPH, Davenport AP, Spedding M, Davies JA; NC-IUPHAR. The IUPHAR/BPS Guide to PHARMACOLOGY in 2020: extending immunopharmacology content and introducing the IUPHAR/MMV Guide to MALARIA PHARMACOLOGY. Nucleic Acids Res. 2020 Jan 8;48(D1):D1006-D1021. doi: 10.1093/nar/gkz951. PMID: 31691834; PMCID: PMC7145572.',
        citation_short: 'Armstrong JF, et al. The IUPHAR/BPS Guide to PHARMACOLOGY in 2020: extending immunopharmacology content and introducing the IUPHAR/MMV Guide to MALARIA PHARMACOLOGY. Nucleic Acids Res. 2020 Jan 8;48(D1):D1006-D1021.',
        pmid: '31691834',
        pmcid: 'PMC7145572',
        doi: '10.1093/nar/gkz951',
        site_url: 'http://www.guidetopharmacology.org/',
        source_db_name: source_db_name,
        source_db_version: get_version,
        source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
        full_name: 'Guide to Pharmacology',
        license: License::CC_BY_SA_4_0,
        license_link: 'https://www.guidetopharmacology.org/about.jsp'
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def import_gene_claims
      refseq_id_pattern = /^((AC|AP|NC|NG|NM|NP|NR|NT|NW|XM|XP|XR|YP|ZP)_\d+|(NZ\_[A-Z]{4}\d+))(\.\d+)?$/

      CSV.foreach(gene_file_path, headers: true, skip_lines: /GtoPdb Version/, col_sep: "\t") do |line|
        gene_lui = line['Human Entrez Gene']
        next if blank?(gene_lui) || gene_lui.include?('|')

        gene_claim = create_gene_claim("NCBIGENE:#{gene_lui}", GeneNomenclature::NCBI_ID)
        target_to_entrez[line['Target id']] = gene_lui
        unless blank?(line['HGNC id'])
          create_gene_claim_alias(gene_claim, "hgnc:#{line['HGNC id']}", GeneNomenclature::HGNC_ID)
        end
        if blank?(line['HGNC symbol']) || (line['HGNC symbol'] != line['HGNC symbol'].to_i.to_s)
          create_gene_claim_alias(gene_claim, line['HGNC symbol'], GeneNomenclature::SYMBOL)
        end
        create_gene_claim_alias(gene_claim, line['HGNC name'], GeneNomenclature::NAME) unless blank?(line['HGNC name'])
        create_gene_claim_alias(gene_claim, "iuphar.receptor:#{line['Target id']}", GeneNomenclature::GTOP_ID)
        create_gene_claim_alias(gene_claim, line['Target name'], GeneNomenclature::NAME)
        unless blank?(line['Human nucleotide RefSeq'])
          line['Human nucleotide RefSeq'][7..].split('|') do |acc|
            if acc.match(refseq_id_pattern)
              create_gene_claim_alias(gene_claim, "refseq:#{acc}", GeneNomenclature::REFSEQ_ACC)
            end
          end
        end
        unless blank?(line['Human protein RefSeq'])
          line['Human protein RefSeq'][7..].split('|') do |acc|
            if acc.match(refseq_id_pattern)
              create_gene_claim_alias(gene_claim, "refseq:#{acc}", GeneNomenclature::REFSEQ_ACC)
            end
          end
        end
        unless blank?(line['Human SwissProt'])
          line['Human SwissProt'].split('|').each do |swissprot_id|
            create_gene_claim_alias(gene_claim, "uniprot:#{swissprot_id}", GeneNomenclature::UNIPROTKB_ID)
          end
        end

        create_gene_claim_attribute(gene_claim, GeneAttributeName::GTOP_FAMILY_NAME, line['Family name'])
        create_gene_claim_attribute(gene_claim, GeneAttributeName::GTOP_FAMILY_ID, "iuphar.family:#{line['Family id']}")

        category_lookup = {
          # "catalytic_receptor" => '',
          'enzyme' => 'ENZYME',
          'gpcr' => 'G PROTEIN COUPLED RECEPTOR',
          'lgic' => 'ION CHANNEL',
          'nhr' => 'NUCLEAR HORMONE RECEPTOR',
          'other_ic' => 'ION CHANNEL',
          # 'other_protein' => '',
          'transporter' => 'TRANSPORTER',
          'vgic' => 'ION CHANNEL'
        }
        create_gene_claim_category(gene_claim, category_lookup[line['Type']]) if category_lookup.key? line['Type']
      end
    end

    def import_interaction_claims
      CSV.foreach(interaction_file_path, headers: true, skip_lines: /GtoPdb Version/, col_sep: "\t") do |line|
        next unless valid_interaction_line?(line)

        gene_claim = create_gene_claim("NCBIGENE:#{line['Target ID']}", GeneNomenclature::NCBI_ID)
        create_gene_claim_aliases(gene_claim, line)

        drug_claim = create_drug_claim("iuphar.ligand:#{line['Ligand ID']}".upcase,
                                       DrugNomenclature::GTOP_LIGAND_ID)
        create_drug_claim_aliases(drug_claim, line)
        unless blank?(line['Ligand Species'])
          create_drug_claim_attribute(drug_claim, DrugAttributeName::SPECIES_NAME, line['Ligand Species'])
        end
        create_drug_claim_approval_rating(drug_claim, 'Approved') if line['Approved'] == 't'

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        type = line['Type'].downcase
        create_interaction_claim_type(interaction_claim, type) unless type == 'none'
        unless blank?(line['Pubmed ID'])
          line['Pubmed ID'].split('|').each do |pmid|
            create_interaction_claim_publication(interaction_claim, pmid)
          end
        end
        create_interaction_claim_attributes(interaction_claim, line)
        create_interaction_claim_link(interaction_claim, 'Ligand Biological Activity', "https://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=#{line['Ligand ID']}&tab=biology")
      end
      backfill_publication_information
    end

    # Valid interactions should:
    # * describe humans
    # * have pubchem substance IDs to ensure drug descriptiveness
    # * have ensembl gene IDs to ensure gene descriptiveness
    # * have NCBI gene IDs to ensure gene descriptiveness
    def valid_interaction_line?(line)
      line['Target Species'] == 'Human' && blank?(line['Target Ligand']) && !blank?(line['Ligand PubChem SID']) && !blank?(line['Target Ensembl Gene ID']) && !blank?(target_to_entrez[line['Target ID']])
    end

    def create_gene_claim_aliases (gene_claim, line)
      create_gene_claim_alias(gene_claim, line['Target'], GeneNomenclature::NAME) unless blank?(line['Target'])
      unless blank?(line['Target Ensembl Gene ID'])
        line['Target Ensembl Gene ID'].split('|').each do |ensembl_id|
          create_gene_claim_alias(gene_claim, "ensembl:#{ensembl_id}", GeneNomenclature::NCBI_ID)
        end
      end
      unless blank?(line['Target Gene Symbol'])
        line['Target Gene Symbol'].split('|').each do |gene_symbol|
          create_gene_claim_alias(gene_claim, gene_symbol, GeneNomenclature::SYMBOL)
        end
      end
      unless blank?(line['Target UniProt ID'])
        line['Target UniProt ID'].split('|').each do |uniprot_id|
          create_gene_claim_alias(gene_claim, "uniprot:#{uniprot_id}", GeneNomenclature::UNIPROTKB_ID)
        end
      end
    end

    def strip_tags(drug_alias)
      drug_alias.split('[PMID:')[0].strip
    end

    def create_drug_claim_aliases(drug_claim, line)
      create_drug_claim_alias(drug_claim, strip_tags(line['Ligand']).upcase, DrugNomenclature::GTOP_LIGAND_NAME)
      create_drug_claim_alias(drug_claim, "pubchem.substance:#{line['Ligand PubChem SID']}", DrugNomenclature::PUBCHEM_SUBSTANCE_ID)

      return if blank?(line['Ligand Gene Symbol'])

      line['Ligand Gene Symbol'].split('|').each do |gene_symbol|
        create_drug_claim_attribute(drug_claim, DrugAttributeName::GENE_SYMBOL, gene_symbol)
      end
    end

    def blank?(value)
      value.blank? || value == "''" || value == '""'
    end

    def create_interaction_claim_attributes(interaction_claim, line)
      attributes = {
        InteractionAttributeName::CONTEXT => line['Ligand Context'],
        InteractionAttributeName::BINDING_SITE => line['Receptor Site'],
        InteractionAttributeName::ASSAY => line['Assay Description'],
        InteractionAttributeName::MOA => line['Action'],
        InteractionAttributeName::DETAILS => line['Action comment'],
        InteractionAttributeName::ENDOGENOUS_DRUG => line['Endogenous'],
        InteractionAttributeName::DIRECT => line['Primary Target']
      }
      boolean_parser = {
        't' => 'True',
        'f' => 'False'
      }
      attributes.each do |name, value|
        next if blank?(value)

        parsed_value = boolean_parser[value] || value
        create_interaction_claim_attribute(interaction_claim, name, parsed_value)
      end
    end
  end
end; end; end; end;
