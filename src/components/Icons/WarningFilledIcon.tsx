import type { FC, SVGProps } from 'react'

const WarningFilledIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '26px', width = '26px', fill, ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32' height={height} width={width} {...svgProps}>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M29 16c0 7.18-5.82 13-13 13S3 23.18 3 16 8.82 3 16 3s13 5.82 13 13zM15.5 9v10h1V9h-1zm.5 14a.85.85 0 1 1 0-1.7.85.85 0 0 1 0 1.7z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default WarningFilledIcon
