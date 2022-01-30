type Coords = { x: number; y: number };

type Dimensions = Coords & {
  h: number;
  w: number;
};

type BoundingBox = {
  t: number;
  l: number;
  b: number;
  r: number;
};

type WithUUID = { uuid: string };

type DeviceGridData = WithUUID &
  Dimensions & {
    channel: ChannelData["number"];
    deviceType: string;
  };

type DeviceGridMapData = Omit<DeviceGridData, "uuid">;

type ChannelData = {
  number: number;
  color: string;
};

type DeviceOrientation = "landscape" | "portrait";

type DeviceParameters = WithUUID & {
  channel: ChannelData["number"];
  orientation: DeviceOrientation;
  /** A value that can be passed to override the channel for subscribed triggers. Does not affect output of device. */
  triggerChannel?: WithUUID["uuid"];
};

type TriggerChannel = ChannelData["number"] | WithUUID["uuid"];
