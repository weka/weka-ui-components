import type { CSSProperties } from 'react'
import { useCallback, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING_ARRAY } from '../../../utils/consts'

import { MultiSelectAutocomplete } from './MultiSelectAutocomplete'

const CONTAINER_STYLE: CSSProperties = {
  width: '480px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  color: 'var(--text-primary)'
}

const HELP_STYLE: CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  marginTop: '-16px'
}

const ANIMALS = [
  'Aardvark',
  'Bear',
  'Cheetah',
  'Dolphin',
  'Elephant',
  'Falcon',
  'Gazelle',
  'Hippo',
  'Ibex',
  'Jaguar',
  'Koala',
  'Lemur',
  'Manatee',
  'Numbat',
  'Otter'
]

const ANY_VALUE = 'Any animal'
const ANIMALS_WITH_ANY = [ANY_VALUE, ...ANIMALS]

const REMOTE_DEBOUNCE_MS = 400

function MultiSelectAutocompleteDemo() {
  const [basic, setBasic] = useState<string[]>([])
  const [withAny, setWithAny] = useState<string[]>([ANY_VALUE])
  const [withChipIcon, setWithChipIcon] = useState<string[]>([
    'Bear',
    'Cheetah'
  ])
  const [remote, setRemote] = useState<string[]>([])
  const [remoteLoading, setRemoteLoading] = useState(false)

  const handleRemoteSearch = useCallback((q: string) => {
    setRemoteLoading(true)
    const filter = (resolve: (results: string[]) => void) => {
      const filtered = ANIMALS.filter((animal) =>
        animal.toLowerCase().includes(q.toLowerCase())
      )
      setRemoteLoading(false)
      resolve(filtered)
    }
    return new Promise<string[]>((resolve) => {
      setTimeout(() => filter(resolve), REMOTE_DEBOUNCE_MS)
    })
  }, [])

  return (
    <div style={CONTAINER_STYLE}>
      <MultiSelectAutocomplete
        label='Animals (basic)'
        onChange={setBasic}
        options={ANIMALS}
        placeholder='Type to filter…'
        value={basic}
      />
      <MultiSelectAutocomplete
        anyValue={ANY_VALUE}
        label='Animals with “Any” option'
        onChange={setWithAny}
        options={ANIMALS_WITH_ANY}
        placeholder='Type to filter…'
        value={withAny}
      />
      <div style={HELP_STYLE}>
        Try selecting an animal — “Any animal” gets cleared. Remove all chips —
        “Any animal” auto-selects.
      </div>
      <MultiSelectAutocomplete
        chipBackgroundColor='var(--purple-100-900)'
        chipIcon={<span aria-hidden>✦</span>}
        label='Animals with chip icon + custom color'
        onChange={setWithChipIcon}
        options={ANIMALS}
        placeholder='Type to filter…'
        value={withChipIcon}
      />
      <MultiSelectAutocomplete
        defaultOptions={EMPTY_STRING_ARRAY as string[]}
        isLoading={remoteLoading}
        label='Remote search'
        onChange={setRemote}
        onSearch={handleRemoteSearch}
        placeholder='Type at least 2 chars…'
        value={remote}
      />
    </div>
  )
}

const meta: Meta<typeof MultiSelectAutocompleteDemo> = {
  title: 'V2/Inputs/MultiSelectAutocomplete',
  component: MultiSelectAutocompleteDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}
