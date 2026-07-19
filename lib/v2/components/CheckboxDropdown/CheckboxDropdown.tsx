import { useMemo, useState } from 'react'
import { clsx } from 'clsx'

import { EMPTY_STRING, SEARCH_PLACEHOLDER } from '#v2/utils/consts'

import { SearchIcon } from '../../icons'
import { Button, BUTTON_VARIANTS } from '../Button'
import { Checkbox } from '../CheckBox'

import styles from './checkboxDropdown.module.scss'

export interface CheckboxOption {
  id: string
  label: string
  checked: boolean
}

export interface CheckboxDropdownProps {
  options: CheckboxOption[]
  onApply: (selectedIds: string[]) => void
  onClose: () => void
  extraClass?: string
  selectAllLabel?: string
  applyLabel?: string
  dataTestId?: string
}

function getOptionsKey(options: CheckboxOption[]): string {
  return options.map((option) => `${option.id}:${option.checked}`).join('|')
}

export function CheckboxDropdown({
  options,
  onApply,
  onClose,
  extraClass,
  selectAllLabel = 'Select All',
  applyLabel = 'Apply',
  dataTestId
}: Readonly<CheckboxDropdownProps>) {
  const [tempSelection, setTempSelection] = useState<Set<string>>(
    new Set(
      options.filter((option) => option.checked).map((option) => option.id)
    )
  )
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING)

  const optionsKey = getOptionsKey(options)
  const [lastOptionsKey, setLastOptionsKey] = useState(optionsKey)
  if (optionsKey !== lastOptionsKey) {
    setLastOptionsKey(optionsKey)
    setTempSelection(
      new Set(
        options.filter((option) => option.checked).map((option) => option.id)
      )
    )
  }

  const filteredOptions = useMemo(() => {
    if (!searchQuery) {
      return options
    }
    const query = searchQuery.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const checkedCount = tempSelection.size
  const isAllChecked = checkedCount === options.length
  const isIndeterminate = checkedCount > 0 && checkedCount < options.length

  const handleOptionToggle = (id: string) => {
    setTempSelection((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    setTempSelection(new Set(options.map((option) => option.id)))
  }

  const deselectAll = () => {
    setTempSelection(new Set())
  }

  const toggleSelectAll = () => {
    if (isAllChecked) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  const handleApply = () => {
    onApply(Array.from(tempSelection))
    onClose()
  }

  return (
    <div
      className={clsx(styles.dropdown, extraClass)}
      data-testid={dataTestId}
    >
      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <div className={styles.searchIcon}>
              <SearchIcon />
            </div>
            <input
              className={styles.searchInput}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={SEARCH_PLACEHOLDER}
              type='text'
              value={searchQuery}
            />
          </div>
        </div>
        <div
          className={styles.selectAllOption}
          data-testid='select-all-option'
          onClick={toggleSelectAll}
        >
          <Checkbox
            checked={isAllChecked}
            onChange={toggleSelectAll}
            partiallyChecked={isIndeterminate}
          />
          <span
            className={styles.optionLabel}
            title={selectAllLabel}
          >
            {selectAllLabel}
          </span>
        </div>
        <div className={styles.separator} />
        <div className={styles.optionsList}>
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={styles.option}
              data-testid={`chart-option-${option.id}`}
              onClick={() => handleOptionToggle(option.id)}
            >
              <Checkbox
                checked={tempSelection.has(option.id)}
                onChange={() => handleOptionToggle(option.id)}
              />
              <span
                className={styles.optionLabel}
                title={option.label}
              >
                {option.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          dataTestId='apply-button'
          onClick={handleApply}
          variant={BUTTON_VARIANTS.PRIMARY}
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  )
}
