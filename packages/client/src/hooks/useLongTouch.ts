import React from "react";

type LongTouchState = "inactive" | "active";
type Timeout = ReturnType<typeof setTimeout>;

/**
 * Models a component that does something after a user touches
 * it for some period of time. Typically, this would be used for
 * expending contextual menu controls such as resize or delete
 * buttons that don't want to clutter the unexpended view.
 *
 * Returns a tuple: a ref to be attached to the element, and
 * the current state as a boolean.
 *
 * TODO: Tests
 */
export function useLongTouch(delay = 1000) {
  const ref = React.useRef<HTMLDivElement>(null);
  const timeout = React.useRef<Timeout | null>(null);
  const [state, setState] = React.useState<LongTouchState>("inactive");

  React.useEffect(() => {
    const prevTimeout = timeout.current
    const el = ref.current
    const onStart = () => {
      timeout.current = setTimeout(() => setState("active"), delay);
    };

    const onCancel = () => {
      if (timeout.current) clearTimeout(timeout.current);
    };

    const onEnd = (e: TouchEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!ref.current?.contains(target)) {
        setTimeout(() => setState("inactive"), 250);
        onCancel();
      }
    };

    ref.current!.addEventListener("mousedown", onStart);
    ref.current!.addEventListener("mouseup", onCancel);
    ref.current!.addEventListener("mouseleave", onCancel);
    ref.current!.addEventListener("touchstart", onStart);
    ref.current!.addEventListener("touchend", onEnd);
    document.addEventListener("mousedown", onEnd);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchstart", onEnd);

    return () => {
      if (prevTimeout) clearTimeout(prevTimeout);

      if (el) {
        el.removeEventListener("mousedown", onStart);
        el.removeEventListener("mouseleave", onCancel);
        el.removeEventListener("mouseup", onCancel);
        el.removeEventListener("touchstart", onStart);
        el.removeEventListener("touchend", onEnd);
      }

      document.removeEventListener("mousedown", onEnd);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchstart", onEnd);
    };
  }, [delay]);

  return [ref, state === "active"] as const;
}
