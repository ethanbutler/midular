import styled from "styled-components"
import { useCell } from "providers/CellSelection/CellSelection"

interface GridCellProps {
  coords: Coords;
}

type GridCellState = 'inactive' | 'active' | 'in range'

/**
 * Renders a single cell within a grid. This is used
 * to control user selection when adding devices.
 *
 * A cell has three states:
 * - `inactive`, AKA the normal state
 * - `active`, AKA the cell is the start or end point of the user selection
 * - `in range`, AKA the cell is part of the selection range but not active
 */
export function GridCell({
  coords
}: GridCellProps) {
  const {isCoordActive, isCoordWithinActiveRange, cellProps} = useCell(coords)
  let state: GridCellState = 'inactive'
  if(isCoordWithinActiveRange) state = 'in range'
  if(isCoordActive) state = 'active'
  return <Cell {...cellProps} state={state} />;
}


const Cell = styled.div<{ state: GridCellState }>`
border: 1px solid rgba(255,255,255,.05);
transition: background-color .3s ease;
background: ${props => {
  if(props.state === 'active') return 'rgba(255,255,255,.2)'
  if(props.state === 'in range') return 'rgba(255,255,255,.1)'
  return 'none'
}};
`