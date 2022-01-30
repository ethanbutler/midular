import {
  NOTE_PATTERN,
  NOTE_WHEEL_FLATS,
  NOTE_WHEEL_SHARPS,
  OCTAVE_OFFSET,
  NOTES_IN_OCTAVE,
} from "../constants";

/** Given a string, return a MIDI pitch. */
export function getPitchFromNote(value: string) {
  // If someone enters a raw number, use it.
  if (/^\d+$/.test(value)) return Number(value);

  // If the string doesn't match a pattern, discard it.
  if (!NOTE_PATTERN.test(value)) return null;

  const [, note, octave] = NOTE_PATTERN.exec(value)!;
  const lookupList = note.includes("b") ? NOTE_WHEEL_FLATS : NOTE_WHEEL_SHARPS;
  return (
    lookupList.indexOf(note) +
    (Number(octave) + OCTAVE_OFFSET) * NOTES_IN_OCTAVE
  );
}

/**
 * Given a MIDI pitch, return the note name.
 *
 * TODO: This should return flats based on a global key.
 */
export function getNoteFromPitch(value: number) {
  const octave = Math.floor(value / NOTES_IN_OCTAVE) - OCTAVE_OFFSET;
  const remainder = value % NOTES_IN_OCTAVE;

  return `${NOTE_WHEEL_SHARPS[remainder]}${octave}`;
}
