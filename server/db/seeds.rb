drug_claim_types = %w[antineoplastic other]
drug_claim_types.each do |name|
  DrugClaimType.where(type: name).first_or_create
end

gene_category_names = [
  'TRANSCRIPTION FACTOR COMPLEX', 'TRANSPORTER', 'PROTEIN PHOSPHATASE', 'CELL SURFACE', 'TUMOR SUPPRESSOR',
  'DNA REPAIR', 'KINASE', 'ION CHANNEL', 'SERINE THREONINE KINASE', 'TYROSINE KINASE', 'GROWTH FACTOR',
  'HISTONE MODIFICATION', 'NEUTRAL ZINC METALLOPEPTIDASE', 'DRUG RESISTANCE', 'PROTEASE',
  'TRANSCRIPTION FACTOR BINDING', 'NUCLEAR HORMONE RECEPTOR', 'G PROTEIN COUPLED RECEPTOR', 'PHOSPHOLIPASE',
  'PROTEASE INHIBITOR', 'HORMONE ACTIVITY', 'EXTERNAL SIDE OF PLASMA MEMBRANE', 'ABC TRANSPORTER',
  'DRUGGABLE GENOME', 'DRUG METABOLISM', 'RNA DIRECTED DNA POLYMERASE', 'LIPID KINASE', 'B30_2 SPRY DOMAIN',
  'CYTOCHROME P450', 'PHOSPHATIDYLINOSITOL 3 KINASE', 'MYOTUBULARIN RELATED PROTEIN PHOSPHATASE',
  'PTEN FAMILY', 'FIBRINOGEN', 'EXCHANGER', 'THIOREDOXIN', 'SHORT CHAIN DEHYDROGENASE REDUCTASE', 'LIPASE',
  'DNA DIRECTED RNA POLYMERASE', 'UNKNOWN', 'CLINICALLY ACTIONABLE', 'METHYL TRANSFERASE', 'ENZYME',
  'TRANSCRIPTION FACTOR'
]
gene_category_names.each do |name|
  GeneClaimCategory.where(name: name).first_or_create
end

