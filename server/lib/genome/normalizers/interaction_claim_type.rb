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
        InteractionClaimType.all.each do |ict|
          normalized_ict = InteractionClaimType.where(type: name_normalizer(ict.type)).first_or_create
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
        InteractionClaimType.find_by(type: 'n/a')
      end

      def self.other_type
        InteractionClaimType.find_by(type: 'other/unknown')
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
        when 'na', 'n/a'
          'na'
        when 'other', 'unknown', 'protector', 'oxidizer', 'coating agent', 'dilator', 'deoxidizer',
            'diffusing substance', 'vesciant', 'gene replacement', 'opener', 'releasing agent', 'substrate',
            'vaccine antigen'
          'other/unknown'
        when 'moduator', 'cross-linking agent', 'neutralizer', 'reducer', 'metabolizer', 'acetylation',
            'chelator', 'cross-linking/alkylation', 'regulator', 'stabiliser'
          'modulator'
        when 'positive modulator', 'positive allosteric modulator', 'regulator (upregulator)', 'enhancer',
            'modulator (allosteric modulator)'
          'positive modulator'
        when 'inhibitor', 'inhibitor, competitive', 'gating inhibitor', 'inhibitor; antagonist; blocker',
            'inhibitor (gating inhibitor)', 'growth_inhibition', 'inhibition', 'weak inhibitor',
            'aggregation inhibitor', 'inhibition of synthesis', 'translocation inhibitor',
            'inhibits downstream inflammation cascades', 'inactivator', 'inihibitor', 'inhibitors',
            'anti-angiogenic.', 'allosteric inhibitor', 'antagonist', 'antisense inhibitor'
          'inhibitor'
        when 'blocker', 'channel blocker', 'blocker (channel blocker)', 'nucleotide exchange blocker'
          'blocker'
        when 'antisense', 'sirna drug'
          'antisense oligonucleotide'
        when 'binding agent', 'binding', 'binder (minor groove binder)', 'breaker'
          'binder'
        when 'negative modulator', 'negative allosteric modulator', 'disrupting agent',
            'incorporation into and destabilization', 'intercalation', 'desensitize the target', 'disrupter',
            'intercalator', 'downregulator', 'allosteric antagonist'
          'negative modulator'
        when 'inhibitory immune response', 'car-t-cell-therapy(dual specific)', 'immunomodulator',
            'immunomodulator (immunostimulant)', 'immune response agent', 'car-t-cell-therapy',
            'immunostimulant', 'immunostimulator', 'Radioimmunotherapy'
          'immunotherapy'
        when 'component of'
          'product of'
        when 'opener'  # TODO: duplicate w/ 'other/unknown' -- how to resolve?
          'potentiator'
        when 'stablizer', 'stabilization', 'stabilizer'
          'chaperone'
        when 'activator', 'reactivator'
          'activator'
        when 'partial agonist', 'agonist', 'co-agonist'
          'agonist'
        when 'inverse agonist', 'agonis; inverse agonist', 'inverse_agonist'
          'inverse agonist'
        when 'cytotoxicity'
          'cytotoxic'
        when 'proteolytic enzyme', 'hydrolytic enzyme', 'degrader', 'degradation'
          'cleavage'
        end
      end

      def self.claim_type_attributes
        InteractionClaimAttribute.where('lower(name) = ?', 'interaction type')
                                 .includes(interaction_claim: [:interaction_claim_types])
      end

      def self.all_interaction_claim_types
        InteractionClaimType.all.each_with_object({}) do |i, h|
          h[i.type] = i
        end
      end

      def self.remove_empty_types
        InteractionClaimType.includes(:interaction_claims).where(interaction_claims: {id: nil}).destroy_all
      end
    end
  end
end
