import { useHover } from "hooks/useHover";
import { useChannels } from "providers/Channels/Channels";
import { useDevices } from "providers/Devices/Devices";
import { useKeySelectionContext } from "providers/KeySelection/KeySelection";
import styled from "styled-components";
import { NOTE_WHEEL_SHARPS } from "../../constants";

interface PianoRollProps {}

// TODO: Make this cover all octaves.
const OCTAVES = [2, 3, 4];

/**
 * Renders a piano bar that controls the current note entry.
 */
export function PianoBar({}: PianoRollProps) {
  const { activeChannel } = useChannels();
  const keySelection = useKeySelectionContext();
  const [ref, isHovered] = useHover();

  return (
    <Wrapper ref={ref} isHovered={isHovered}>
      {OCTAVES.map((octave) =>
        [...NOTE_WHEEL_SHARPS].map((key) => (
          <Note
            key={`${key}${octave}`}
            isSharp={key.includes("#")}
            isActive={keySelection.lastNote === `${key}${octave}`}
            onClick={keySelection.setLastNote.bind(null, `${key}${octave}`)}
            activeChannel={activeChannel}
          >
            {key}
          </Note>
        ))
      )}

      <HitBox />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isHovered: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  transition: height 0.2s ease;
  gap: 4px;

  height: ${(props) => (props.isHovered ? "60px" : "15px")};
  z-index: 1;
`;

const Note = styled.div<{
  isSharp: boolean;
  isActive: boolean;
  activeChannel: number;
}>`
  flex: 1;
  background: ${(props) =>
    props.isActive
      ? props.theme.colors[props.activeChannel]
      : props.isSharp
      ? "#000"
      : "#fff"};
  color: transparent;
  border-bottom: none;
  height: 100px;
  transform: ${(props) => (props.isActive ? "translateY(-10px)" : "none")};
  transition: transform 0.2s ease;
`;

const HitBox = styled.div`
  position: absolute;
  right: 0;
  bottom: 100%;
  left: 0;
  height: 30px;
`;