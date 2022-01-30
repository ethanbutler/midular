import { CellSelectionProvider } from "providers/CellSelection/CellSelection";
import { render } from "test-utils"
import { Grid } from "./Grid"

test('Grid', () => {
  render(
    // TODO: Remove this coupling.
    <CellSelectionProvider>
      <Grid size={10}>{null}</Grid>
    </CellSelectionProvider>
  );
})