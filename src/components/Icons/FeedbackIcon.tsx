import { FC, SVGProps } from 'react'

const FeedbackIcon: FC<SVGProps<SVGSVGElement>> = ({ height = '24px', width = '24px', ...svgProps }) => {
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
            d='M10,20a9.891,9.891,0,0,1-4.4-1.02l-5,1.01A.48.48,0,0,1,.5,20a.5.5,0,0,1-.354-.147A.5.5,0,0,1,.01,19.4l1.01-5A10,10,0,1,1,10,20ZM5.667,17.956a.5.5,0,0,1,.229.056A8.906,8.906,0,0,0,10,19a9,9,0,1,0-9-9,8.89,8.89,0,0,0,.989,4.1.5.5,0,0,1,.045.328L1.14,18.86l4.428-.895A.453.453,0,0,1,5.667,17.956ZM11,14H5.992V13H11v1Zm4-3H6V10h9v1ZM14,8H6V7h8V8Z'
            transform='translate(2 2)'
            fill='#fff'
          />
        </clipPath>
      </defs>
      <g id='Group_137' data-name='Group 137'>
        <path
          id='icon-2'
          data-name='icon'
          d='M10,20a9.891,9.891,0,0,1-4.4-1.02l-5,1.01A.48.48,0,0,1,.5,20a.5.5,0,0,1-.354-.147A.5.5,0,0,1,.01,19.4l1.01-5A10,10,0,1,1,10,20ZM5.667,17.956a.5.5,0,0,1,.229.056A8.906,8.906,0,0,0,10,19a9,9,0,1,0-9-9,8.89,8.89,0,0,0,.989,4.1.5.5,0,0,1,.045.328L1.14,18.86l4.428-.895A.453.453,0,0,1,5.667,17.956ZM11,14H5.992V13H11v1Zm4-3H6V10h9v1ZM14,8H6V7h8V8Z'
          transform='translate(2 2)'
          fill='#fff'
        />
      </g>
    </svg>
  )
}

export default FeedbackIcon
