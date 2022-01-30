import { useHover } from "hooks/useHover";
import { useChannels } from "providers/Channels/Channels";
import styled from "styled-components";

interface ChannelBarProps {}

// TODO: Implementation
export function ChannelBar(_props: ChannelBarProps) {
  const [ref, isHovered] = useHover();
  const { channelsArray, activeChannel, setActiveChannel } = useChannels();

  return (
    <ChannelBarWrapper isHovered={isHovered} ref={ref}>
      {channelsArray.map((channel) => (
        <ChannelControl
          bg={channel.color}
          key={channel.number}
          onClick={setActiveChannel.bind(null, channel.number)}
        >
          <ChannelNumber isActive={activeChannel === channel.number} />
        </ChannelControl>
      ))}

      <HitBox />
    </ChannelBarWrapper>
  );
}

const ChannelBarWrapper = styled.div<{ isHovered: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.isHovered ? "30px" : "6px")};
  transition: width 0.1s ease;
  z-index: 10;
`;

const HitBox = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 30px;
`;

const ChannelControl = styled.button<{ bg: string }>`
  z-index: 2;
  --channelColor: ${(props) => props.bg};
  flex: 1;
  border: none;
  background: var(--channelColor);
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChannelNumber = styled.div<{ isActive: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 4px;

  ${(props) =>
    props.isActive
      ? `
background: #333;
`
      : ""}
`;
