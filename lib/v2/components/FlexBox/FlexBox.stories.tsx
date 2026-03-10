import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { FlexBox } from './FlexBox'

const meta: Meta<typeof FlexBox> = {
  title: 'v2/FlexBox',
  component: FlexBox,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column']
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch']
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly'
      ]
    },
    wrap: { control: 'boolean' },
    gap: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof FlexBox>

function Box({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
      }}
    >
      {children}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <FlexBox gap={8}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </FlexBox>
  )
}

export const Column: Story = {
  render: () => (
    <FlexBox
      direction='column'
      gap={8}
    >
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </FlexBox>
  )
}

export const SpaceBetween: Story = {
  render: () => (
    <FlexBox
      justify='space-between'
      style={{ width: '100%' }}
    >
      <Box>Left</Box>
      <Box>Right</Box>
    </FlexBox>
  )
}

export const Centered: Story = {
  render: () => (
    <FlexBox
      align='center'
      justify='center'
      style={{ height: '200px', border: '1px dashed #ccc' }}
    >
      <Box>Centered Content</Box>
    </FlexBox>
  )
}

export const WithWrap: Story = {
  render: () => (
    <FlexBox
      gap={8}
      style={{ width: '300px' }}
      wrap
    >
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
    </FlexBox>
  )
}

export const AllJustifyOptions: Story = {
  render: () => (
    <FlexBox
      direction='column'
      gap={16}
    >
      {(
        [
          'flex-start',
          'center',
          'flex-end',
          'space-between',
          'space-around',
          'space-evenly'
        ] as const
      ).map((justify) => (
        <div key={justify}>
          <div style={{ marginBottom: '4px', fontSize: '12px' }}>{justify}</div>
          <FlexBox
            justify={justify}
            style={{ border: '1px solid #ccc', padding: '8px' }}
          >
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </FlexBox>
        </div>
      ))}
    </FlexBox>
  )
}
