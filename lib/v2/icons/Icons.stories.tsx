import type { Meta, StoryObj } from '@storybook/react'

import { ARROW_DIRECTIONS, ArrowIcon } from './ArrowIcon'
import { BugIcon } from './BugIcon'
import { ChartIcon } from './ChartIcon'
import { CheckboxCheckedIcon } from './CheckboxCheckedIcon'
import { CheckboxPartialIcon } from './CheckboxPartialIcon'
import { CheckboxUncheckedIcon } from './CheckboxUncheckedIcon'
import { CloseIcon } from './CloseIcon'
import { CloseWithBgIcon } from './CloseWithBgIcon'
import { DateTimeIcon } from './DateTimeIcon'
import { InfoIcon } from './InfoIcon'
import { LinkIcon } from './LinkIcon'
import { NavChevronLeftIcon } from './NavChevronLeftIcon'
import { NavChevronRightIcon } from './NavChevronRightIcon'
import { SearchIcon } from './SearchIcon'
import { SettingsIcon } from './SettingsIcon'
import { WarningCircleIcon } from './WarningCircleIcon'
import { WarningIcon } from './WarningIcon'
import { WarningTriangleIcon } from './WarningTriangleIcon'

const meta: Meta = {
  title: 'v2/Icons'
}

export default meta
type Story = StoryObj

const gridStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px'
}
const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '12px'
}

export const GeneralIcons: Story = {
  render: () => (
    <div style={gridStyle}>
      <div style={rowStyle}>
        <ArrowIcon direction={ARROW_DIRECTIONS.UP} />
        <span>ArrowIcon (up)</span>
      </div>
      <div style={rowStyle}>
        <ArrowIcon direction={ARROW_DIRECTIONS.DOWN} />
        <span>ArrowIcon (down)</span>
      </div>
      <div style={rowStyle}>
        <ArrowIcon direction={ARROW_DIRECTIONS.LEFT} />
        <span>ArrowIcon (left)</span>
      </div>
      <div style={rowStyle}>
        <ArrowIcon direction={ARROW_DIRECTIONS.RIGHT} />
        <span>ArrowIcon (right)</span>
      </div>
      <div style={rowStyle}>
        <BugIcon
          height={16}
          width={16}
        />
        <span>BugIcon</span>
      </div>
      <div style={rowStyle}>
        <ChartIcon />
        <span>ChartIcon</span>
      </div>
      <div style={rowStyle}>
        <CheckboxCheckedIcon />
        <span>CheckboxCheckedIcon</span>
      </div>
      <div style={rowStyle}>
        <CheckboxPartialIcon />
        <span>CheckboxPartialIcon</span>
      </div>
      <div style={rowStyle}>
        <CheckboxUncheckedIcon />
        <span>CheckboxUncheckedIcon</span>
      </div>
      <div style={rowStyle}>
        <CloseIcon />
        <span>CloseIcon</span>
      </div>
      <div style={rowStyle}>
        <CloseWithBgIcon />
        <span>CloseWithBgIcon</span>
      </div>
      <div style={rowStyle}>
        <DateTimeIcon />
        <span>DateTimeIcon</span>
      </div>
      <div style={rowStyle}>
        <InfoIcon />
        <span>InfoIcon</span>
      </div>
      <div style={rowStyle}>
        <LinkIcon />
        <span>LinkIcon</span>
      </div>
      <div style={rowStyle}>
        <NavChevronLeftIcon />
        <span>NavChevronLeftIcon</span>
      </div>
      <div style={rowStyle}>
        <NavChevronRightIcon />
        <span>NavChevronRightIcon</span>
      </div>
      <div style={rowStyle}>
        <SearchIcon
          height={20}
          width={20}
        />
        <span>SearchIcon</span>
      </div>
      <div style={rowStyle}>
        <SettingsIcon
          height={16}
          width={16}
        />
        <span>SettingsIcon (filled)</span>
      </div>
      <div style={rowStyle}>
        <SettingsIcon
          height={16}
          variant='outline'
          width={16}
        />
        <span>SettingsIcon (outline)</span>
      </div>
      <div style={rowStyle}>
        <WarningCircleIcon />
        <span>WarningCircleIcon (outline)</span>
      </div>
      <div style={rowStyle}>
        <WarningCircleIcon filled />
        <span>WarningCircleIcon (filled)</span>
      </div>
      <div style={rowStyle}>
        <WarningIcon />
        <span>WarningIcon (outline)</span>
      </div>
      <div style={rowStyle}>
        <WarningIcon filled />
        <span>WarningIcon (filled)</span>
      </div>
      <div style={rowStyle}>
        <WarningTriangleIcon />
        <span>WarningTriangleIcon</span>
      </div>
    </div>
  )
}
