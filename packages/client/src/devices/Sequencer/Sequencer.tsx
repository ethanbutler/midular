import React from "react";
import styled from "styled-components";
import { DevicesProvider } from "providers/Devices/Devices";
import { useArrayOfSize } from "hooks/useArrayOfSize";
import { useCount } from "hooks/useCount";
import { useTriggerSubscription } from "hooks/useTrigger";
import { SequencerStep } from "./SequencerStep";

/** Encapsulates state for sequencers. */
export function useSequencer(channel: ChannelData['number']) {
  const [beatCount] = React.useState(8);
  const [currentBeat, { increment }] = useCount(beatCount);
  const beats = useArrayOfSize(beatCount);

  // Sets up subcription between the sequencer and the
  // the driving the sequencer.
  useTriggerSubscription(channel, {
    onTrigger: increment,
  });

  return { beatCount, beats, currentBeat }
}

/**
 * Renders a sequencer device. A sequencer is a series of
 * subgrids that can contain devices that trigger MIDI outputs,
 * like Notes or Sliders. Each subgrid forms a step within
 * the sequencer and sends a trigger to its child devices when
 * it becomes active.
 *
 * A Sequencer must be driven by a device that sends trigger
 * events, such as a Clock or a Trigger. Each pulse advances
 * the Sequencer by a step.
 *
 * TODO: Alternate divisions, e.g. for time signatures
 * TODO: Support for connection to the global clock
 * TODO: Prevent long presses on children from triggering for the sequencer
 */
export function Sequencer({ uuid, channel }: DeviceParameters) {
  const { beatCount, beats, currentBeat } = useSequencer(channel)

  return (
    <Wrapper beatCount={beatCount}>
      {beats.map((beat) => (
        <DevicesProvider key={beat}>
          <SequencerStep
            uuid={`${uuid}_${beat}`}
            isActive={beat === currentBeat}
          />
        </DevicesProvider>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ beatCount: number }>`
  --steps: ${(props) => props.beatCount};
  display: grid;
  grid-template-columns: repeat(var(--steps), 1fr);
  padding: 12px;
  gap: 2px;
`;