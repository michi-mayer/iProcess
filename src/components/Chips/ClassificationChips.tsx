import { memo } from 'react'
import { Classification } from 'contexts/iProcessContext'
import Chip from './Chip'

interface ClassificationChipProps {
  options: Classification[] | undefined
  onSelectChip: (item: Classification, name: string, index: number) => void | undefined
  selectedIndex: number | undefined
  name: string
}

const ClassificationChips = ({ options, onSelectChip, selectedIndex, name }: ClassificationChipProps) => {
  return (
    <>
      {options?.map((item, index) => {
        const selected = selectedIndex === index
        return (
          <li
            key={item.id}
            style={{
              listStyle: 'none',
              display: 'inline'
            }}
          >
            <Chip
              doneIcon
              iconPosition='left'
              onClick={!selected ? () => onSelectChip(item, name, index) : undefined}
              selected={selected}
              label={item.value}
            />
          </li>
        )
      })}
    </>
  )
}

export default memo(ClassificationChips)
