import { FC, SVGProps } from 'react'

const OverviewIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '24px', width = '24px', ...svgProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      {...svgProps}
    >
      <path
        fill='#ffffff'
        d='M10 3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm0 1H4v6h6V4zm10-1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm0 1h-6v6h6V4zm0 9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6zm0 1h-6v6h6v-6zm-10-1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6zm0 1H4v6h6v-6z'
      />
    </svg>
  )
}

export default OverviewIcon
