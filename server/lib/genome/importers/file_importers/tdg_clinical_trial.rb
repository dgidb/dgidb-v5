module Genome; module Importers; module FileImporters; module TdgClinicalTrial;
  # http://www.annualreviews.org/doi/suppl/10.1146/annurev-pharmtox-011613-135943/suppl_file/pa54_rask-andersen_suptable1.xlsx
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'TdgClinicalTrial'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://clinicaltrials.gov/ct2/results?Search=Search&term=', # TODO: is this correct?
          site_url: 'http://www.ncbi.nlm.nih.gov/pubmed/24016212',
          citation: 'Rask-Andersen M, Masuram S, Schiöth HB. The druggable genome: Evaluation of drug targets in clinical trials suggests major shifts in molecular class and indication. Annu Rev Pharmacol Toxicol. 2014;54:9-26. doi: 10.1146/annurev-pharmtox-011613-135943. Epub 2013 Aug 30. PMID: 24016212.',
          citation_short: 'Rask-Andersen M, Masuram S, Schiöth HB. The druggable genome: Evaluation of drug targets in clinical trials suggests major shifts in molecular class and indication. Annu Rev Pharmacol Toxicol. 2014;54:9-26. doi: 10.1146/annurev-pharmtox-011613-135943. Epub 2013 Aug 30. PMID: 24016212.',
          pmid: '24016212',
          doi: '10.1146/annurev-pharmtox-011613-135943',
          source_db_version: 'Jan-2014',
          source_db_name: source_db_name,
          full_name: 'The Druggable Genome: Evaluation of Drug Targets in Clinical Trials Suggests Major Shifts in Molecular Class and Indication (Rask-Andersen, Masuram, Schioth 2014)',
          license: 'Supplementary table from Annual Reviews copyright publication',
          license_link: 'https://www.annualreviews.org/doi/suppl/10.1146/annurev-pharmtox-011613-135943'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def add_approval_data(drug_claim, approval_value)
      if [
        'mineral', 'not approved', 'not approved by the FDA', 'not disclosed', 'approved, withdrawn',
        'withdrawn', 'not approved (orphan status)', 'Approved before 1982', 'approved'
      ].include? approval_value
        create_drug_claim_approval_rating(drug_claim, approval_value)
      else
        # add inferred approval if only given year
        create_drug_claim_approval_rating(drug_claim, 'Approved')
        create_drug_claim_attribute(drug_claim, DrugAttributeName::APPROVAL_YEAR, approval_value)
      end
    end

    def skip_row(row)
      uniprot_acc_num = row['Uniprot Accession number'].downcase
      return true if ['not specified', 'not applicable', 'dna', 'unknown', 'non-human target'].include?(uniprot_acc_num)
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t", encoding: 'iso-8859-1:utf-8') do |row|
        next if skip_row(row)

        gene_claim = create_gene_claim("uniprot:#{row['Uniprot Accession number']}", GeneNomenclature::UNIPROTKB_ID)
        create_gene_claim_alias(gene_claim, row['Gene'], GeneNomenclature::SYMBOL)
        unless row['Target main class'].blank? || %w[unknown Unknown_function Other Other_receptors Other_transporters OtherCD1].include?(row['Target main class'])
          create_gene_claim_attribute(gene_claim, GeneAttributeName::CLASS, row['Target main class'])
        end
        unless row['Target class'].nil?
          row['Target class'].split(';').each do |subclass|
            create_gene_claim_attribute(gene_claim, GeneAttributeName::SUBCLASS, subclass)
          end
        end

        drug_claim = create_drug_claim(row['Drug Name'].upcase)
        row['Indication(s)'].gsub('"', '').split(',').each do |indication|
          create_drug_claim_attribute(drug_claim, DrugAttributeName::INDICATION, indication)
        end

        create_drug_claim_attribute(drug_claim, DrugAttributeName::DRUG_CLASS, row['Drug Class'])
        add_approval_data(drug_claim, row['Year of Approval (FDA)'])

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_attribute(
          interaction_claim,
          InteractionAttributeName::CLINICAL_TRIAL_NAME,
          row['Trial name']
        ) unless row['Trial name'] == '-'
        create_interaction_claim_attribute(
          interaction_claim,
          InteractionAttributeName::NOVEL,
          row['Target_Novelty_VALIDATED']
        )
        create_interaction_claim_link(interaction_claim, source.citation, 'https://www.annualreviews.org/doi/10.1146/annurev-pharmtox-011613-135943')
      end
    end
  end
end; end; end; end;
