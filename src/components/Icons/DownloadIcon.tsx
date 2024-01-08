import { FC, SVGProps } from 'react'

const DownloadIcon: FC<SVGProps<SVGSVGElement>> = ({
  height = '24px',
  width = '24px',
  color = '#20607E',
  ...svgProps
}) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='none' viewBox='0 0 24 24' {...svgProps}>
      <path
        fill={color}
        fillRule='evenodd'
        d='M11.5 14.793V4h1v10.793l3.146-3.146.707.707-4 4a.5.5 0 0 1-.707 0l-4-4 .708-.707 3.146 3.146zM19 19v-3h1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3h1v3h14z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default DownloadIcon
