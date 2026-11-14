import { useEffect, useRef, useState } from 'react'

/**
 * Animates toward `target` whenever `target` or `runKey` changes.
 * Starts from `from` if given, otherwise from the currently displayed value.
 */
export function useCountUp(target, { duration = 1200, runKey = 0, from } = {}) {
  const [value, setValue] = useState(from ?? 0)
  const current = useRef(from ?? 0)
  useEffect(() => {
    const start = from ?? current.current
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      current.current = start + (target - start) * (1 - Math.pow(1 - p, 3))
      setValue(current.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, runKey, duration, from])
  return value
}
