import { useEffect } from 'react'

const useCloseDialog = (isSuccess: boolean, onClose: () => void) => {
  useEffect(() => {
    if (isSuccess) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])
}

export default useCloseDialog
