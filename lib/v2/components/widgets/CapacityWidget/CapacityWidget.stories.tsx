import type { CapacityProvisionedData, CapacityUsableData } from './types'
import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'

import { CapacityWidget } from './CapacityWidget'

const meta: Meta<typeof CapacityWidget> = {
  title: 'v2/Widgets/CapacityWidget',
  component: CapacityWidget
}

export default meta
type Story = StoryObj<typeof CapacityWidget>

/** Debug-only outline marking the widget limits in stories. */
const LIMIT_OUTLINE = '2px dashed #2f6fed'

const DATA_REDUCTION = { ratio: '2.32:1', savings: '536.4 TB' }

const usableWithDataReduction: CapacityUsableData = {
  used: 406.5,
  free: 312.2,
  total: 718.7,
  unit: 'TB',
  dataReduction: DATA_REDUCTION
}

const usableWithoutDataReduction: CapacityUsableData = {
  ...usableWithDataReduction,
  dataReduction: undefined
}

const provisionedWithObs: CapacityProvisionedData = {
  ssd: {
    written: 943,
    provisioned: 1400,
    writtenDisplay: '943 TB',
    provisionedDisplay: '1.4 PB'
  },
  obs: {
    written: 2500,
    provisioned: 3700,
    writtenDisplay: '2.5 PB',
    provisionedDisplay: '3.7 PB'
  },
  total: 5100,
  totalDisplay: '5.1 PB',
  unit: 'TB'
}

const provisionedSsdOnly: CapacityProvisionedData = {
  ssd: {
    written: 943,
    provisioned: 1400,
    writtenDisplay: '943 TB',
    provisionedDisplay: '1.4 PB'
  },
  total: 1400,
  totalDisplay: '1.4 PB',
  unit: 'TB'
}

function Frame({
  width,
  height,
  children
}: Readonly<{
  width: number
  height: number
  children: ReactNode
}>) {
  return <div style={{ width, height, outline: LIMIT_OUTLINE }}>{children}</div>
}

interface VariantOptions {
  width: number
  height: number
  obs: boolean
  dataReduction: boolean
}

const variantName = ({ width, height, obs, dataReduction }: VariantOptions) =>
  `${obs ? 'OBS' : 'No OBS'} · ${
    dataReduction ? 'DR' : 'No DR'
  } · ${width}×${height}`

const makeVariant = (options: VariantOptions): Story => {
  const { width, height, obs, dataReduction } = options
  return {
    name: variantName(options),
    render: () => (
      <Frame
        height={height}
        width={width}
      >
        <CapacityWidget
          provisioned={obs ? provisionedWithObs : provisionedSsdOnly}
          usable={
            dataReduction ? usableWithDataReduction : usableWithoutDataReduction
          }
        />
      </Frame>
    )
  }
}

export const ObsDr736x252 = makeVariant({
  width: 736,
  height: 252,
  obs: true,
  dataReduction: true
})

export const ObsDr736x212 = makeVariant({
  width: 736,
  height: 212,
  obs: true,
  dataReduction: true
})

export const ObsDr531x252 = makeVariant({
  width: 531,
  height: 252,
  obs: true,
  dataReduction: true
})

export const ObsDr531x212 = makeVariant({
  width: 531,
  height: 212,
  obs: true,
  dataReduction: true
})

export const ObsNoDr736x252 = makeVariant({
  width: 736,
  height: 252,
  obs: true,
  dataReduction: false
})

export const ObsNoDr736x212 = makeVariant({
  width: 736,
  height: 212,
  obs: true,
  dataReduction: false
})

export const ObsNoDr531x252 = makeVariant({
  width: 531,
  height: 252,
  obs: true,
  dataReduction: false
})

export const ObsNoDr531x212 = makeVariant({
  width: 531,
  height: 212,
  obs: true,
  dataReduction: false
})

export const NoObsDr736x252 = makeVariant({
  width: 736,
  height: 252,
  obs: false,
  dataReduction: true
})

export const NoObsDr736x212 = makeVariant({
  width: 736,
  height: 212,
  obs: false,
  dataReduction: true
})

export const NoObsDr531x252 = makeVariant({
  width: 531,
  height: 252,
  obs: false,
  dataReduction: true
})

export const NoObsDr531x212 = makeVariant({
  width: 531,
  height: 212,
  obs: false,
  dataReduction: true
})

export const NoObsNoDr736x252 = makeVariant({
  width: 736,
  height: 252,
  obs: false,
  dataReduction: false
})

export const NoObsNoDr736x212 = makeVariant({
  width: 736,
  height: 212,
  obs: false,
  dataReduction: false
})

export const NoObsNoDr531x252 = makeVariant({
  width: 531,
  height: 252,
  obs: false,
  dataReduction: false
})

export const NoObsNoDr531x212 = makeVariant({
  width: 531,
  height: 212,
  obs: false,
  dataReduction: false
})

export const CustomLabels: Story = {
  render: () => (
    <Frame
      height={252}
      width={736}
    >
      <CapacityWidget
        labels={{ used: 'Consumed', free: 'Available', ssd: 'Flash' }}
        provisioned={provisionedWithObs}
        usable={usableWithDataReduction}
      />
    </Frame>
  )
}
