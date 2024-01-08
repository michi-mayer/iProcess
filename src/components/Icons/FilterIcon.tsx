import { FC, SVGProps } from 'react'

const FilterIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '30px', width = '30px', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='none' viewBox='0 0 24 24' {...svgProps}>
      <path
        fill='#20607E'
        d='M4.512 5.507A1 1 0 0 1 5.374 4h13.252a1 1 0 0 1 .862 1.507L15 13.137v5.625a1 1 0 0 1-1.371.928l-4-1.6a1 1 0 0 1-.63-.928v-4.026L4.513 5.507zM18.626 5H5.374L10 12.864v4.297l4 1.6v-5.897L18.626 5z'
      />
    </svg>
  )
}

export default FilterIcon
