import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CHART_COLOR_SCHEME } from './chartConstants'
import {
  getChartGradientsFade,
  getChartGradientsVertical
} from './chartGradients'

describe('getChartGradientsVertical', () => {
  it('renders a vertical gradient def per requested color', () => {
    const { container } = render(
      <svg>
        <defs>{getChartGradientsVertical(['blue', 'aqua'])}</defs>
      </svg>
    )

    expect(
      container.querySelector('#gradient-blue-600-400-vertical')
    ).toBeInTheDocument()
    expect(
      container.querySelector('#gradient-aqua-600-400-vertical')
    ).toBeInTheDocument()
  })

  it('covers the full chart color scheme', () => {
    const { container } = render(
      <svg>
        <defs>{getChartGradientsVertical([...CHART_COLOR_SCHEME])}</defs>
      </svg>
    )

    expect(container.querySelectorAll('linearGradient')).toHaveLength(
      CHART_COLOR_SCHEME.length
    )
  })
})

describe('getChartGradientsFade', () => {
  it('renders a fade gradient def per requested color', () => {
    const { container } = render(
      <svg>
        <defs>{getChartGradientsFade(['purple'])}</defs>
      </svg>
    )

    expect(
      container.querySelector('#gradient-purple-fade-500')
    ).toBeInTheDocument()
  })
})
