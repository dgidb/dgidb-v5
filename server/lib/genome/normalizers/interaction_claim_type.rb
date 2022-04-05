module Genome
  module Normalizers
    class InteractionClaimType
      def self.normalize_types
        ActiveRecord::Base.transaction do
          normalize_existing_types
          fill_in_new_types
          cleanup_type(default_type)
          cleanup_type(other_type)
          # remove_empty_types
        end
      end

      def self.normalize_existing_types
        DataModel::InteractionClaimType.all.each do |ict|
          normalized_ict = DataModel::InteractionClaimType.where(type: name_normalizer(ict.type)).first_or_create
          next if ict == normalized_ict

          ict.interaction_claims.each do |ic|
            add_unless_exists(normalized_ict, ic)
            ic.interaction_claim_types.delete(ict)
            ic.save
          end
          ict.interactions.each do |i|
            add_unless_exists_for_interaction(normalized_ict, i)
            i.interaction_types.delete(ict)
            i.save
          end
          ict.delete
        end
      end

      def self.fill_in_new_types
        existing_types = all_interaction_claim_types
        claim_type_attributes.each do |ica|
          if type = existing_types[name_normalizer(ica.value)]
            add_unless_exists(type, ica.interaction_claim)
          end
          ica.delete
        end
      end

      def self.cleanup_type(type)
        type.interaction_claims.each do |ic|
          ic.interaction_claim_types.delete(type)
          ic.save
        end
      end

      def self.default_type
        DataModel::InteractionClaimType.find_by(type: 'n/a')
      end

      def self.other_type
        DataModel::InteractionClaimType.find_by(type: 'other/unknown')
      end

      def self.add_unless_exists(type, interaction_claim)
        unless interaction_claim.interaction_claim_types.include?(type)
          interaction_claim.interaction_claim_types << type
        end
      end

      def self.add_unless_exists_for_interaction(type, interaction)
        interaction.interaction_types << type unless interaction.interaction_types.include?(type)
      end

      def self.name_normalizer(val)
        val = val.downcase.strip

        case val
        when 'other/unknown','other', 'unknown', 'protector', 'oxidizer', 'coating agent', 'dilator', 'deoxidizer', 'diffusing substance', 'vesciant', 'gene replacement'
          'other/unknown'
        when 'modulator','neutralizer', 'reducer', 'metabolizer', 'acetylation', 'chelator', 'cross-linking/alkylation', 'regulator'
          'modulator'
        when 'positive modulator','positive allosteric modulator', 'regulator (upregulator)', 'enhancer', 'modulator (allosteric modulator)'
          'positive modulator'
        when 'inhibitor','inhibitor, competitive', 'gating inhibitor', 'inhibitor; antagonist; blocker', 'inhibitor (gating inhibitor)', 'growth_inhibition', 'inhibition', 'weak inhibitor', 'aggregation inhibitor', 'inhibition of synthesis', "translocation inhibitor", 'inhibits downstream inflammation cascades', 'inactivator', 'inihibitor', 'inhibitors', 'anti-angiogenic.', 'allosteric inhibitor'
          'inhibitor'
        when 'blocker','channel blocker', 'blocker (channel blocker)', 'nucleotide exchange blocker'
          'blocker'
        when 'antisense oligonucleotide','antisense', 'sirna drug'
          'antisense oligonucleotide'
        when 'binder','binding', 'binder (minor groove binder)', 'breaker'
          'binder'
        when 'negative modulator','incorporation into and destabilization', 'intercalation', 'desensitize the target', 'disrupter', 'intercalator', 'downregulator'
          'negative modulator'
        when 'immunotherapy','inhibitory immune response', 'car-t-cell-therapy(dual specific)', 'immunomodulator', 'immunomodulator (immunostimulant)', 'immune response agent', 'car-t-cell-therapy', 'immune response agent', 'immunostimulant', 'immunostimulator', 'Radioimmunotherapy'
          'immunotherapy'
        when 'product of','component of'
          'product of'
        when 'potentiator','opener'
          'potentiator'
        when 'chaperone','stablizer', 'stabilization', 'stabilizer'
          'chaperone'
        when 'activator','reactivator'
          'activator'
        when 'agonist','co-agonist'
          'agonist'
        when 'inverse agonist','agonis; inverse agonist', 'inverse_agonist'
          'inverse agonist'
        when 'cytotoxic','cytotoxicity'
          'cytotoxic'
        when 'cleavage','degradation'
          'cleavage'
        else
          val
        end
      end

      def self.claim_type_attributes
        DataModel::InteractionClaimAttribute.where('lower(name) = ?', 'interaction type')
        .includes(interaction_claim: [:interaction_claim_types])
      end

      def self.all_interaction_claim_types
        DataModel::InteractionClaimType.all.each_with_object({}) do |i, h|
          h[i.type] = i
        end
      end

      def self.remove_empty_types
        DataModel::InteractionClaimType.includes(:interaction_claims).where(interaction_claims: { id: nil }).destroy_all
      end
    end
  end
end
