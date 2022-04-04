module Genome
  module Normalizers
    # Normalize drug claim attribute values
    class DrugClaimAttribute
      def self.normalize(attribute_name, value)
        value = value.strip
        value_lower = value.downcase

        case attribute_name
        when 'Drug Class'
          normalize_class(value_lower)
        when 'Drug Indication'
          value # TODO
        when 'Regulatory Approval'
          normalize_approval(value_lower)
        when 'Name of the Ligand Species (if a Peptide)'
          value_lower
        when 'Notes'
          value
        when 'Pharmaceutical Developer'
          normalize_developer(value_lower)
        when 'Year of Approval'
          normalize_approval_yr(value_lower)
        end
      end

      def self.normalize_approval(value)
        case value
        when 'approved'
          'approved'
        when 'withdrawn', 'approved, withdrawn'
          'withdrawn'
        when 'not approved', 'not approved by the FDA'
          'not approved'
        when 'not approved (orphan status)'
          'orphan designation'
        end
      end

      def self.normalize_approval_yr(value)
        return value if value =~ /^\d\d\d\d$/ || value == 'approved before 1982'
      end

      def self.normalize_indication(value)
        raise StandardError 'WIP: not sure what to do here'
      end

      def self.normalize_developer(value)
        case value
        when 'AstraZeneca', 'AstraZenica'
          'AstraZeneca'
        when 'Millenium', 'Millenium Pharmaceuticals'
          'Millenium Pharmaceuticals'
        when 'Sanofi-Aventis', 'Sanofi'
          'Sanofi'
        else
          value
        end
      end

      def self.normalize_class(value)
        return value.singularize if value != 'unknown'
      end
    end
  end
end
