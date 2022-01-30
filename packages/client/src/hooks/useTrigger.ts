import React from "react";

/**
 * Returns on and off callbacks for modeling a trigger.
 *
 * Don't use this directly. Instead, encapsulate it in
 * a hook that maps it to semantic events like user touches.
 *
 * TODO: This should be decoupled from the idea of MIDI
 *   channels. A trigger should return an internal UUID
 *   that can be passed to children that wish to subscribe.
 * TODO: These should be worker events so that they don't
 *   get blocked by rendering.
 */
export function useTrigger(channel: TriggerChannel) {
  const on = React.useCallback(() => {
    const evt = new CustomEvent(`trigger_${channel}_on`);
    document.dispatchEvent(evt);
  }, [channel])
  const off = React.useCallback(() => {
    const evt = new CustomEvent(`trigger_${channel}_off`);
    document.dispatchEvent(evt);
  }, [channel])
  return {
    on,
    off,
  };
}

interface UseSubscriptionTriggerConfig {
  onTrigger?: () => void;
}

/**
 * Given a trigger channel, subscribe to trigger events,
 * triggering a callback when the trigger becomes active.
 *
 * Returns whether the trigger is active.
 **/
export function useTriggerSubscription(
  channel: TriggerChannel,
  { onTrigger = () => {} }: UseSubscriptionTriggerConfig = {},
) {
  const [isOn, setIsOn] = React.useState(false);
  const cb = React.useRef(onTrigger)

  React.useEffect(() => {
    const on = () => {
      setIsOn(true);
      cb.current()
    }
    const off = () => {
      setIsOn(false);
    }

    document.addEventListener(`trigger_${channel}_on`, on);
    document.addEventListener(`trigger_${channel}_off`, off);

    return () => {
      document.removeEventListener(`trigger_${channel}_on`, on);
      document.removeEventListener(`trigger_${channel}_off`, off);
    };
  }, [channel]);

  React.useEffect(() => {
    cb.current = onTrigger
  }, [onTrigger])

  return isOn
}


/** Models a trigger that turns on and off based on a condition. */
export function useOnOffTrigger(channel: TriggerChannel, isActive: boolean) {
  const { on, off } = useTrigger(channel);
  React.useEffect(() => {
    const fn = isActive ? on : off
    fn()
  }, [isActive, on, off])
}

/** Models a trigger that is activated by touch events. Returns callbacks to be added to an element. */
export function useTouchTrigger(channel: TriggerChannel) {
  const { on, off } = useTrigger(channel);
  const onMouseDown = on;
  const onTouchStart = on;
  const onMouseUp = off;
  const onTouchEnd = off;
  return {
    onMouseDown,
    onTouchStart,
    onMouseUp,
    onTouchEnd,
  };
}