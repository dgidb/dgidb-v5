export const truncateDecimals = (numb: number, digits: number) => {
  var multiplier = Math.pow(10, digits),
    adjustedNum = numb * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

export const DIRECTIONALITY_LABELS = [
  'Activating',
  'Inhibiting',
  'N/A',
] as const;

export type DirectionalityLabel = (typeof DIRECTIONALITY_LABELS)[number];

interface InteractionTypeDirectionality {
  directionality?: string | null;
}

const normalizeDirectionality = (
  directionality?: string | null
): DirectionalityLabel => {
  switch (directionality?.toUpperCase()) {
    case 'ACTIVATING':
      return 'Activating';
    case 'INHIBITORY':
      return 'Inhibiting';
    default:
      return 'N/A';
  }
};

export const normalizeDirectionalities = (
  interactionTypes?: InteractionTypeDirectionality[] | null
): DirectionalityLabel[] => {
  if (!interactionTypes?.length) {
    return ['N/A'];
  }

  return Array.from(
    new Set(
      interactionTypes.map(({ directionality }) =>
        normalizeDirectionality(directionality)
      )
    )
  );
};
