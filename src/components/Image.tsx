import { CSSProperties } from 'react'
import useQueryFile from 'hooks/services/useQueryFile'

interface ImageProps {
  style?: CSSProperties
  imgKey: string
}

const Image = ({ style, imgKey }: ImageProps) => {
  const { data: imgUrl, isSuccess, isPending, isStale } = useQueryFile(imgKey)

  return (
    <>
      {(isPending || isStale) && <div style={style} />}
      {isSuccess && <img src={imgUrl?.toString()} alt={imgKey} style={style} loading='lazy' />}
    </>
  )
}

export default Image
