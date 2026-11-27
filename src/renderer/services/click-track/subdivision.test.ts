import { describe, expect, it } from 'vitest';
import { clicksPerBeat, subdivisionChoices } from './subdivision';

describe('click subdivisions', () => {
  it('divides a simple beat into quarters, eighths, sixteenths, and tuplets', () => {
    expect(clicksPerBeat('beat', false)).toBe(1);
    expect(clicksPerBeat('eighth', false)).toBe(2);
    expect(clicksPerBeat('sixteenth', false)).toBe(4);
    expect(clicksPerBeat('triplet', false)).toBe(3);
    expect(clicksPerBeat('sextuplet', false)).toBe(6);
  });

  it('divides a compound beat into threes, and offers a duplet instead of a triplet', () => {
    expect(clicksPerBeat('beat', true)).toBe(1);
    expect(clicksPerBeat('eighth', true)).toBe(3);
    expect(clicksPerBeat('sixteenth', true)).toBe(6);
    expect(clicksPerBeat('duplet', true)).toBe(2);
    expect(clicksPerBeat('sextuplet', true)).toBe(9);

    const labels = subdivisionChoices(true, 8).map((choice) => choice.label);

    expect(labels).toEqual([
      'Dotted quarter notes',
      'Eighth notes',
      'Sixteenth notes',
      'Duplets',
      'Sixteenth-note triplets',
    ]);
  });

  it('names a 4/4 beat as a quarter note and a 2/2 beat as a half note', () => {
    expect(subdivisionChoices(false, 4).map((choice) => choice.label)).toEqual([
      'Quarter notes',
      'Eighth notes',
      'Sixteenth notes',
      'Eighth-note triplets',
      'Sixteenth-note triplets',
    ]);
    expect(subdivisionChoices(false, 2)[0].label).toBe('Half notes');
    expect(subdivisionChoices(false, 2)[0].glyph).toBe('half');
  });
});
