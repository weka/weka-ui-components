import { describe, expect, it } from 'vitest'

import { buildXAxisConfig, buildYAxisConfig } from './axisConfigBuilders'

describe('axisConfigBuilders', () => {
  describe('buildXAxisConfig', () => {
    it('returns an empty object when no config is provided', () => {
      expect(buildXAxisConfig(undefined)).toEqual({})
    })

    it('includes only the defined properties', () => {
      const config = buildXAxisConfig({
        dataKey: 'timestamp',
        type: 'number'
      })

      expect(config).toEqual({ dataKey: 'timestamp', type: 'number' })
    })

    it('includes zero-valued tickMargin and interval', () => {
      const config = buildXAxisConfig({ tickMargin: 0, interval: 0 })

      expect(config).toEqual({ tickMargin: 0, interval: 0 })
    })

    it('passes through tick renderer and formatter', () => {
      const tick = { fontSize: 10 }
      const tickFormatter = (value: string | number) => String(value)

      const config = buildXAxisConfig({ tick, tickFormatter, height: 30 })

      expect(config).toEqual({ tick, tickFormatter, height: 30 })
    })
  })

  describe('buildXAxisConfig hide passthrough', () => {
    it('passes hide through when defined', () => {
      expect(buildXAxisConfig({ hide: true })).toEqual({ hide: true })
    })
  })

  describe('buildYAxisConfig', () => {
    it('returns an empty object when no config is provided', () => {
      expect(buildYAxisConfig(undefined)).toEqual({})
    })

    it('includes tickFormatter and includeHidden when defined', () => {
      const tickFormatter = (value: string | number) => String(value)

      const config = buildYAxisConfig({ tickFormatter, includeHidden: false })

      expect(config).toEqual({ tickFormatter, includeHidden: false })
    })

    it('passes through hide, tick, tickSize, padding and label', () => {
      const tick = { fill: 'var(--text-secondary)', fontSize: 12 }
      const label = { value: 'MB/s', position: 'insideTopLeft' }
      const padding = { top: 25, bottom: 12 }

      const config = buildYAxisConfig({
        hide: false,
        tickSize: 8,
        tick,
        padding,
        label
      })

      expect(config).toEqual({ hide: false, tickSize: 8, tick, padding, label })
    })
  })
})
