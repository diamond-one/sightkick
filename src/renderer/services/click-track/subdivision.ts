export type Subdivision =
  | 'beat'
  | 'eighth'
  | 'sixteenth'
  | 'triplet'
  | 'sextuplet'
  | 'duplet';

export type NoteGlyph =
  | 'quarter'
  | 'half'
  | 'eighth'
  | 'sixteenth'
  | 'dottedQuarter'
  | 'triplet'
  | 'sextuplet'
  | 'duplet';

export interface SubdivisionChoice {
  id: Subdivision;
  label: string;
  glyph: NoteGlyph;
}

const SUBDIVISIONS: readonly Subdivision[] = [
  'beat',
  'eighth',
  'sixteenth',
  'triplet',
  'sextuplet',
  'duplet',
];
const SIMPLE_IDS: Subdivision[] = [
  'beat',
  'eighth',
  'sixteenth',
  'triplet',
  'sextuplet',
];
const COMPOUND_IDS: Subdivision[] = [
  'beat',
  'eighth',
  'sixteenth',
  'duplet',
  'sextuplet',
];

export function isSubdivision(value: unknown): value is Subdivision {
  return (
    typeof value === 'string' && SUBDIVISIONS.includes(value as Subdivision)
  );
}

// How many clicks fall inside one beat. A simple beat divides in twos
// (quarter, eighth, sixteenth). A compound beat is a dotted note, so the
// plain eighth is already three clicks and a triplet would not fit.
export function clicksPerBeat(
  subdivision: Subdivision,
  isCompound: boolean,
): number {
  switch (subdivision) {
    case 'eighth':
      return isCompound ? 3 : 2;

    case 'sixteenth':
      return isCompound ? 6 : 4;

    case 'triplet':
      return 3;

    case 'duplet':
      return 2;

    case 'sextuplet':
      return isCompound ? 9 : 6;

    default:
      return 1;
  }
}

function noteName(denominator: number): string {
  switch (denominator) {
    case 1:
      return 'Whole notes';

    case 2:
      return 'Half notes';

    case 4:
      return 'Quarter notes';

    case 8:
      return 'Eighth notes';

    case 16:
      return 'Sixteenth notes';

    case 32:
      return 'Thirty-second notes';

    default:
      return 'Beats';
  }
}

export function subdivisionChoices(
  isCompound: boolean,
  denominator = 4,
): SubdivisionChoice[] {
  const ids = isCompound ? COMPOUND_IDS : SIMPLE_IDS;

  return ids.map((id) => ({
    id,
    label: subdivisionLabel(id, isCompound, denominator),
    glyph: subdivisionGlyph(id, isCompound, denominator),
  }));
}

function subdivisionLabel(
  subdivision: Subdivision,
  isCompound: boolean,
  denominator: number,
): string {
  if (subdivision === 'beat') {
    if (isCompound) {
      return denominator === 8 ? 'Dotted quarter notes' : 'The beat';
    }

    return noteName(denominator);
  }

  if (subdivision === 'eighth') {
    return isCompound ? noteName(denominator) : noteName(denominator * 2);
  }

  if (subdivision === 'sixteenth') {
    return isCompound ? noteName(denominator * 2) : noteName(denominator * 4);
  }

  if (subdivision === 'triplet') {
    return denominator === 4 ? 'Eighth-note triplets' : 'Triplets';
  }

  if (subdivision === 'duplet') {
    return 'Duplets';
  }

  if ((isCompound && denominator === 8) || (!isCompound && denominator === 4)) {
    return 'Sixteenth-note triplets';
  }

  return 'Sextuplets';
}

function subdivisionGlyph(
  subdivision: Subdivision,
  isCompound: boolean,
  denominator: number,
): NoteGlyph {
  if (subdivision === 'beat') {
    if (isCompound) {
      return 'dottedQuarter';
    }

    if (denominator === 2) {
      return 'half';
    }

    if (denominator >= 8) {
      return 'eighth';
    }

    return 'quarter';
  }

  if (subdivision === 'eighth') {
    return 'eighth';
  }

  if (subdivision === 'sixteenth') {
    return 'sixteenth';
  }

  if (subdivision === 'triplet') {
    return 'triplet';
  }

  if (subdivision === 'duplet') {
    return 'duplet';
  }

  return 'sextuplet';
}
