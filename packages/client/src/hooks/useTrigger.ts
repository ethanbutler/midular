import React from "react";
import { MINUTE_IN_S } from "../constants";

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
  }, [channel]);
  const off = React.useCallback(() => {
    const evt = new CustomEvent(`trigger_${channel}_off`);
    document.dispatchEvent(evt);
  }, [channel]);
  return {
    on,
    off,
  };
}

interface UseSubscriptionTriggerConfig {
  onTrigger?: () => void;
  onStop?: () => void;
}

/**
 * Given a trigger channel, subscribe to trigger events,
 * triggering a callback when the trigger becomes active.
 *
 * Returns whether the trigger is active.
 **/
export function useTriggerSubscription(
  channel: TriggerChannel,
  { onTrigger = () => {}, onStop = () => {} }: UseSubscriptionTriggerConfig = {}
) {
  const [isOn, setIsOn] = React.useState(false);
  const cb = React.useRef(onTrigger);

  React.useEffect(() => {
    const on = () => {
      setIsOn(true);
      cb.current();
    };
    const off = () => {
      setIsOn(false);
    };

    document.addEventListener(`trigger_${channel}_on`, on);
    document.addEventListener(`trigger_${channel}_off`, off);

    return () => {
      document.removeEventListener(`trigger_${channel}_on`, on);
      document.removeEventListener(`trigger_${channel}_stiop`, off);
    };
  }, [channel]);

  React.useEffect(() => {
    cb.current = onTrigger;
  }, [onTrigger]);

  return isOn;
}

/** Models a trigger that turns on and off based on a condition. */
export function useOnOffTrigger(channel: TriggerChannel, isActive: boolean) {
  const { on, off } = useTrigger(channel);
  React.useEffect(() => {
    const fn = isActive ? on : off;
    fn();
  }, [isActive, on, off]);
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

// TODO: Move to its own module.
export function useClockStatus(channel: TriggerChannel) {
  const [status, setStatus] = React.useState<ClockStatus>("stopped");
  const play = () => setStatus("playing");
  const pause = () => setStatus("paused");
  const stop = () => {
    setStatus("stopped");
    const evt = new CustomEvent(`trigger_${channel}_stop`);
    document.dispatchEvent(evt);
  };

  return {
    status,
    play,
    pause,
    stop,
  };
}

type ClockSubscriptionArgs = {
  onStop(): void;
};

/** Subscribes to a clock's events. */
export function useClockSubscription(
  channel: TriggerChannel,
  { onStop }: ClockSubscriptionArgs
) {
  React.useEffect(() => {
    document.addEventListener(`trigger_${channel}_stop`, onStop);
    return () => {
      document.removeEventListener(`trigger_${channel}_stop`, onStop);
    };
  }, [onStop]);
}

export type ClockStatus = "playing" | "paused" | "stopped";
export type Interval = ReturnType<typeof setInterval> | null;
export type Subdivision = 1 | 2 | 4 | 8 | 16 | 32;
type ClockTriggerArgs = {
  /** Beats per minute for the clock. */
  bpm: number;
  /** How long each pulse should remain active. */
  duration: number;
  /** How many beats to subdivide each group into. */
  subdivision: number;
  /** Callback when a pulse is active. */
  onActive?: () => void;
  /** Callback when a pulse becomes inactive. */
  onInactive?: () => void;
  /** Callback when the clock is stopped. */
  onStop?: () => void;
};
export function useClockTrigger(
  channel: TriggerChannel,
  { bpm, duration, subdivision, onActive, onInactive }: ClockTriggerArgs
) {
  const { status, ...clockCallbacks } = useClockStatus(channel);
  const { on, off } = useTrigger(channel);
  const interval = React.useRef<Interval>(null);

  React.useEffect(() => {
    if (status === "playing") {
      const tempo = (((MINUTE_IN_S / bpm) * 4) / subdivision) * 1000;

      const trigger = () => {
        on();
        if (onActive) onActive();
        setTimeout(() => {
          off();
          if (onInactive) onInactive();
        }, duration);
      };

      trigger();
      interval.current = setInterval(trigger, tempo);
    } else {
      clearInterval(interval.current!);
    }

    return () => clearInterval(interval.current!);
  }, [status, bpm, subdivision, on, off, onActive, onInactive]);

  return [status, clockCallbacks] as const;
}
