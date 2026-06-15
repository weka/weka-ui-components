import type { Meta, StoryObj } from '@storybook/react'

import { ARROW_DIRECTIONS, ArrowIcon } from './ArrowIcon'
import { BugIcon } from './BugIcon'
import { ChartIcon } from './ChartIcon'
import { CheckboxCheckedIcon } from './CheckboxCheckedIcon'
import { CheckboxPartialIcon } from './CheckboxPartialIcon'
import { CheckboxUncheckedIcon } from './CheckboxUncheckedIcon'
import { ChevronDownSmallIcon } from './ChevronDownSmallIcon'
import { ChevronLeftIcon } from './ChevronLeftIcon'
import { CloseIcon } from './CloseIcon'
import { CloseRoundedIcon } from './CloseRoundedIcon'
import { CloseWithBgIcon } from './CloseWithBgIcon'
import { ConfigureIcon } from './ConfigureIcon'
import { DarkModeIcon } from './DarkModeIcon'
import { DateTimeIcon } from './DateTimeIcon'
import { DownloadIcon } from './DownloadIcon'
import { FilterIcon } from './FilterIcon'
import { InfoIcon } from './InfoIcon'
import { InvestigateIcon } from './InvestigateIcon'
import { LightModeIcon } from './LightModeIcon'
import { LinkIcon } from './LinkIcon'
import { LogoutIcon } from './LogoutIcon'
import { ManageIcon } from './ManageIcon'
import { MonitorIcon } from './MonitorIcon'
import { NavChevronLeftIcon } from './NavChevronLeftIcon'
import { NavChevronRightIcon } from './NavChevronRightIcon'
import { NotificationsIcon } from './NotificationsIcon'
import { ResetIcon } from './ResetIcon'
import { SearchIcon } from './SearchIcon'
import { SettingsIcon } from './SettingsIcon'
import { SortIcon } from './SortIcon'
import { SortUpDownIcon } from './SortUpDownIcon'
import { SwapIcon } from './SwapIcon'
import { ThreeDotsMenuIcon } from './ThreeDotsMenuIcon'
import { VcheckFillIcon } from './VcheckFillIcon'
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
        <ChevronDownSmallIcon />
        <span>ChevronDownSmallIcon</span>
      </div>
      <div style={rowStyle}>
        <ChevronLeftIcon />
        <span>ChevronLeftIcon</span>
      </div>
      <div style={rowStyle}>
        <CloseIcon />
        <span>CloseIcon</span>
      </div>
      <div style={rowStyle}>
        <CloseRoundedIcon />
        <span>CloseRoundedIcon</span>
      </div>
      <div style={rowStyle}>
        <CloseWithBgIcon />
        <span>CloseWithBgIcon</span>
      </div>
      <div style={rowStyle}>
        <ConfigureIcon />
        <span>ConfigureIcon</span>
      </div>
      <div style={rowStyle}>
        <DarkModeIcon />
        <span>DarkModeIcon</span>
      </div>
      <div style={rowStyle}>
        <DateTimeIcon />
        <span>DateTimeIcon</span>
      </div>
      <div style={rowStyle}>
        <DownloadIcon />
        <span>DownloadIcon</span>
      </div>
      <div style={rowStyle}>
        <FilterIcon />
        <span>FilterIcon</span>
      </div>
      <div style={rowStyle}>
        <InfoIcon />
        <span>InfoIcon</span>
      </div>
      <div style={rowStyle}>
        <InvestigateIcon />
        <span>InvestigateIcon</span>
      </div>
      <div style={rowStyle}>
        <LightModeIcon />
        <span>LightModeIcon</span>
      </div>
      <div style={rowStyle}>
        <LinkIcon />
        <span>LinkIcon</span>
      </div>
      <div style={rowStyle}>
        <LogoutIcon />
        <span>LogoutIcon</span>
      </div>
      <div style={rowStyle}>
        <ManageIcon />
        <span>ManageIcon</span>
      </div>
      <div style={rowStyle}>
        <MonitorIcon />
        <span>MonitorIcon</span>
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
        <NotificationsIcon />
        <span>NotificationsIcon</span>
      </div>
      <div style={rowStyle}>
        <ResetIcon />
        <span>ResetIcon</span>
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
        <SortIcon />
        <span>SortIcon</span>
      </div>
      <div style={rowStyle}>
        <SortUpDownIcon />
        <span>SortUpDownIcon</span>
      </div>
      <div style={rowStyle}>
        <SwapIcon />
        <span>SwapIcon</span>
      </div>
      <div style={rowStyle}>
        <ThreeDotsMenuIcon />
        <span>ThreeDotsMenuIcon</span>
      </div>
      <div style={rowStyle}>
        <VcheckFillIcon height={24} width={24} />
        <span>VcheckFillIcon</span>
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
