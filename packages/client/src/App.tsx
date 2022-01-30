import styled, { useTheme } from "styled-components";
import { DevicesProvider, useDevices } from "providers/Devices/Devices";
import { Grid } from "components/Grid/Grid";
import { useGridSize } from "hooks/useGridSize";
import {
  CellSelectionProvider,
  useCellSelectionState,
} from "providers/CellSelection/CellSelection";
import { ChannelsProvider } from "providers/Channels/Channels";
import { KeySelection } from "providers/KeySelection/KeySelection";
import { Theme } from "providers/Theme/Theme";
import { GridItem } from "components/GridItem/GridItem";
import { TransitionInOutArray } from "components/TransitionInOut/TransitionInOut";
import { ChannelBar } from "components/ChannelBar/ChannelBar";
import { Device } from "devices";

// TODO: Clean all of this up.

function CellGrid() {
  const theme = useTheme();
  const gridSize = useGridSize();
  const { isColliding } = useCellSelectionState();
  const { devicesArray, removeDevice, updateDeviceParameters } = useDevices();

  return (
    <Grid size={gridSize} state={isColliding ? "error" : undefined}>
      <TransitionInOutArray
        items={devicesArray}
        render={(item) => (
          <GridItem
            {...item}
            color={theme.colors[item.channel]}
            key={item.uuid}
            onDelete={removeDevice.bind(null, item.uuid)}
            onChannel={(channel) =>
              updateDeviceParameters(item.uuid, { channel })
            }
          >
            <Device {...item} />
          </GridItem>
        )}
      />
    </Grid>
  );
}

function DeviceGrid() {
  const { deviceType, addDevice, detectCollision } = useDevices();
  return (
    <CellSelectionProvider
      onRelease={addDevice}
      detectCollision={detectCollision}
    >
      <CellGrid />


      <CurrentDevice>{deviceType}</CurrentDevice>
    </CellSelectionProvider>
  );
}

function App() {
  return (
    <Theme>
      <ChannelsProvider>
        <DevicesProvider>
          <KeySelection>
            <AppLayout>
              <ChannelBar />
              <GridWrapper>
                <DeviceGrid />
              </GridWrapper>
            </AppLayout>
          </KeySelection>
        </DevicesProvider>
      </ChannelsProvider>
    </Theme>
  );
}

const AppLayout = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
`;

const GridWrapper = styled.div`
  flex: 1;
  padding: 30px;
  background: #222;
`;

const CurrentDevice = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  padding: 0 30px;
  line-height: 30px;
  text-align: right;
  font-weight: 900;
  text-transform: uppercase;
`;

export default App;
