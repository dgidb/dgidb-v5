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
          citation: 'The druggable genome: Evaluation of drug targets in clinical trials suggests major shifts in molecular class and indication. Rask-Andersen M, Masuram S, Schioth HB. Annu Rev Pharmacol Toxicol. 2014;54:9-26. doi: 10.1146/annurev-pharmtox-011613-135943. PMID: 24016212',
          source_db_version: 'Jan-2014',
          source_db_name: source_db_name,
          full_name: 'The Druggable Genome: Evaluation of Drug Targets in Clinical Trials Suggests Major Shifts in Molecular Class and Indication (Rask-Andersen, Masuram, Schioth 2014)',
          license: 'Supplementary table from Annual Reviews copyright publication',
          license_link: 'https://www.annualreviews.org/doi/10.1146/annurev-pharmtox-011613-135943?url_ver=Z39.88-2003&rfr_id=ori%3Arid%3Acrossref.org&rfr_dat=cr_pub++0pubmed' # TODO: not sure what this is supposed to link to
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
        create_drug_claim_attribute(drug_claim, 'Year of Approval', approval_value)
      end
    end

    def skip_row(row)
      uniprot_acc_num = row['Uniprot Accession number'].downcase
      return true if ['not specified', 'not applicable', 'dna', 'unknown', 'non-human target'].include?(uniprot_acc_num)
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t", encoding: 'iso-8859-1:utf-8') do |row|
        next if skip_row(row)

        gene_claim = create_gene_claim("uniprot:#{row['Uniprot Accession number']}", 'UniprotKB ID')
        create_gene_claim_alias(gene_claim, row['Gene'], 'Gene Symbol')
        unless row['Target main class'].blank? || %w[unknown Unknown_function Other Other_receptors Other_transporters OtherCD1].include?(row['Target main class'])
          create_gene_claim_attribute(gene_claim, 'Target Class', row['Target main class'])
        end
        unless row['Target class'].nil?
          row['Target class'].split(';').each do |subclass|
            create_gene_claim_attribute(gene_claim, 'Target Subclass', subclass)
          end
        end

        drug_claim = create_drug_claim(row['Drug Name'].upcase, 'Drug Name')
        row['Indication(s)'].gsub('"', '').split(',').each do |indication|
          create_drug_claim_attribute(drug_claim, 'Drug Indications', indication)
        end

        create_drug_claim_attribute(drug_claim, 'Drug Class', row['Drug Class'])
        add_approval_data(drug_claim, row['Year of Approval (FDA)'])

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_attribute(interaction_claim, 'Clinical Trial Name', row['Trial name'])
        create_interaction_claim_attribute(interaction_claim, 'Novel Drug Target', row['Target_Novelty_VALIDATED'])
        create_interaction_claim_link(interaction_claim, source.citation, 'https://www.annualreviews.org/doi/10.1146/annurev-pharmtox-011613-135943')
      end
    end
  end
end; end; end; end;
