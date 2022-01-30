import {render} from '@testing-library/react'
import { Theme } from 'providers/Theme/Theme'

/**
 * Decorates a component under test with necessary
 * context providers.
 */
const renderWithProviders = (children: JSX.Element) => {
  return render(
    <Theme>
      {children}
    </Theme>
  )
}

/** Waits for a specified number of milliseconds. */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export * from '@testing-library/react'
export { renderWithProviders as render, wait };