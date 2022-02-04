import React from "react"
import { Grid } from "components/Grid/Grid"
import styled, { useTheme } from "styled-components"
import { GridItem } from "components/GridItem/GridItem"
import { TransitionInOutArray } from "components/TransitionInOut/TransitionInOut"
import { Device } from "devices"
import { CellSelectionProvider } from "providers/CellSelection/CellSelection"
import { DevicesProvider, useDevices } from "providers/Devices/Devices"
import { useTrigger, useTriggerSubscription } from "hooks/useTrigger"
import { useMap } from "@react-hookz/web"

const ParentInstanceContext = React.createContext<ReturnType<typeof useParentInstanceProvider>>(null as any)

function useParentInstanceProvider() {
  const parents = useMap<DeviceGridData['uuid'], string>()
  return parents
}

/**
 * TODO: Docs
 */
function useParentInstanceContext() {
  const parents = React.useContext(ParentInstanceContext)

  if(!parents) throw new Error("BUG: Using ParentInstanceContext outside of a provider")

  const getUuidByName = (name: string) => {
    const parentsArray = [...parents] as [string, string][]
    const parent = parentsArray.find(([, value]) => name === value)
    return parent?.[0]
  }

  return {
    parents,
    getUuidByName
  }
}

export function ParentInstanceProvider({ children }: {
  children: React.ReactNode
}) {
  const map = useParentInstanceProvider()
  return (
    <ParentInstanceContext.Provider value={map}>
      {children}
    </ParentInstanceContext.Provider>
  )
}

export function Parent({
  uuid,
  dimensions
}: DeviceParameters) {
  const [name, setName] = React.useState('')
  const {parents} = useParentInstanceContext()

  React.useEffect(() => {
    parents.set(uuid, name)
    return () => {
      parents.delete(uuid);
    };
  }, [uuid, name])

  return (
    <Wrapper>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group name"
      />
      <DevicesProvider>
        <ParentGrid uuid={uuid} dimensions={dimensions} />
      </DevicesProvider>
    </Wrapper>
  );
}

// TODO: Generalize dimensions and uuid to device context
function ParentGrid({
  dimensions,
  uuid,
}: Pick<DeviceParameters, 'dimensions' | 'uuid'>) {
  const theme = useTheme();

  const {
    addDevice,
    detectCollision,
    devicesArray,
    removeDevice,
    updateDeviceParameters,
  } = useDevices();

  return (
    <CellSelectionProvider
      onRelease={addDevice}
      detectCollision={detectCollision}
    >
      <Grid x={dimensions.w} y={dimensions.h}>
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
  )
}

export function Instance({
  triggerChannel,
  channel,
}: DeviceParameters) {
  const [name, setName] = React.useState('')
  const parentUuid = useParentInstanceContext().getUuidByName(name)

  // TODO: Extract these "join" subscriptions into a reusable hook.

  // If there isn't a valid parent uuid, send events to nowhere.
  const {on, off} = useTrigger(parentUuid || '/dev/null')

  // Trigger a subscription based on an instance's
  // parent context, such as a sequencer clock.
  useTriggerSubscription(triggerChannel || channel, {
    onTrigger: on,
    onOff: off,
  });

  return (
    <Wrapper>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group name"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
display: flex;
flex-direction: column;
`
const Input = styled.input`
background: none;
border: none;
outline: none;
font-size: 8px;
text-align: center;
padding: 4px 8px;
color: white;
`