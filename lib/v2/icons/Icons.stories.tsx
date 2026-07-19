import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'

import { ARROW_DIRECTIONS, ArrowIcon } from './ArrowIcon'
import { BugIcon } from './BugIcon'
import { ChartIcon } from './ChartIcon'
import { CheckboxCheckedIcon } from './CheckboxCheckedIcon'
import { CheckboxPartialIcon } from './CheckboxPartialIcon'
import { CheckboxUncheckedIcon } from './CheckboxUncheckedIcon'
import { CheckIcon } from './CheckIcon'
import { ChevronDownSmallIcon } from './ChevronDownSmallIcon'
import { ChevronLeftIcon } from './ChevronLeftIcon'
import { CloseIcon } from './CloseIcon'
import { CloseRoundedIcon } from './CloseRoundedIcon'
import { CloseWithBgIcon } from './CloseWithBgIcon'
import { ConfigureIcon } from './ConfigureIcon'
import { DarkModeIcon } from './DarkModeIcon'
import { DateTimeIcon } from './DateTimeIcon'
import { DownloadIcon } from './DownloadIcon'
import { DriversIcon } from './DriversIcon'
import { EditIcon } from './EditIcon'
import { EyeIcon } from './EyeIcon'
import { EyeOffIcon } from './EyeOffIcon'
import { FileSystemIcon } from './FileSystemIcon'
import { FilterIcon } from './FilterIcon'
import { InfoIcon } from './InfoIcon'
import { InvestigateIcon } from './InvestigateIcon'
import { LightModeIcon } from './LightModeIcon'
import { LinkIcon } from './LinkIcon'
import { LockIcon } from './LockIcon'
import { LogoutIcon } from './LogoutIcon'
import { ManageIcon } from './ManageIcon'
import { MonitorIcon } from './MonitorIcon'
import { MuteIcon } from './MuteIcon'
import { NavChevronLeftIcon } from './NavChevronLeftIcon'
import { NavChevronRightIcon } from './NavChevronRightIcon'
import { NotificationsIcon } from './NotificationsIcon'
import { PauseIcon } from './PauseIcon'
import { PlusIcon } from './PlusIcon'
import { ResetIcon } from './ResetIcon'
import { RestoreIcon } from './RestoreIcon'
import { S3BucketsIcon } from './S3BucketsIcon'
import { SearchIcon } from './SearchIcon'
import { ServersIcon } from './ServersIcon'
import { SettingsIcon } from './SettingsIcon'
import { SortIcon } from './SortIcon'
import { SortUpDownIcon } from './SortUpDownIcon'
import { SwapIcon } from './SwapIcon'
import { TenantIcon } from './TenantIcon'
import { ThreeDotsMenuIcon } from './ThreeDotsMenuIcon'
import { UnmuteIcon } from './UnmuteIcon'
import { UserIcon } from './UserIcon'
import { VcheckFillIcon } from './VcheckFillIcon'
import { VcheckGradientIcon } from './VcheckGradientIcon'
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

const SMALL_ICON_SIZE = 16
const SEARCH_ICON_SIZE = 20
const VCHECK_ICON_SIZE = 24

