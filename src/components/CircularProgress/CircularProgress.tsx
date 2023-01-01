import React, { useEffect, useRef } from 'react'

import './circularProgress.scss'

interface CircularProgressProps {
  size?: number,
  progress?: number,
  trackColor?: string,
  indicatorWidth?: number,
  indicatorColor?: string,
  indicatorCap: "round" | "inherit" | "butt" | "square" | undefined
}
function CircularProgress(props: CircularProgressProps) {
  const {
    size = 30,
    progress = 0,
    trackColor = 'var(--ironhide-key)',
    indicatorWidth = 3,
    indicatorColor = 'var(--accent-s1)',
    indicatorCap = 'round'
  } = props

  const trackWidth = indicatorWidth - 1
  const center = size / 2
  const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth)
  const dashArray = 2 * Math.PI * radius
  const dashOffset = dashArray * ((100 - progress) / 100)

  const innerRef = useRef<SVGCircleElement>(null)
  useEffect(() => {
    innerRef.current?.style.setProperty('--dasharray', `${dashArray}`)
    innerRef.current?.style.setProperty('--dashoffset', `${dashOffset}`)
  }, [dashArray, progress])

  return (
    <>
      <div
        className='circular-progress-wrapper'
        style={{ width: size, height: size }}
      >
        <svg
          className='circular-progress'
          style={{ width: size, height: size }}
        >
          <circle
            className='circular-progress-track'
            cx={center}
            cy={center}
            fill='transparent'
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className='circular-progress-indicator'
            cx={center}
            cy={center}
            fill='transparent'
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
          <circle
            className='circular-progress-indicator-shiny'
            ref={innerRef}
            style={{ opacity: 0.3 }}
            cx={center}
            cy={center}
            fill='transparent'
            r={radius}
            stroke='var(--white)'
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeLinecap={indicatorCap}
          />
        </svg>

        <div className='circular-progress-label'>
          <span className='circular-progress-label__progress'>
            {`${progress > 99 ? 99 : Math.floor(progress)}%`}
          </span>
        </div>
      </div>
    </>
  )
}
export default CircularProgress
