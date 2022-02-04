import styled from "styled-components";
import { Clock } from "./Clock/Clock";
import { Parent, Instance } from "./Parent/Parent";
import { Label } from "./Label/Label";
import { Note } from "./Note/Note";
import { Sequencer } from "./Sequencer/Sequencer";
import { Slider } from "./Slider/Slider";
import { Trigger } from "./Trigger/Trigger";

export const DEVICES_LIST = {
  Clock,
  Instance,
  Note,
  Parent,
  Label,
  Sequencer,
  Slider,
  Trigger,
} as const;

export type DeviceKey = keyof typeof DEVICES_LIST;
export const DEVICE_NAMES = Object.keys(DEVICES_LIST) as DeviceKey[];

export const DEVICE_KEYCODES: Record<string, DeviceKey> = {
  C: "Clock",
  F: "Slider",
  L: "Label",
  N: "Note",
  S: "Sequencer",
  T: "Trigger",
  X: 'Parent',
  Z: 'Instance',

  // G: "Gate",
  // K: Knob
  // Q: Quantizer
  // M: Memory tap
  // R: Chord
  // X: "XYPad",
};

/** Renders a device. */
export function Device({
  deviceType,
  channel,
  w,
  h,
  x,
  y,
  uuid,
  triggerChannel,
}: DeviceGridData & {
  triggerChannel?: string;
}) {
  const Component = DEVICES_LIST[deviceType as DeviceKey];
  const orientation: DeviceOrientation = w >= h ? "landscape" : "portrait";

  return (
    <DeviceWrapper>
      <Component
        channel={channel}
        orientation={orientation}
        uuid={uuid}
        triggerChannel={triggerChannel}
        dimensions={{ x, y, w, h }}
      />
    </DeviceWrapper>
  );
}

const DeviceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  > * {
    height: 100%;
    width: 100%;
  }
`;
