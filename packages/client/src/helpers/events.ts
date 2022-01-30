/** Guard for discriminating touch and mouse events. */
export const isTouchEvent = (event: React.MouseEvent | React.TouchEvent): event is React.TouchEvent => Boolean((event as any).touches)
export const isMouseEvent = (event: React.MouseEvent | React.TouchEvent): event is React.MouseEvent => !isTouchEvent(event)