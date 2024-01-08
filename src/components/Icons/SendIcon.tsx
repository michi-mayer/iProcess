import type { FC, SVGProps } from 'react'

const SendIcon: FC<SVGProps<SVGSVGElement>> = ({ height = 24, width = 24, ...svgProps }) => {
  return (
    <svg height={height} width={width} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...svgProps}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.9569 3.70308C21.0409 3.51403 20.9998 3.29275 20.8536 3.14646C20.7073 3.00017 20.486 2.95908 20.2969 3.04311L2.29693 11.0431C2.12262 11.1206 2.00758 11.2905 2.00036 11.4811C1.99314 11.6717 2.095 11.8498 2.26295 11.9402L8.63088 15.3691L12.0598 21.7371C12.1502 21.905 12.3283 22.0069 12.5189 21.9997C12.7095 21.9924 12.8794 21.8774 12.9569 21.7031L20.9569 3.70308ZM8.90954 14.3834L3.63443 11.543L18.2424 5.05054L8.90954 14.3834ZM9.61663 15.0906L12.457 20.3656L18.9494 5.7578L9.61663 15.0906Z'
        fill='#20607E'
      />
    </svg>
  )
}

export default SendIcon
