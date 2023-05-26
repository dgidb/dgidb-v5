module Genome; module Importers; module FileImporters; module Cgi
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'CGI'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.cancergenomeinterpreter.org/biomarkers',
          site_url: 'https://www.cancergenomeinterpreter.org/',
          citation: 'Tamborero D, Rubio-Perez C, Deu-Pons J, Schroeder MP, Vivancos A, Rovira A, Tusquets I, Albanell J, Rodon J, Tabernero J, de Torres C, Dienstmann R, Gonzalez-Perez A, Lopez-Bigas N. Cancer Genome Interpreter annotates the biological and clinical relevance of tumor alterations. Genome Med. 2018 Mar 28;10(1):25. doi: 10.1186/s13073-018-0531-8. PMID: 29592813; PMCID: PMC5875005.',
          citation_short: 'Tamborero D, et al. Cancer Genome Interpreter annotates the biological and clinical relevance of tumor alterations. Genome Med. 2018 Mar 28;10(1):25.',
          pmid: '29592813',
          pmcid: 'PMC5875005',
          doi: '10.1186/s13073-018-0531-8',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'Cancer Genome Interpreter',
          license: License::CC_BY_NC_4_0,
          license_link: 'https://www.cancergenomeinterpreter.org/faq#q19'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    # at least 1 CGI entry includes a pesky nbsp character,
    # and some names are surrounded with brackets
    def clean_drug_name(drug_name)
      drug_name.gsub(/[[:space:]]/, '').gsub(/\[(.*)\]/, '\1')
    end

    def clean_drug_attribute(drug_attribute)
      drug_attribute.gsub(/\[(.*)\]/, '\1')
    end

    def create_cgi_dca(drug_claim, attribute_name, attribute_value)
      clean_drug_attribute(attribute_value).split(';').each do |split_value|
        split_value.split('&').each do |cleaned_value|
          create_drug_claim_attribute(drug_claim, attribute_name, cleaned_value)
        end
      end
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        next if row['Drug'].nil? || row['Drug'] == '[]'

        if row['Drug'].include?(',') || row['Drug'].include?(';')
          combination_drug_name = row['Drug']
          combination_drug_name.scan(/[a-zA-Z0-9]+/).each do |individual_drug_name|
            individual_drug_name = clean_drug_name(individual_drug_name)
            drug_claim = create_drug_claim(individual_drug_name)
            create_cgi_dca(drug_claim, DrugAttributeName::DRUG_CLASS, row['Drug family'])
            if row['Gene'].include?(';')
              row['Gene'].split(';').each do |indv_gene|
                gene_claim = create_gene_claim(indv_gene, GeneNomenclature::NAME)
                interaction_claim = create_interaction_claim(gene_claim, drug_claim)
                create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION, combination_drug_name)
                create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
                add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
                create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
              end
            else
              gene_claim = create_gene_claim(row['Gene'], GeneNomenclature::NAME)
              interaction_claim = create_interaction_claim(gene_claim, drug_claim)
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION, combination_drug_name)
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
              add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
              create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
            end
          end
          if row['Drug'].include?(';')
            combination_drug_name = row['Drug']
            combination_drug_name.split(';').each do |individual_drug_name|
              individual_drug_name = clean_drug_name(individual_drug_name)
              drug_claim = create_drug_claim(individual_drug_name)
              create_cgi_dca(drug_claim, DrugAttributeName::DRUG_CLASS, row['Drug family'])
              if row['Gene'].include?(';')
                row['Gene'].split(';').each do |indv_gene|
                  gene_claim = create_gene_claim(indv_gene, GeneNomenclature::NAME)
                  interaction_claim = create_interaction_claim(gene_claim, drug_claim)
                  create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION, combination_drug_name)
                  create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
                  add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
                  create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
                end
              else
                gene_claim = create_gene_claim(row['Gene'], GeneNomenclature::NAME)
                interaction_claim = create_interaction_claim(gene_claim, drug_claim)
                create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION, combination_drug_name)
                create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
                add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
                create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
              end
            end
          end
        else
          drug_name = clean_drug_name(row['Drug'])
          drug_claim = create_drug_claim(drug_name)
          create_cgi_dca(drug_claim, DrugAttributeName::DRUG_CLASS, row['Drug family'])
          if row['Gene'].include?(';')
            row['Gene'].split(';').each do |indv_gene|
              gene_claim = create_gene_claim(indv_gene, GeneNomenclature::NAME)
              interaction_claim = create_interaction_claim(gene_claim, drug_claim)
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
              add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
              create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
            end
          else
            gene_claim = create_gene_claim(row['Gene'], GeneNomenclature::NAME)
            interaction_claim = create_interaction_claim(gene_claim, drug_claim)
            create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ALTERATION, row['Alteration'])
            add_interaction_claim_publications(interaction_claim, row['Source']) if row['Source'].include?('PMID')
            create_interaction_claim_link(interaction_claim, 'Cancer Biomarkers database', 'https://www.cancergenomeinterpreter.org/biomarkers')
          end
        end
      end
      backfill_publication_information
    end

    def add_interaction_claim_publications(interaction_claim, source_string)
      if source_string.include?(';')
        source_string.split(';').each do |value|
          value.split(/[^\d]/).each do |pmid|
            create_interaction_claim_publication(interaction_claim, pmid) unless pmid.nil? || pmid == ''
          end
        end
      else
        source_string.split(':').last do |pmid|
          create_interaction_claim_publication(interaction_claim, pmid)
        end
      end
    end
  end
end; end; end; end;
