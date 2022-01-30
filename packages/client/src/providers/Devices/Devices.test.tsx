import { act, renderHook } from "@testing-library/react-hooks";
import { useDevicesProvider } from "./Devices";

describe("useDevicesProvider", () => {
  it("should return an empty map initially", () => {
    const { result } = renderHook(() => useDevicesProvider());
    expect(result.current.devicesMap.size).toEqual(0);
  });

  it("should allow devices to be added", () => {
    const DEVICE = { x: 0, y: 0, w: 1, h: 1 };

    const { result } = renderHook(() => useDevicesProvider());

    let uuid: DeviceGridData["uuid"];
    act(() => {
      uuid = result.current.addDevice(DEVICE);
    });

    expect(result.current.devicesMap.size).toEqual(1);
    expect(result.current.devicesMap.get(uuid!)).toEqual(
      expect.objectContaining(DEVICE)
    );
  });

  it("should return an array of devices", () => {
    const DEVICE = { x: 0, y: 0, w: 1, h: 1 };

    const { result } = renderHook(() => useDevicesProvider());

    let uuid: DeviceGridData["uuid"];
    act(() => {
      uuid = result.current.addDevice(DEVICE);
    });

    expect(result.current.devicesArray).toEqual([
      expect.objectContaining({ uuid: uuid!, ...DEVICE }),
    ]);
  });

  it("should detect collisions with existing devices", () => {
    const DEVICE = { x: 1, y: 1, w: 3, h: 3 };
    const X_OVERLAP = { x: 2, y: 2, w: 2, h: 2 };
    const Y_OVERLAP = { x: 2, y: 2, w: 2, h: 2 };
    const NO_OVERLAP = { x: 4, y: 4, w: 2, h: 2 };
    const NO_OVERLAP_BEFORE = { x: 0, y: 0, w: 0, h: 0 };

    const { result } = renderHook(() => useDevicesProvider());

    act(() => {
      result.current.addDevice(DEVICE);
    });

    expect(result.current.detectCollision(DEVICE)).toEqual(true);
    expect(result.current.detectCollision(X_OVERLAP)).toEqual(true);
    expect(result.current.detectCollision(Y_OVERLAP)).toEqual(true);
    expect(result.current.detectCollision(NO_OVERLAP)).toEqual(false);
    expect(result.current.detectCollision(NO_OVERLAP_BEFORE)).toEqual(false);
  });

  it("should allow a device to be removed", () => {
    const DEVICE = { x: 0, y: 0, w: 1, h: 1 };

    const { result } = renderHook(() => useDevicesProvider());

    act(() => {
      const uuid = result.current.addDevice(DEVICE);
      result.current.removeDevice(uuid);
    });

    expect(result.current.devicesMap.size).toEqual(0);
  });

  it("should allow a device to be updated", () => {
    const DEVICE = { x: 0, y: 0, w: 1, h: 1 };
    const UPDATE = { w: 3 };

    const { result } = renderHook(() => useDevicesProvider());

    let uuid: DeviceGridData["uuid"];
    act(() => {
      uuid = result.current.addDevice(DEVICE);
      result.current.updateDeviceParameters(uuid, UPDATE);
    });

    expect(result.current.devicesMap.get(uuid!)).toEqual(
      expect.objectContaining({
        ...DEVICE,
        ...UPDATE,
      })
    );
  });
});

describe("useDevices", () => {
  it.todo(
    "should return context values to children when used in DevicesProvider"
  );
  it.todo("should throw an error when used out of context");
});
