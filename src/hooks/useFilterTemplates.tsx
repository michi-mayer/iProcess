import { useDeferredValue, useMemo } from 'react'
import { textIsIncluded } from 'helper/utils'
import { TemplateBase } from '../types'

function useFilterTemplates<T extends TemplateBase>(
  searchInput: string,
  templates: T[],
  clickedOption: TemplateBase | undefined
): T[] {
  const deferredSearchInput = useDeferredValue(searchInput)

  return useMemo(() => {
    return templates.filter(({ description }) => {
      if (clickedOption) {
        return description === clickedOption.description // ? We want to show Repeated disruption template names
      }
      return textIsIncluded(description, deferredSearchInput)
    })
  }, [clickedOption, templates, deferredSearchInput])
}

export default useFilterTemplates
