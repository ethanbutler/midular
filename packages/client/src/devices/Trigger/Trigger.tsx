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
  padding: 12px;
`;

const TriggerButton = styled.button<{ isActive: boolean }>`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 100%;
  border: none;
  background: ${(props) =>
    props.isActive ? "var(--gridItemMedAlpha)" : "var(--gridItemLowAlpha)"};
  transition: background-color 0.1s ease;
`;
