import styled from "styled-components";
import { useArrayOfSize } from "hooks/useArrayOfSize";
import { GridCell } from "components/GridCell/GridCell";

interface GridProps {
  /** A set of GridItems to be overlaid upon the grid. */
  children: React.ReactNode;
  /** The number of cells within the grid. */
  state?: "error" | "success";
}

interface GridPropsWithSize extends GridProps {
  size: number;
  x?: never;
  y?: never;
}

interface GridPropsWithXY extends GridProps {
  x: number;
  y: number;
  size?: never;
}

/**
 * Renders a plane of GridCells.
 *
 * The Grid itself can be stateful, to render UI patterns
 * such as:
 * - An error state when the user is adding an item that would collide.
 * - An active state, such as when a clock is active.
 */
export function Grid({
  children,
  size,
  x,
  y,
  state,
}: GridPropsWithXY | GridPropsWithSize) {
  const rows = useArrayOfSize(y || size || 1);
  const columns = useArrayOfSize(x || size || 1);
  return (
    <Plane x={x || size || 1} y={y || size || 1} state={state}>
      {rows.map((y) =>
        columns.map((x) => <GridCell key={`${x}-${y}`} coords={{ x, y }} />)
      )}

      {children}
    </Plane>
  );
}

const Plane = styled.div<GridPropsWithXY>`
  --gridXSize: ${(props) => props.x};
  --gridYSize: ${(props) => props.y};
  position: relative;
  height: 100%;
  transition: background-color 0.2s ease;
  background: ${(props) => (props.state === "error" ? "#f80759" : "#333")};
  display: grid;
  grid-template-columns: repeat(var(--gridXSize), 1fr);
  grid-template-rows: repeat(var(--gridYSize), 1fr);
`;
