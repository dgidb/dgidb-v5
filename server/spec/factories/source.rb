FactoryBot.define do
  factory :source do
    source_db_name { 'Pharos' }
    full_name { 'Pharos' }
    source_db_version { '28-November-2022' }
    citation { 'Nguyen, D.-T., Mathias, S. et al, "Pharos: Collating Protein Information to Shed Light on the Druggable Genome", Nucl. Acids Res.i>, 2017, 45(D1), D995-D1002. DOI: 10.1093/nar/gkw1072. PMID: 27903890' }
    sequence(:id)
    license { 'Creative Commons Attribution-ShareAlike 4.0 International License' }
    license_link { 'https://pharos.nih.gov/about' }
  end
end
