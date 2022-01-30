import React from "react";
import styled from "styled-components";
import { TransitionInOut } from "components/TransitionInOut/TransitionInOut";
import { useLongTouch } from "hooks/useLongTouch";
import { MINUTE_IN_S } from "../../constants";
import { useTrigger } from "hooks/useTrigger";

type ClockStatus = "playing" | "stopped";
type Subdivision = 2 | 4 | 8 | 16 | 32;
type Interval = ReturnType<typeof setInterval> | null;

const subdivisions = [2, 4, 8, 16, 32] as Subdivision[];

/**
 * Renders a clock, which emits trigger events based on
 * a number of beats and BPM.
 *
 * TODO: Add support for connecting to a global clock.
 * TODO: Add control for BPMs.
 * TODO: Add communication to subscribers when the clock is stopped.
 * TODO: Move clock events to worker threads via useClockTrigger.
 */
export function Clock({
  channel
}: DeviceParameters) {
  const [longTouchRef, isLongPressed] = useLongTouch();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [status, setStatus] = React.useState<ClockStatus>("stopped");
  const [bpm] = React.useState(100);
  const [currentSubdivision, setSubdivision] = React.useState<Subdivision>(8);
  const interval = React.useRef<Interval>(null);

  const {on, off} = useTrigger(channel)

  React.useEffect(() => {
    if (status === "playing") {
      const tempo = (((bpm / MINUTE_IN_S) * 4) / currentSubdivision) * 1000;
      interval.current = setInterval(() => {
        ref.current!.style.background = "var(--gridItemColor)";
        on()
        setTimeout(() => {
          ref.current!.style.background = "";
          off()
        }, 100);
      }, tempo);
    } else {
      clearInterval(interval.current!);
    }

    return () => clearInterval(interval.current!);
  }, [status, bpm, currentSubdivision, on, off]);

  return (
    <ClockWrapper ref={longTouchRef}>
      <ClockButton
        ref={ref}
        status={status}
        onClick={() =>
          setStatus((s) => (s === "playing" ? "stopped" : "playing"))
        }
      >
        {bpm}
      </ClockButton>

      <TransitionInOut>
        {isLongPressed && (
          <SubdivisionControls>
            {subdivisions.map((subdivision) => (
              <SubdivisionButton
                key={subdivision}
                isActive={currentSubdivision === subdivision}
                onClick={setSubdivision.bind(null, subdivision)}
              >
                {subdivision}
              </SubdivisionButton>
            ))}
          </SubdivisionControls>
        )}
      </TransitionInOut>
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
`;

const ClockButton = styled.button<{ status: ClockStatus }>`
  display: block;
  background: var(--gridItemMedAlpha);
  color: #fff;
  aspect-ratio: 1;
  border-radius: 100%;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  height: 100%;
  border: none;
  font-weight: 900;
  font-family: inherit;
  transition: background-color 0.05s ease;
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
