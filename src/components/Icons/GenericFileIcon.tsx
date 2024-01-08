import { FC, SVGProps } from 'react'

interface Props extends SVGSVGElement {
  color?: string
}

const GenericFileIcon: FC<SVGProps<Props>> = ({ color = '#20607E', height = '24px', width = '24px', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' height={height} width={width} {...svgProps}>
      <path
        fill={color}
        fillRule='evenodd'
        d='M5.5 3a.5.5 0 0 0-.5.5v17a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.146-.354l-4.5-4.5A.5.5 0 0 0 14 3H5.5zM6 20V4h7v4a1 1 0 0 0 1 1h4v11H6zM17.793 8L14 4.207V8h3.793z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default GenericFileIcon
