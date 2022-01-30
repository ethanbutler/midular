import React from "react";
import { useTransition, animated, config } from "react-spring";

interface TransitionInOutProps {
  children: React.ReactNode;
}

/**
 * Manages animation for a single component.
 */
export function TransitionInOut({ children}: TransitionInOutProps) {
  const transitions = useTransition(children, {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  return transitions(
    (styles, child) => child && <animated.div style={styles}>{child}</animated.div>
  );
}

interface TransitionInOutArrayProps<T> {
  items: T[]
  render: (item: T) => React.ReactNode
}

/**
 * Manages animation for an array of components, such as Grid Items.
 */
export function TransitionInOutArray<T extends WithUUID>({ items, render }: TransitionInOutArrayProps<T>) {
  const transitions = useTransition(items, {
    keys: item => item.uuid,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    config: config.stiff,
  });

  return transitions((styles, item) => render({...item, ...styles}))
}
