import { midiLoggable } from "helpers/logs";
import { io } from "socket.io-client";

const socket = io(':8000')

/**
 * Provides a facade between Socket.io
 * and the rest of the application. In
 * the future, we may replacet Socket.io
 * with GRPC.
 */
export function useEvent() {
  const emit = midiLoggable(<T>(msg: string, value: T) => socket.emit(msg, value))

  return {
    emit
  }
}