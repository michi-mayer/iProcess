import { Component, FC, ReactNode } from 'react'

interface IRecipeProps {
  FallbackComponent: FC<{ error: never }>
  children: ReactNode
}

class ErrorBoundary extends Component<IRecipeProps> {
  override state = { error: undefined }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  override render() {
    const { error } = this.state
    const { FallbackComponent, children } = this.props
    if (error) {
      return <FallbackComponent error={error} />
    }

    return children
  }
}

export default ErrorBoundary
