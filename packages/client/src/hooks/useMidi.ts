import { useThrottledCallback } from "@react-hookz/web";
import { CONTROL_CHANGE, NOTE_ON, NOTE_OFF } from 'common'
import { useEvent } from "./useEvent";

export function useMidi(channel: number) {
  const {emit} = useEvent()

  const emitControlChange = useThrottledCallback(
    (value: number) => {
      emit(CONTROL_CHANGE, {
        channel,
        value: Math.floor(value * 127)
      })
    },
    [channel],
    50
  );

  // TODO: Support for velocity
  const emitNote = (value: number, duration = 10) => {
    emit(NOTE_ON, {
      channel,
      value,
    })
    setTimeout(() => {
      emit(NOTE_OFF, {
        channel,
        value,
      })
    }, duration)
  }

  return {
    emitNote,
    emitControlChange,
  };
}
