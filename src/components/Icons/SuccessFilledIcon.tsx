import { FC, SVGProps } from 'react'

const SuccessFilledIcon: FC<SVGProps<SVGSVGElement>> = ({
  height = '16px',
  width = '16px',
  fill = '#20607E',
  ...svgProps
}) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16' height={height} width={width} {...svgProps}>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0zm-4.354-2.354L7 9.293 5.354 7.646l-.708.708 1.824 1.823a.75.75 0 0 0 1.06 0l3.824-3.823-.707-.708z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default SuccessFilledIcon
