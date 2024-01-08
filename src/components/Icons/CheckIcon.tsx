import { FC, SVGProps } from 'react'

const CheckIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '16px', width = '16px', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16' height={height} width={width} {...svgProps}>
      <path
        fill='#20607E'
        fillRule='evenodd'
        d='M13.646 2.647l.708.707-9 9a.5.5 0 0 1-.638.057l-.07-.058-3-3 .708-.707L5 11.293l8.646-8.646z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default CheckIcon
