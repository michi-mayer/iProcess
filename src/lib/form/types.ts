import type { HTMLAttributes, ReactNode, SyntheticEvent } from 'react'
import type { AutocompleteInputChangeReason, AutocompleteRenderOptionState } from '@mui/material'

export type OnInputChange =
  | ((event: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void)
  | undefined
export type GetOptionLabel<T extends object | string> = (option: T) => string
export type RenderOption<T extends object | string> =
  | ((props: HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => ReactNode)
  | undefined
