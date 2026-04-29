module Genome
  module Normalizers
    class DrugApprovalRatingNormalizer
      def self.normalize_approval_ratings
        approved_drugs = retrieve_approved_drugs
        puts "Found #{approved_drugs.size} total approved drugs"
        approved_drugs.each do |drug|
          unless drug.approved
            drug.approved = true
            drug.save
          end
        end
      end

      private_class_method def self.retrieve_approved_drugs
        Drug.includes(:drug_approval_ratings).where('drug_approval_ratings.rating' => approved_values)
      end

      private_class_method def self.approved_values
        [
          'Approved, Withdrawn', 'Prescription', 'Approved', 'Max Phase 4',
          'Over-the-Counter', 'Approved Before 1982', 'Prescribable'
        ]
      end
    end
  end
end
