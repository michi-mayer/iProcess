import { FC, SVGProps } from 'react'

const BurgerIcon: FC<SVGProps<SVGSVGElement>> = ({ ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} height={24} width={24} fill='none' viewBox='0 0 24 24'>
      <path fill='#20607E' d='M20 6v1H4V6h16zM20 17v1H4v-1h16zM20 12.5v-1H4v1h16z' style={{ fill: '#ffffff' }} />
    </svg>
  )
}

export default BurgerIcon
