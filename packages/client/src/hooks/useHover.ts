import React from "react"

/**
 * TODO: Docs
 * TODO: Tests
 */
export function useHover() {
  const [isHovered, setIsHovered] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onHover = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)

    ref.current!.addEventListener('mouseover', onHover)
    ref.current!.addEventListener('mouseleave', onLeave)

    return () => {
      if(ref.current) {
        ref.current.removeEventListener('mouseover', onHover)
        ref.current.removeEventListener('mouseleave', onLeave)
      }
    }
  })

  return [ref, isHovered] as const
}