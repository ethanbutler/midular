import React from "react";
import { PianoBar } from "components/PianoBar/PianoBar";
import { NOTE_WHEEL_SHARPS } from "../../constants";

type NoteName = typeof NOTE_WHEEL_SHARPS[number];
export type Note = `${NoteName}${number}`;

export function useKeySelectionProvider() {
  const [lastNote, setLastNote] = React.useState<Note>("C3");

  return {
    lastNote,
    setLastNote,
  };
}

const KeySelectionContext = React.createContext<
  ReturnType<typeof useKeySelectionProvider>
>(null as any);

interface KeySelectionProps {
  children: React.ReactNode;
}

/**
 * Provides key selection values to children, and renders
 * a fixed-position PianoBar for note entry.
 */
export function KeySelection({ children }: KeySelectionProps) {
  const ctx = useKeySelectionProvider();

  return (
    <KeySelectionContext.Provider value={ctx}>
      {children}
      <PianoBar />
    </KeySelectionContext.Provider>
  );
}

interface UseKeySelectionContextArgs {
  onChange?: (note: Note) => void;
}

/**
 * Access the key selection values.
 */
export function useKeySelectionContext({
  onChange = () => {},
}: UseKeySelectionContextArgs = {}) {
  const ctx = React.useContext(KeySelectionContext);
  if (!ctx) throw new Error("BUG: Using keyselection outside of a provider.");

  React.useEffect(() => {
    onChange(ctx.lastNote);
  }, [onChange, ctx.lastNote]);

  return ctx;
}
