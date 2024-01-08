import { FC, SVGProps } from 'react'
import { colors } from 'theme'

const ErrorIcon: FC<SVGProps<SVGSVGElement>> = ({
  height = '16px',
  width = '16px',
  fill = colors.redError,
  ...svgProps
}) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16' height={height} width={width} {...svgProps}>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M8 2a.5.5 0 0 1 .43.246l6.5 11a.5.5 0 0 1-.43.754h-13a.5.5 0 0 1-.43-.754l6.5-11A.5.5 0 0 1 8 2zM2.376 13h11.248L8 3.483 2.376 13z'
        clipRule='evenodd'
      />
      <path fill={fill} d='M7.5 9V6h1v3h-1zM7.2 11.2a.8.8 0 1 0 1.6 0 .8.8 0 0 0-1.6 0z' />
    </svg>
  )
}

export default ErrorIcon
