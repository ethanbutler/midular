export const MAX_MIDI_CHANNELS = 16;
export const NOTES_IN_OCTAVE = 12;
export const MIDDLE_C = 60;
export const MIDDLE_C_OCTAVE = 3;
export const OCTAVE_OFFSET = MIDDLE_C / NOTES_IN_OCTAVE - MIDDLE_C_OCTAVE;
export const NOTE_PATTERN = /([ABCDEFG][#b]?)(\d)/;
export const NOTE_WHEEL_SHARPS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
export const NOTE_WHEEL_FLATS = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;
export const MINUTE_IN_S = 60;
