import { FC, SVGProps } from 'react'

const ArrowIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '24px', width = '24px', fill = '#20607E', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill='none' viewBox='0 0 24 24' {...svgProps}>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M19.188 8.61l.624.78-7.5 6a.5.5 0 0 1-.542.054l-.082-.054-7.5-6 .624-.78L12 14.358l7.188-5.75z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default ArrowIcon
