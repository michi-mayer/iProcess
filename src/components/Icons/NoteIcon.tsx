import { FC, SVGProps } from 'react'

const OverviewIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '24px', width = '24px', ...svgProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      {...svgProps}
    >
      <path
        id='color'
        d='M.5,14a.5.5,0,0,1-.492-.41L0,13.5V2.5a.5.5,0,0,1,.41-.492L.5,2H6V3H1V13H11V8h1v5.5a.5.5,0,0,1-.41.492L11.5,14ZM5.146,8.853a.5.5,0,0,1-.058-.637l.058-.069L12.293,1H8V0h5.5a.5.5,0,0,1,.492.41v0A.5.5,0,0,1,14,.5V6H13V1.708L5.854,8.853a.5.5,0,0,1-.707,0Z'
        transform='translate(5 5)'
        fill='#fff'
      />
    </svg>
  )
}

export default OverviewIcon
