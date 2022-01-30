import { useHover } from "hooks/useHover";
import { useLongTouch } from "hooks/useLongTouch";
import styled from "styled-components";
import { rgba } from "polished";
import { animated } from "react-spring";
import { useChannelSubscription } from "providers/Channels/Channels";

interface GridItemProps extends Dimensions {
  color: string;
  channel: ChannelData["number"];
  onDelete(): void;
  onChannel?: (channel: ChannelData["number"]) => void;
  children: React.ReactNode;
}

type GridItemState = "inactive" | "active";

/**
 * Renders a wrapper for a device within a grid.
 *
 * TODO: Implement resize controls
 * TODO: Clean up integration with react-spring.
 */
export function GridItem({
  color,
  children,
  onChannel = () => {},
  onDelete,
  x,
  y,
  w,
  h,
  ...rest
}: GridItemProps) {
  const [wrapperRef, isLongTouched] = useLongTouch();
  const [deletePlaceholderRef, isDeleteHovered] = useHover();

  useChannelSubscription(onChannel, isLongTouched);

  let state: GridItemState = "inactive";
  if (isLongTouched) state = "active";

  return (
    <GridItemPosition x={x} y={y} w={w} h={h} state={state}>
      <animated.div style={rest as any}>
        <GridItemInner ref={wrapperRef} color={color}>
          {children}

          <DeletePlaceholder ref={deletePlaceholderRef}>
            <DeleteButton
              onClick={onDelete}
              visible={isLongTouched || isDeleteHovered}
            >
              &times;
            </DeleteButton>
          </DeletePlaceholder>
        </GridItemInner>
      </animated.div>
    </GridItemPosition>
  );
}

const GridItemPosition = styled.div<Dimensions & { state: GridItemState }>`
  position: absolute;
  top: calc(100% * ${(props) => props.y} / var(--gridYSize));
  left: calc(100% * ${(props) => props.x} / var(--gridXSize));
  height: calc(100% * ${(props) => props.h} / var(--gridYSize));
  width: calc(100% * ${(props) => props.w} / var(--gridXSize));
  padding: 4px;

  > * {
    background: #333;
    position: relative;
    height: 100%;
  }
`;

// TODO: Fix z-index issue when item is active.
const GridItemInner = styled.div<{ color: string }>`
  --gridItemColor: ${(props) => props.color};
  --gridItemMedAlpha: ${(props) => rgba(props.color, 0.5)};
  --gridItemLowAlpha: ${(props) => rgba(props.color, 0.3)};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  border: 1px solid var(--gridItemColor);
`;

const DeletePlaceholder = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  top: -16px;
  right: -16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteButton = styled.button<{ visible: boolean }>`
  ${(props) => (!props.visible ? "display: none;" : "display: flex;")}
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  border: 1px solid var(--gridItemColor);
  background: #333;
  color: var(--gridItemColor);
  padding: 0;
`;
