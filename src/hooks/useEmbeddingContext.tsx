import { useEffect, useState } from 'react'
import { createEmbeddingContext, EmbeddingContext } from 'amazon-quicksight-embedding-sdk'

interface UseEmbeddingContextProps {
  dashboardURL: string | undefined
}

const useEmbeddingContext = ({ dashboardURL }: UseEmbeddingContextProps) => {
  const [embeddingContext, setEmbeddingContext] = useState<EmbeddingContext>()

  const createContext = async () => {
    const context = await createEmbeddingContext()
    setEmbeddingContext(context)
  }

  useEffect(() => {
    if (dashboardURL) createContext()
  }, [dashboardURL])

  return embeddingContext
}

export type UseEmbeddingContextReturn = ReturnType<typeof useEmbeddingContext>

export default useEmbeddingContext
