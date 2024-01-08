import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SubmitButton } from './Buttons'

describe('SubmitButton', () => {
  const text = 'Submit'

  it('Checks SubmitButton can be clicked', () => {
    const handleClickFunction = vi.fn()
    render(<SubmitButton onClick={handleClickFunction}>{text}</SubmitButton>)
    const button = screen.getByText(text)

    // The button is initialized and rendered
    expect(button).toBeInTheDocument()

    // The function is called when clicking the button
    fireEvent.click(button)
    expect(handleClickFunction).toHaveBeenCalledOnce()
  })

  it('Checks SubmitButton is not clickable when disabled', () => {
    const handleClickFunction = vi.fn()
    render(<SubmitButton disabled={true}>{text}</SubmitButton>)

    const button = screen.getByText(text)

    // button is disabled
    expect(button).toBeDisabled()

    // the handleClickFunction is not triggered
    fireEvent.click(button)
    expect(handleClickFunction).not.toHaveBeenCalledOnce()
  })
})
