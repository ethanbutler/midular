import React from "react";
import styled from "styled-components";
import { useLongTouch } from "hooks/useLongTouch";
import { Subdivision, useClockTrigger } from "hooks/useTrigger";
import { FiPlay, FiPause, FiSquare } from "react-icons/fi";
import mergeRefs from "react-merge-refs";

const subdivisions = [1, 2, 4, 8, 16, 32] as Subdivision[];

/**
 * Renders a clock, which emits trigger events based on
 * a number of beats and BPM.
 *
 * TODO: Add support for connecting to a global clock.
 * TODO: Add control for BPMs.
 * TODO: Add communication to subscribers when the clock is stopped.
 * TODO: Move clock events to worker threads via useClockTrigger.
 */
export function Clock({ channel }: DeviceParameters) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [longPressRef, isLongPressed] = useLongTouch();
  const [bpm, setBpm] = React.useState(100);
  const [subdivision, setSubdivision] = React.useState<Subdivision>(8);

  const [status, { play, pause, stop }] = useClockTrigger(channel, {
    bpm,
    subdivision,
    duration: 50,
    onActive: () => {
      ref.current!.style.background = "var(--gridItemLowAlpha)";
    },
    onInactive: () => {
      ref.current!.style.background = "";
    },
  });

  return (
    <ClockWrapper ref={mergeRefs([ref, longPressRef])}>
      <ButtonWrapper>
        {status === "playing" && (
          <ClockButton onClick={pause}>
            <FiPause />
          </ClockButton>
        )}
        {status !== "playing" && (
          <ClockButton onClick={play}>
            <FiPlay />
          </ClockButton>
        )}
        {status !== "stopped" && (
          <ClockButton onClick={stop}>
            <FiSquare />
          </ClockButton>
        )}
      </ButtonWrapper>

      <InputWrapper>
        <BpmInput
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
        />
        <span>BPM</span>
      </InputWrapper>

      {isLongPressed && (
        <SubdivisionControls>
          {subdivisions.map((s) => (
            <SubdivisionButton
              key={s}
              isActive={s === subdivision}
              onClick={setSubdivision.bind(null, s)}
            >
              {s}
            </SubdivisionButton>
          ))}
        </SubdivisionControls>
      )}
    </ClockWrapper>
  );
}

const ClockWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  transition: background-color 0.1s ease;

  button,
  input {
    color: inherit;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  flex: 1;
`;

const ClockButton = styled.button`
  background: none;
  border: none;
  flex: 1;
  font-size: 20px;
  padding: 1vmin;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  font-weight: 900;
`;
const BpmInput = styled.input`
  background: none;
  border: none;
  display: inline;
  font-size: inherit;
  width: 3ch;
  outline: none;
  text-align: right;
`;

const SubdivisionControls = styled.div`
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  height: 16px;
  display: flex;
  justify-content: space-around;
`;

const SubdivisionButton = styled.div<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 4px;
  font-size: 10px;
  color: ${(props) => (props.isActive ? "#fff" : "rgba(255,255,255,.5)")};
`;
