import styled, { useTheme } from "styled-components";
import { useDevices } from "providers/Devices/Devices";
import { Device } from "devices"; // TODO: Is this a circular dependency?
import { CellSelectionProvider } from "providers/CellSelection/CellSelection";
import { Grid } from "components/Grid/Grid";
import { GridItem } from "components/GridItem/GridItem";
import { TransitionInOutArray } from "components/TransitionInOut/TransitionInOut";
import { useOnOffTrigger } from "hooks/useTrigger";

interface SequencerStepProps extends WithUUID {
  isActive: boolean;
}

/**
 * Renders a step within a sequencer. Each step is a subgrid
 * where devices can be added just like a regular grid. However,
 * devices receive trigger events directly from the sequencer
 * rather than connection to an external trigger.
 *
 * TODO: Support for altering dimensions of subgrids
 * TODO: Limiting addition of devices to those that emit MIDI
 */
export function SequencerStep({ isActive, uuid }: SequencerStepProps) {
  const theme = useTheme();
  const {
    addDevice,
    detectCollision,
    devicesArray,
    removeDevice,
    updateDeviceParameters,
  } = useDevices();

  // Sets up subscription between child devices and the step's active state
  useOnOffTrigger(uuid, isActive);

  return (
    <Step isActive={isActive}>
      <CellSelectionProvider
        onRelease={addDevice}
        detectCollision={detectCollision}
      >
        <Grid x={1} y={8}>
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
                <Device {...item} triggerChannel={uuid} />
              </GridItem>
            )}
          />
        </Grid>
      </CellSelectionProvider>
    </Step>
  );
}

const Step = styled.div<{ isActive: boolean }>`
  border: 1px solid
    ${(props) =>
      props.isActive ? "var(--gridItemColor)" : "var(--gridItemLowAlpha)"};
  transition: border-color 0.2s ease;
  overflow: hidden;
`;
