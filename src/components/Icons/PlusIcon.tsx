import { FC, SVGProps } from 'react'

const PlusIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '20px', width = '20px', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='none' viewBox='0 0 32 32' {...svgProps}>
      <path fill='#20607E' d='M15.5 27h1V16.5H27v-1H16.5V5h-1v10.5H5v1h10.5V27z' />
    </svg>
  )
}

export default PlusIcon
