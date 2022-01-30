import React from "react";
import { useMap } from "@react-hookz/web";
import { nanoid } from "nanoid";
import { checkForOverlap, convertDimensionsToBound } from "helpers/coords";
import { useChannels } from "providers/Channels/Channels";
import { DEVICE_KEYCODES } from "devices";
import { useGlobalKeypress } from "hooks/useGlobalKeypress";

const DevicesContext = React.createContext<
  ReturnType<typeof useDevicesProvider>
>(null as any);

interface DevicesProviderProps {}

/**
 * Manages the grid position of devices.
 *
 * TODO: Implement bounds
 */
export const useDevicesProvider = () => {
  const { activeChannel } = useChannels();
  const devicesMap = useMap<DeviceGridData["uuid"], DeviceGridMapData>();
  const deviceType = useGlobalKeypress(DEVICE_KEYCODES, "Slider");
  const devicesArray: DeviceGridData[] = Array.from(
    devicesMap,
    ([uuid, value]) => ({ uuid, ...value })
  );

  /** Determines if a new device is being added. */
  // TODO: Optimize this algorithm to check for most likely sets first.
  const detectCollision = (dimensions: Dimensions) => {
    const newBounds = convertDimensionsToBound(dimensions);
    return devicesArray.some((device) => {
      const prevBounds = convertDimensionsToBound(device);
      return checkForOverlap(newBounds, prevBounds);
    });
  };

  /**
   * Given initial configuration, adds a new device.
   * Returns the uuid of the added device.
   */
  const addDevice = (
    device: Omit<DeviceGridMapData, "channel" | "deviceType">
  ) => {
    if (detectCollision(device)) {
      throw new Error("Collision detected!");
    }

    const uuid = nanoid();
    devicesMap.set(uuid, {
      ...device,
      channel: activeChannel,
      deviceType,
    });
    return uuid;
  };

  /** Removes a device by uuid. */
  const removeDevice = (uuid: DeviceGridData["uuid"]) =>
    devicesMap.delete(uuid);

  /** Given a uuid and a set of values, partially applies updates. */
  const updateDeviceParameters = (
    uuid: DeviceGridData["uuid"],
    value: Partial<DeviceGridMapData>
  ) => {
    const existingValue = devicesMap.get(uuid);
    const newValue = { ...existingValue!, ...value };
    devicesMap.set(uuid, newValue);
    return newValue;
  };

  return {
    deviceType,
    detectCollision,
    devicesMap,
    devicesArray,
    addDevice,
    removeDevice,
    updateDeviceParameters,
  };
};

/**
 * Manages device state for the application.
 */
export function DevicesProvider({
  children,
}: DevicesProviderProps & { children: React.ReactNode }) {
  const ctx = useDevicesProvider();
  return (
    <DevicesContext.Provider value={ctx}>{children}</DevicesContext.Provider>
  );
}

/** Returns the device state. */
export const useDevices = () => {
  const ctx = React.useContext(DevicesContext);
  if (!ctx)
    throw new Error("BUG: Using `useDevices` outside of a DevicesProvider");
  return ctx;
};
