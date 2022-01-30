import { useMap } from "@react-hookz/web";
import { useGlobalKeypress } from "hooks/useGlobalKeypress";
import React from "react";
import { useTheme } from "styled-components";

// Should match number of available colors
export const MAX_NUMBER_OF_CHANNELS = 10;

interface ChannelsProviderProps {}

const ChannelsContext = React.createContext<
  ReturnType<typeof useChannelsProvider>
>({
  activeChannel: 0,
  setActiveChannel: () => {},
  channelsArray: [],
  channelsMap: new Map(),
});

const CHANNEL_KEY_MAP = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "0": "0",
};

/**
 * TODO: Docs
 *
 * TODO: Prevent keypresses from triggering on inputs
 */
export function useChannelsProvider(length: number) {
  const { colors } = useTheme();
  const channelsArray: ChannelData[] = Array.from({ length }).map(
    (_, number) => ({ number: number, color: colors[number] })
  );
  const channelsMap = useMap<Number, ChannelData>(
    channelsArray.map((channel) => [channel.number, channel])
  );
  const [activeChannel, setActiveChannel] = React.useState(1);

  useGlobalKeypress(CHANNEL_KEY_MAP, "0", (k) => setActiveChannel(Number(k)));

  const [firstChannel, ...rest] = channelsArray

  return {
    activeChannel,
    setActiveChannel,
    channelsArray: [...rest, firstChannel],
    channelsMap,
  };
}

/**
 * TODO: Docs
 */
export function ChannelsProvider({
  children,
}: ChannelsProviderProps & { children: React.ReactNode }) {
  const ctx = useChannelsProvider(MAX_NUMBER_OF_CHANNELS);
  return (
    <ChannelsContext.Provider value={ctx}>{children}</ChannelsContext.Provider>
  );
}

/** TODO: Docs */
export function useChannels() {
  const ctx = React.useContext(ChannelsContext);
  return ctx;
}

/**
 * Given a condition, trigger a callback when the channel changes.
 * TODO: Docs
 * TODO: Tests
 * */
export function useChannelSubscription(
  cb: (channel: ChannelData["number"]) => void,
  cond: boolean
) {
  const ctx = React.useContext(ChannelsContext);
  const ref = React.useRef(cb);

  React.useEffect(() => {
    if (cond) ref.current(ctx.activeChannel);
  }, [ctx.activeChannel, cond]);
}