interaction_claim_types = [
  {
    type: 'inverse agonist',
    directionality: 1,
    definition: 'An inverse agonist interaction occurs when a drug binds to the same target as an agonist, but induces a pharmacological response opposite to that of the agonist.',
    reference: '<a href="https://en.wikipedia.org/wiki/Inverse_agonist">Wikipedia - Inverse Agonist</a>'
  },
  {
    type: 'ligand',
    directionality: nil,
    definition: 'In ligand interactions, a drug forms a complex with its target protein to serve a biological function.',
    reference: '<a href="https://en.wikipedia.org/wiki/Ligand_(biochemistry)">Wikipedia - Ligand</a>'
  },
  {
    type: 'activator',
    directionality: 0,
    definition: 'An activator interaction is when a drug activates a biological response from a target, although the mechanism by which it does so may not be understood.',
    reference: 'DrugBank examples: <a href="http://www.ncbi.nlm.nih.gov/pubmed/12070353">pubmed:12070353</a>'
  },
  {
    type: 'n/a',
    directionality: nil,
    definition: 'DGIdb assigns this label to any drug-gene interaction for which the interaction type is not specified by the reporting source.',
    reference: nil
  },
  {
    type: 'negative modulator',
    directionality: 1,
    definition: 'In a negative modulator interaction, the drug negatively regulates the amount or activity of its target. In contrast to an inhibitory allosteric modulator, this interaction type may not involve any direct binding to the target.',
    reference: '<a href="https://en.wikipedia.org/wiki/Allosteric_modulator">Wikipedia - Allosteric Modulator</a>'
  },
  {
    type: 'partial agonist',
    directionality: 0,
    definition: 'In a partial agonist interaction, a drug will elicit a reduced amplitude functional response at its target receptor, as compared to the response elicited by a full agonist.',
    reference: '<a href="https://en.wikipedia.org/wiki/Receptor_antagonist#Partial_agonists">Wikipedia - Receptor Antagonist</a>'
  },
  {
    type: 'adduct',
    directionality: nil,
    definition: 'An adduct interaction is when a drug-protein adduct forms by the covalent binding of electrophilic drugs or their reactive metabolite(s) to a target protein.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/16199025">pubmed:16199025</a>'
  },
  {
    type: 'positive modulator',
    directionality: 0,
    definition: 'In a positive modulator interaction, the drug increases activity of the target enzyme.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/24699297">pubmed:24699297</a>'
  },
  {
    type: 'agonist',
    directionality: 0,
    definition: 'An agonist interaction occurs when a drug binds to a target receptor and activates the receptor to produce a biological response.',
    reference: '<a href="https://en.wikipedia.org/wiki/Agonist">Wikipedia - Agonist</a>'
  },
  {
    type: 'other/unknown',
    directionality: nil,
    definition: "This is a label given by the reporting source to an interaction that doesn't belong to other interaction types, as defined by the reporting source.",
    reference: nil
  },
  {
    type: 'product of',
    directionality: nil,
    definition: "These \"interactions\" occur when the target gene produces the endogenous drug.",
    reference: nil
  },
  {
    type: 'suppressor',
    directionality: 1,
    definition: 'In a suppressor interaction, the drug directly or indirectly affects its target, suppressing a physiological process.',
    reference: 'DrugBank examples: <a href="http://www.ncbi.nlm.nih.gov/pubmed/8386571">pubmed:8386571</a> <a href="http://www.ncbi.nlm.nih.gov/pubmed/14967460">pubmed:14967460</a>'
  },
  {
    type: 'allosteric modulator',
    directionality: nil,
    definition: 'An allosteric modulator interaction occurs when drugs exert their effects on their protein targets via a different binding site than the natural (orthosteric) ligand site.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/24699297">pubmed:24699297</a>'
  },
  {
    type: 'antisense oligonucleotide',
    directionality: 1,
    definition: 'An antisense oligonucleotide interaction occurs when a complementary RNA drug binds to an mRNA target to inhibit translation by physically obstructing the mRNA translation machinery.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/10228554">pubmed:10228554</a>'
  },
  {
    type: 'vaccine',
    directionality: 0,
    definition: 'In vaccine interactions, the drugs stimulate or restore an immune response to their target.',
    reference: '<a href="https://www.cancer.gov/about-cancer/treatment/types/immunotherapy#q3">NCI - Cancer Vaccines</a>'
  },
  {
    type: 'antibody',
    directionality: 1,
    definition: 'An antibody interaction occurs when an antibody drug specifically binds the target molecule.',
    reference: '<a href="https://en.wikipedia.org/wiki/Antibody#Medical_applications">Wikipedia - Antibody</a>'
  },
  {
    type: 'multitarget',
    directionality: nil,
    definition: 'In multitarget interactions, drugs achieve a physiological effect through simultaneous interaction with multiple gene targets.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/22768266">pubmed:22768266</a>'
  },
  {
    type: 'binder',
    directionality: nil,
    definition: 'A binder interaction has drugs physically binding to their target.',
    reference: 'DrugBank examples: <a href="http://www.ncbi.nlm.nih.gov/pubmed/12388666">pubmed:12388666</a> <a href="http://www.ncbi.nlm.nih.gov/pubmed/7584665">pubmed:7584665</a> <a href="http://www.ncbi.nlm.nih.gov/pubmed/14507470">pubmed:14507470</a>'
  },
  {
    type: 'cleavage',
    directionality: 1,
    definition: 'Cleavage interactions take place when the drug promotes degeneration of the target protein through cleaving of the peptide bonds.',
    reference: 'DrugBank examples: <a href="http://www.ncbi.nlm.nih.gov/pubmed/10666203">pubmed:10666203</a>'
  },
  {
    type: 'inhibitory allosteric modulator',
    directionality: 1,
    definition: 'In inhibitory allosteric modulator interactions, also called negative allosteric modulator interactions, the drug will inhibit activity of its target enzyme.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/24699297">pubmed:24699297</a>'
  },
  {
    type: 'antagonist',
    directionality: 1,
    definition: 'An antagonist interaction occurs when a drug blocks or dampens agonist-mediated responses rather than provoking a biological response itself upon binding to a target receptor.',
    "reference": "<a href=\"https://en.wikipedia.org/wiki/Receptor_antagonist\">Wikipedia - Receptor Antagonist</a>"
  },
  {
    type: 'blocker',
    directionality: 1,
    definition: 'Antagonist interactions are sometimes referred to as blocker interactions; examples include alpha blockers, beta blockers, and calcium channel blockers.',
    reference: '<a href="https://en.wikipedia.org/wiki/Receptor_antagonist">Wikipedia - Receptor Antagonist</a>'
  },
  {
    type: 'cofactor',
    directionality: 0,
    definition: "A cofactor is a drug that is required for a target protein's biological activity.",
    reference: '<a href="https://en.wikipedia.org/wiki/Cofactor_(biochemistry)">Wikipedia - Cofactor</a>'
  },
  {
    type: 'inducer',
    directionality: 0,
    definition: 'In inducer interactions, the drug increases the activity of its target enzyme.',
    reference: '<a href="https://en.wikipedia.org/wiki/Enzyme_inducer">Wikipedia - Enzyme Inducer</a>'
  },
  {
    type: 'inhibitor',
    directionality: 1,
    definition: 'In inhibitor interactions, the drug binds to a target and decreases its expression or activity. Most interactions of this class are enzyme inhibitors, which bind an enzyme to reduce enzyme activity.',
    reference: '<a href="https://en.wikipedia.org/wiki/Enzyme_inhibitor">Wikipedia - Enzyme Inhibitor</a>'
  },
  {
    type: 'modulator',
    directionality: nil,
    definition: 'In modulator interactions, the drug regulates or changes the activity of its target. In contrast to allosteric modulators, this interaction type may not involve any direct binding to the target.',
    reference: "Modulators. Segen's Medical Dictionary. (2011). <a href=\"http://medical-dictionary.thefreedictionary.com/modulators\">Retrieved online</a> October 9 2015."
  },
  {
    type: 'potentiator',
    directionality: nil,
    definition: "In a potentiator interaction, the drug enhances the sensitivity of the target to the target's ligands.",
    reference: '<a href="https://en.wikipedia.org/wiki/Potentiator">Wikipedia - Potentiator</a>'
  },
  {
    type: 'partial antagonist',
    directionality: 1,
    definition: 'In a partial antagonist interaction, a drug will only partially reduce the amplitude of a functional response at its target receptor, as compared to the reduction of response by a full antagonist.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/6188923">pubmed:6188923</a>'
  },
  {
    type: 'chaperone',
    directionality: 0,
    definition: 'Pharmacological chaperone interactions occur when substrates or modulators directly bind to a partially folded biosynthetic intermediate to stabilise the protein and allow it to complete the folding process to yield a functional protein.',
    reference: '<a href="http://www.ncbi.nlm.nih.gov/pubmed/17597553">pubmed:17597553</a>'
  },
  {
    type: 'stimulator',
    directionality: 0,
    definition: 'In a stimulator interaction, the drug directly or indirectly affects its target, stimulating a physiological response.',
    reference: 'DrugBank examples: <a href="http://www.ncbi.nlm.nih.gov/pubmed/23318685">pubmed:23318685</a> <a href="http://www.ncbi.nlm.nih.gov/pubmed/17148649">pubmed:17148649</a> <a href="http://www.ncbi.nlm.nih.gov/pubmed/15955613">pubmed:15955613</a>'
  },
  {
    type: 'substrate',
    directionality: nil,
    definition: 'Substrates are drugs which are metabolized by the protein they are interacting with.',
    reference: '<a href="https://www.fda.gov/drugs/drug-interactions-labeling/drug-development-and-drug-interactions-table-substrates-inhibitors-and-inducers">FDA - Table of Substrates, Inhibitors and Inducers</a>'
  }
]
interaction_claim_types.each do |claim_type|
  InteractionClaimType.where(
    type: claim_type[:type],
    directionality: claim_type[:directionality],
    definition: claim_type[:definition],
    reference: claim_type[:reference]
  ).first_or_create
end

trust_levels = ['Expert curated', 'Non-curated']
trust_levels.each do |level|
  SourceTrustLevel.where(level: level).first_or_create
end

source_types = [%w[gene Gene], %w[drug Drug], %w[interaction Interaction], %w[potentially_druggable Category]]
source_types.each do |source_type|
  SourceType.where(type: source_type[0], display_name: source_type[1]).first_or_create
end
