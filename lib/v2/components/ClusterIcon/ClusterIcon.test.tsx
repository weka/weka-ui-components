import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ClusterIcon } from './ClusterIcon'

const CLUSTER_TYPE_TEST_DATA = [
  ['aws', 'AWS'],
  ['AWS', 'AWS'],
  ['gcp', 'GCP'],
  ['google', 'GCP'],
  ['azure', 'Azure'],
  ['k8s', 'K8S'],
  ['oci', 'OCI'],
  ['onprem', 'On-Prem'],
  ['on-prem', 'On-Prem'],
  ['weka', 'Weka']
] as const

const DEFAULT_CLUSTER_TYPE = 'weka'
const WRAPPER_SELECTOR = '[class*="wrapper"]'

describe('ClusterIcon', () => {
  describe('Icon Rendering', () => {
    it('renders an SVG icon', () => {
      render(<ClusterIcon clusterType={DEFAULT_CLUSTER_TYPE} />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders Weka icon as default for unknown cluster type', () => {
      render(
        <ClusterIcon
          clusterType='unknown'
          showLabel
        />
      )
      expect(screen.getByText('Weka')).toBeInTheDocument()
    })
  })

  describe('Label Display', () => {
    it.each([...CLUSTER_TYPE_TEST_DATA, ['unknown', 'Weka']] as const)(
      'shows correct label "%s" for cluster type %s',
      (clusterType, expectedLabel) => {
        render(
          <ClusterIcon
            clusterType={clusterType}
            showLabel
          />
        )
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      }
    )

    it('shows tooltip instead of label by default', () => {
      render(<ClusterIcon clusterType={DEFAULT_CLUSTER_TYPE} />)
      const labelSpan = document.querySelector('span[class*="label"]')
      expect(labelSpan).not.toBeInTheDocument()
    })

    it('shows label span when showLabel is true', () => {
      render(
        <ClusterIcon
          clusterType={DEFAULT_CLUSTER_TYPE}
          showLabel
        />
      )
      const labelSpan = document.querySelector('span[class*="label"]')
      expect(labelSpan).toBeInTheDocument()
      expect(labelSpan).toHaveTextContent('Weka')
    })
  })

  describe('Variants', () => {
    it('applies wrapper class by default', () => {
      render(<ClusterIcon clusterType={DEFAULT_CLUSTER_TYPE} />)
      const wrapper = document.querySelector(WRAPPER_SELECTOR)
      expect(wrapper).toBeInTheDocument()
    })

    it('applies headerStyle class for headerStyle variant', () => {
      render(
        <ClusterIcon
          clusterType={DEFAULT_CLUSTER_TYPE}
          variant='headerStyle'
        />
      )
      const wrapper = document.querySelector(WRAPPER_SELECTOR)
      expect(wrapper?.className).toContain('headerStyle')
    })

    it('does not apply headerStyle class for default variant', () => {
      render(
        <ClusterIcon
          clusterType={DEFAULT_CLUSTER_TYPE}
          variant='default'
        />
      )
      const wrapper = document.querySelector(WRAPPER_SELECTOR)
      expect(wrapper?.className).not.toContain('headerStyle')
    })
  })

  describe('Size', () => {
    it.each(['small', 'medium', 'large'] as const)(
      'applies %s size class',
      (size) => {
        render(
          <ClusterIcon
            clusterType={DEFAULT_CLUSTER_TYPE}
            size={size}
          />
        )
        const svg = document.querySelector('svg')
        expect(svg?.getAttribute('class')).toContain(size)
      }
    )
  })

  describe('Extra Class', () => {
    it('applies extraClass to the icon', () => {
      render(
        <ClusterIcon
          clusterType={DEFAULT_CLUSTER_TYPE}
          extraClass='custom-class'
        />
      )
      const svg = document.querySelector('svg')
      expect(svg?.getAttribute('class')).toContain('custom-class')
    })
  })
})
