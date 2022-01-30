import styled from "styled-components";
import { useTouchTrigger, useTriggerSubscription } from "hooks/useTrigger";

/**
 * Renders a simple trigger activated by touch events.
 */
export function Trigger({ channel }: DeviceParameters) {
  const triggerProps = useTouchTrigger(channel);
  const isActive = useTriggerSubscription(channel);

  return (
    <Wrapper>
      <TriggerButton {...triggerProps} isActive={isActive} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vmin;
`;

const TriggerButton = styled.button<{ isActive: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  border: none;
  background: ${props => props.isActive ? '#fff' : 'var(--gridItemColor)'};
  box-shadow: ${props => props.isActive ? 'inset 0 0 15px rgba(0,0,0,.2)' : '0 0 15px rgba(0,0,0,.5)'};
  transition: background-color 0.6s ease, box-shadow .1s ease;
`;