const generalIcons: { name: string; node: ReactNode }[] = [
  {
    name: 'ArrowIcon (up)',
    node: <ArrowIcon direction={ARROW_DIRECTIONS.UP} />
  },
  {
    name: 'ArrowIcon (down)',
    node: <ArrowIcon direction={ARROW_DIRECTIONS.DOWN} />
  },
  {
    name: 'ArrowIcon (left)',
    node: <ArrowIcon direction={ARROW_DIRECTIONS.LEFT} />
  },
  {
    name: 'ArrowIcon (right)',
    node: <ArrowIcon direction={ARROW_DIRECTIONS.RIGHT} />
  },
  {
    name: 'BugIcon',
    node: (
      <BugIcon
        height={SMALL_ICON_SIZE}
        width={SMALL_ICON_SIZE}
      />
    )
  },
  { name: 'ChartIcon', node: <ChartIcon /> },
  { name: 'CheckIcon', node: <CheckIcon /> },
  { name: 'CheckboxCheckedIcon', node: <CheckboxCheckedIcon /> },
  { name: 'CheckboxPartialIcon', node: <CheckboxPartialIcon /> },
  { name: 'CheckboxUncheckedIcon', node: <CheckboxUncheckedIcon /> },
  { name: 'ChevronDownSmallIcon', node: <ChevronDownSmallIcon /> },
  { name: 'ChevronLeftIcon', node: <ChevronLeftIcon /> },
  { name: 'CloseIcon', node: <CloseIcon /> },
  { name: 'CloseRoundedIcon', node: <CloseRoundedIcon /> },
  { name: 'CloseWithBgIcon', node: <CloseWithBgIcon /> },
  { name: 'ConfigureIcon', node: <ConfigureIcon /> },
  { name: 'DarkModeIcon', node: <DarkModeIcon /> },
  { name: 'DateTimeIcon', node: <DateTimeIcon /> },
  { name: 'DownloadIcon', node: <DownloadIcon /> },
  { name: 'EditIcon (filled)', node: <EditIcon /> },
  { name: 'EditIcon (stroke)', node: <EditIcon variant='stroke' /> },
  { name: 'EyeIcon', node: <EyeIcon /> },
  { name: 'EyeOffIcon', node: <EyeOffIcon /> },
  { name: 'FilterIcon', node: <FilterIcon /> },
  { name: 'InfoIcon', node: <InfoIcon /> },
  { name: 'InvestigateIcon', node: <InvestigateIcon /> },
  { name: 'LightModeIcon', node: <LightModeIcon /> },
  { name: 'LinkIcon', node: <LinkIcon /> },
  { name: 'LockIcon', node: <LockIcon /> },
  { name: 'LogoutIcon', node: <LogoutIcon /> },
  { name: 'ManageIcon', node: <ManageIcon /> },
  { name: 'MonitorIcon', node: <MonitorIcon /> },
  { name: 'MuteIcon', node: <MuteIcon /> },
  { name: 'NavChevronLeftIcon', node: <NavChevronLeftIcon /> },
  { name: 'NavChevronRightIcon', node: <NavChevronRightIcon /> },
  { name: 'NotificationsIcon', node: <NotificationsIcon /> },
  {
    name: 'PauseIcon',
    node: (
      <PauseIcon
        height={SMALL_ICON_SIZE}
        width={SMALL_ICON_SIZE}
      />
    )
  },
  { name: 'PlusIcon', node: <PlusIcon /> },
  { name: 'ResetIcon', node: <ResetIcon /> },
  { name: 'RestoreIcon', node: <RestoreIcon /> },
  {
    name: 'SearchIcon',
    node: (
      <SearchIcon
        height={SEARCH_ICON_SIZE}
        width={SEARCH_ICON_SIZE}
      />
    )
  },
  {
    name: 'SettingsIcon (filled)',
    node: (
      <SettingsIcon
        height={SMALL_ICON_SIZE}
        width={SMALL_ICON_SIZE}
      />
    )
  },
  {
    name: 'SettingsIcon (outline)',
    node: (
      <SettingsIcon
        height={SMALL_ICON_SIZE}
        variant='outline'
        width={SMALL_ICON_SIZE}
      />
    )
  },
  { name: 'SortIcon', node: <SortIcon /> },
  { name: 'SortUpDownIcon', node: <SortUpDownIcon /> },
  { name: 'SwapIcon', node: <SwapIcon /> },
  { name: 'TenantIcon', node: <TenantIcon /> },
  { name: 'ThreeDotsMenuIcon', node: <ThreeDotsMenuIcon /> },
  { name: 'UnmuteIcon', node: <UnmuteIcon /> },
  { name: 'UserIcon', node: <UserIcon /> },
  {
    name: 'VcheckFillIcon',
    node: (
      <VcheckFillIcon
        height={VCHECK_ICON_SIZE}
        width={VCHECK_ICON_SIZE}
      />
    )
  },
  {
    name: 'VcheckGradientIcon',
    node: (
      <VcheckGradientIcon
        height={VCHECK_ICON_SIZE}
        width={VCHECK_ICON_SIZE}
      />
    )
  },
  { name: 'WarningCircleIcon (outline)', node: <WarningCircleIcon /> },
  { name: 'WarningCircleIcon (filled)', node: <WarningCircleIcon filled /> },
  { name: 'WarningIcon (outline)', node: <WarningIcon /> },
  { name: 'WarningIcon (filled)', node: <WarningIcon filled /> },
  { name: 'WarningTriangleIcon (outline)', node: <WarningTriangleIcon /> },
  { name: 'WarningTriangleIcon (filled)', node: <WarningTriangleIcon filled /> }
]

export const GeneralIcons: Story = {
  render: () => (
    <div style={gridStyle}>
      {generalIcons.map(({ name, node }) => (
        <div
          key={name}
          style={rowStyle}
        >
          {node}
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}

const INVENTORY_ICON_SIZE = 36
const iconCellStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px'
}
const inventoryIcons = [
  { name: 'DriversIcon', Icon: DriversIcon },
  { name: 'FileSystemIcon', Icon: FileSystemIcon },
  { name: 'S3BucketsIcon', Icon: S3BucketsIcon },
  { name: 'ServersIcon', Icon: ServersIcon }
]

export const InventoryIcons: Story = {
  render: () => (
    <div style={rowStyle}>
      {inventoryIcons.map(({ name, Icon }) => (
        <div
          key={name}
          style={iconCellStyle}
        >
          <Icon
            height={INVENTORY_ICON_SIZE}
            width={INVENTORY_ICON_SIZE}
          />
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}
