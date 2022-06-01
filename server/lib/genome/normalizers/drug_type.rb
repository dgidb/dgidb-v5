module Genome
  module Normalizers
    class DrugTypeNormalizer
      def self.normalize_types
        drugs = antineoplastic_drugs
        puts "Found #{drugs.size} total antineoplastic drugs"
        drugs.each do |d|
          d.anti_neoplastic = true
          d.save!
        end
        drugs = immunotherapy_drugs
        puts "Found #{drugs.size} total immunotherapy drugs"
        drugs.each do |d|
          d.immunotherapy = true
          d.save!
        end
      end

      private_class_method def self.antineoplastic_drugs
        drugs_with_attributes = Drug.includes(:drug_attributes).where(
          'drug_attributes.value' => antineoplastic_type_names
        )
        drugs_from_sources = Drug.includes(drug_claims: [:source]).where(
          'sources.source_db_name' => antineoplastic_source_names
        )

        (drugs_from_sources + drugs_with_attributes).uniq(&:id)
      end

      private_class_method def self.immunotherapy_drugs
        Drug.includes(:drug_attributes).where('drug_attributes.value' => immunotherapy_type_names)
      end

      private_class_method def self.immunotherapy_type_names
        [
          'Antibody',
          'Antibody-Drug Conjugate',
          'Bovine Polyclonal Antibody',
          'Chimeric antibody',
          'Dna Based Immuno Therapy',
          'Immunomodulatory Agent',
          'Immunomodulatory Agents',
          'Immunostimulant',
          'Immunosuppressant',
          'Immunosuppressive Agent',
          'Immunosuppressive Agents',
          'Immunosupressive agents',
          'Immunotherapies',
          'Monoclonal Antibody',
          'Monoclonal Antibody',
          'Therapeutic Antibodies',
          'antiinflammatory agent,immunosuppressant'
        ]
      end

      private_class_method def self.antineoplastic_type_names
        [
          'Anticancer Agents',
          'Anticarcinogenic Agents',
          'Antineoplastic Adjuncts',
          'Antineoplastic Agent',
          'Antineoplastic Agents',
          'Antineoplastic Agents',
          'Antineoplastic Agents, Homeopathic Agents',
          'Antineoplastic Agents, Hormonal',
          'Antineoplastic Agents, Phytogenic',
          'Antineoplastic Agents, Protein Kinase Inhibitors',
          'Antineoplastic',
          'Antineoplastics'
        ]
      end

      private_class_method def self.antineoplastic_source_names
        [
          'CGI',
          'CKB',
          'CancerCommons',
          'CIViC',
          'ClearityFoundationBiomarkers',
          'ClearityFoundationClinicalTrial',
          'DoCM',
          'MyCancerGenome',
          'MyCancerGenomeClinicalTrial',
          'OncoKB',
          'TALC'
        ]
      end
    end
  end
end
