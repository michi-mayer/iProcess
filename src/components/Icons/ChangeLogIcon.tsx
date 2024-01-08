import { FC, SVGProps } from 'react'

const ChangeLogIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '24px', width = '24px', ...svgProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      {...svgProps}
    >
      <defs>
        <clipPath id='clip-path'>
          <path
            id='icon'
            d='M2.369,9V8H15V9ZM0,9V8H.986V9ZM2.369,5V4H15V5ZM0,5V4H.986V5ZM2.369,1V0H15V1ZM0,1V0H.986V1Z'
            transform='translate(5 8)'
            fill='#fff'
          />
        </clipPath>
      </defs>
      <g id='Group_6' data-name='Group 6'>
        <path
          id='icon-2'
          data-name='icon'
          d='M2.369,9V8H15V9ZM0,9V8H.986V9ZM2.369,5V4H15V5ZM0,5V4H.986V5ZM2.369,1V0H15V1ZM0,1V0H.986V1Z'
          transform='translate(5 8)'
          fill='#fff'
        />
      </g>
    </svg>
  )
}

export default ChangeLogIcon
