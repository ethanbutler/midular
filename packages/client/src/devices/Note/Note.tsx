import React from "react";
import styled from "styled-components";
import { getNoteFromPitch, getPitchFromNote } from "helpers/midi";
import { useTriggerSubscription } from "hooks/useTrigger";
import { useMidi } from "hooks/useMidi";
import { useLongTouch } from "hooks/useLongTouch";
import { useKeySelectionContext } from "providers/KeySelection/KeySelection";

/**
 * Encapsulates state for a note input. Returns the MIDI
 * pitch and a set of handlers to be added to an input.
 *
 * TODO: This isn't quite perfect – raw number inputs
 *   should be handled by blur events, not change events.
 */
export function useNoteInput(updateFromContext = false) {
  const {lastNote} = useKeySelectionContext()
  const [inputString, setInputString] = React.useState<string>(lastNote);
  const [pitch, setPitch] = React.useState(getPitchFromNote(lastNote));

  const handleChange = (value: string) => {
    const determinedPitch = getPitchFromNote(value);
    if (determinedPitch) {
      setPitch(determinedPitch);
      setInputString(getNoteFromPitch(determinedPitch));
    } else {
      setInputString(value);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)

  // FIXME: This ideally shouldn't be an effect.
  React.useEffect(() => {
    if(updateFromContext) handleChange(lastNote)
  // eslint-disable-next-line
  // updateFromContext is omitted to prevent the note updating upon initial long press.
  }, [lastNote])

  if(!pitch) throw new Error('BUG: Set pitch to null')

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
  const [ref, isLongPressed] = useLongTouch(200)
  const [pitch, inputProps] = useNoteInput(isLongPressed);
  const { emitNote } = useMidi(channel)
  // TODO: Extract to hook
  const [fontSize, setFontSize] = React.useState(30)

  React.useLayoutEffect(() => {
    setFontSize(ref.current!.clientWidth / 3);
  })

  const isActive = useTriggerSubscription(triggerChannel || channel, {
    onTrigger: () => emitNote(pitch),
  });

  return (
    <Wrapper ref={ref}>
      <NoteInput
        {...inputProps}
        isActive={isActive || isLongPressed}
        style={{ fontSize }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
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
  color: ${(props) => (props.isActive ? "#fff" : "var(--gridItemColor)")};
  font-size: 4vmin;
  font-weight: 900;
  transition: color .5s ease;
  position: relative;
  outline: none;
`;