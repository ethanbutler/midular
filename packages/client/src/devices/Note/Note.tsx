import React from "react";
import styled from "styled-components";
import { getNoteFromPitch, getPitchFromNote } from "helpers/midi";
import { useTriggerSubscription } from "hooks/useTrigger";
import { useMidi } from "hooks/useMidi";

/**
 * Encapsulates state for a note input. Returns the MIDI
 * pitch and a set of handlers to be added to an input.
 *
 * TODO: This isn't quite perfect – raw number inputs
 *   should be handled by blur events, not change events.
 */
export function useNoteInput(initial = "C3") {
  const [inputString, setInputString] = React.useState(initial);
  const [pitch, setPitch] = React.useState(getPitchFromNote(initial));

  if (pitch === null) throw new Error("BUG: Set pitch to an invalid value");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const determinedPitch = getPitchFromNote(e.target.value);
    if (determinedPitch) {
      setPitch(determinedPitch);
      setInputString(getNoteFromPitch(determinedPitch));
    } else {
      setInputString(e.target.value);
    }
  };

  return [
    pitch,
    {
      value: inputString,
      onChange,
    },
  ] as const;
}

/**
 * Renders an input for a musical note that will be emitted
 * when the device is triggered.
 */
export function Note({ channel, triggerChannel }: DeviceParameters) {
  const [pitch, inputProps] = useNoteInput();
  const { emitNote } = useMidi(channel);

  const isActive = useTriggerSubscription(triggerChannel || channel, {
    onTrigger: () => emitNote(pitch),
  });

  return (
    <Wrapper>
      <NoteInput {...inputProps} isActive={isActive} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoteInput = styled.input<{ isActive: boolean }>`
  display: block;
  width: 100%;
  border: none;
  background: none;
  text-align: center;
  color: var(--gridItemColor);
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;
