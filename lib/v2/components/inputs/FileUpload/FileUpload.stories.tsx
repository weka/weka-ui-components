import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FileUpload } from './FileUpload'

const CONTAINER_STYLE: CSSProperties = {
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  color: 'var(--text-primary)'
}

function FileUploadDemo() {
  const [certFileName, setCertFileName] = useState(EMPTY_STRING)
  const [keyFileName, setKeyFileName] = useState(EMPTY_STRING)

  return (
    <div style={CONTAINER_STYLE}>
      <FileUpload
        accept='.pem,.crt,.cer'
        fileName={certFileName}
        label='Certificate'
        onChange={(file) => {
          setCertFileName(file?.name ?? EMPTY_STRING)
        }}
      />
      <FileUpload
        accept='.pem,.key'
        buttonText='Upload Key'
        fileName={keyFileName}
        label='Private Key'
        onChange={(file) => {
          setKeyFileName(file?.name ?? EMPTY_STRING)
        }}
      />
      <FileUpload
        disabled
        fileName='locked-file.pem'
        label='Disabled'
        onChange={() => undefined}
      />
    </div>
  )
}

const meta: Meta<typeof FileUploadDemo> = {
  title: 'v2/Inputs/FileUpload',
  component: FileUploadDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}
