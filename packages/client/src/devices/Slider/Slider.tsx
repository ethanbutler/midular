import React from "react";
import styled from "styled-components";
import { isTouchEvent } from "helpers/events";
import { useMidi } from "hooks/useMidi";
import { useTriggerSubscription } from "hooks/useTrigger";

type OrientationAgnosticDimensions = {
  primarySide: "left" | "bottom";
  secondarySide: "left" | "bottom";
  primaryDimension: "width" | "height";
  secondaryDimension: "width" | "height";
};

/**
 * Renders a slider that can be used to emit MIDI control events.
 *
 * TODO: Support for followers.
 * TODO: Support for touch events.
 * TODO: Better encapsulate the differences between
 *   triggerChannel and channel events.
 */
export function Slider({
  triggerChannel,
  channel,
  orientation,
}: DeviceParameters) {
  const { emitControlChange } = useMidi(channel);
  const controlRef = React.useRef<HTMLDivElement>(null);
  const [
    primarySide,
    secondarySide,
    primaryDimension,
    secondaryDimension,
    clientReference,
  ] =
    orientation === "landscape"
      ? (["left", "bottom", "width", "height", "clientX"] as const)
      : (["bottom", "left", "height", "width", "clientY"] as const);
  const componentProps: OrientationAgnosticDimensions = {
    primarySide,
    secondarySide,
    primaryDimension,
    secondaryDimension,
  };
  const [value, setValue] = React.useState(0.5);

  const handleChange = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const d = isTouchEvent(e)
      ? e.touches[0][clientReference]
      : e[clientReference];
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const value = Math.abs((d - rect[primarySide]) / rect[primaryDimension]);
    controlRef.current!.style[primarySide] = `${value * 100}%`;
    if (!triggerChannel) {
      emitControlChange(value);
    }
    setValue(value);
  };

  useTriggerSubscription(triggerChannel || channel, {
    onTrigger: () => emitControlChange(value),
  });

  return (
    <Wrapper {...componentProps}>
      <Bar
        {...componentProps}
        onMouseDown={handleChange}
        onMouseUp={handleChange}
        onTouchStart={handleChange}
        onTouchEnd={handleChange}
      >
        <Control {...componentProps} ref={controlRef} />
      </Bar>
    </Wrapper>
  );
}

const Wrapper = styled.div<OrientationAgnosticDimensions>`
  ${(props) => props.primaryDimension}: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bar = styled.div<OrientationAgnosticDimensions>`
  position: relative;
  height: 100%;
  width: 100%;
  background: var(--gridItemLowAlpha);
`;

const Control = styled.div<OrientationAgnosticDimensions>`
  position: absolute;
  ${(props) => props.secondaryDimension}: 100%;
  ${(props) => props.primaryDimension}: 8px;
  ${(props) => props.secondarySide}: 0;
  ${(props) => props.primarySide}: 50%; // This will get overwritten.
  background: var(--gridItemColor);
  transition: all 0.2s ease;
`;
