import { FC, SVGProps } from 'react'

const TriangleIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '10px', width = '10px', ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' height={height} width={width} viewBox='0 0 16 16' {...svgProps}>
      <path
        fill='#20607E'
        fillRule='evenodd'
        d='M8.433 2.75a.5.5 0 0 0-.866 0l-5.5 9.5A.5.5 0 0 0 2.5 13h11a.5.5 0 0 0 .433-.75l-5.5-9.5z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default TriangleIcon
