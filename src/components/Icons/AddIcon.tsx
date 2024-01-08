import { FC, SVGProps } from 'react'

const AddIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '30px', width = '30px', fill = '#20607E', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' height={height} width={width} fill={fill} viewBox='0 0 24 24' {...svgProps}>
      <path fill={fill} d='M11.5 11.5V8h1v3.5H16v1h-3.5V16h-1v-3.5H8v-1h3.5z' />
      <path
        fill={fill}
        fillRule='evenodd'
        d='M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-1 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default AddIcon
