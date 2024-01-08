import { FC, SVGProps } from 'react'

const ClockLines: FC<SVGProps<SVGSVGElement>> = ({ width = '16', height = '16', ...svgProps }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      viewBox='0 0 16 16'
      {...svgProps}
    >
      <defs>
        <clipPath id='a'>
          <rect width='16' height='16' transform='translate(0 -1)' fill='#1b1e1f' />
        </clipPath>
      </defs>
      <g transform='translate(0 1)'>
        <g clipPath='url(#a)'>
          <path d='M8,7V2.5H7V7H4V8H7A1,1,0,0,0,8,7' transform='translate(1)' fill='#1b1e1f' fillRule='evenodd' />
          <path
            d='M7.1,0Zm.037,0h0m.141,0h0m6.685,5.8h0m.009.055h0M7.1,0H7.092a.5.5,0,0,0,0,1,5.968,5.968,0,0,1,.847.06.565.565,0,0,0,.071,0,.5.5,0,0,0,.071-1C7.993.057,7.905.046,7.817.037H7.793l-.014,0H7.1M9.778.583a.5.5,0,0,0-.207.954,6.038,6.038,0,0,1,.748.41.5.5,0,0,0,.688-.15.5.5,0,0,0-.149-.691c-.07-.044-.14-.088-.211-.13h0L10.633.968h0L10.62.96h0L10.607.952h0l-.006,0-.006,0h0l-.005,0h0l-.006,0,0,0,0,0h0l0,0h0l0,0h0l0,0,0,0h0l0,0h0l-.006,0h0l0,0h0l-.006,0h0l0,0h0l-.007,0h0l0,0-.009,0-.005,0c-.161-.091-.325-.174-.494-.252l-.012,0a.481.481,0,0,0-.2-.045m2.2,1.655a.5.5,0,0,0-.375.828,6.091,6.091,0,0,1,.512.684.5.5,0,0,0,.688.149.5.5,0,0,0,.15-.689c-.05-.078-.1-.154-.155-.23h0L12.8,2.971h0l0,0h0l-.006-.008,0,0h0l-.005-.007h0l0,0,0,0,0-.007h0l0,0v0l0-.006v0l0,0v0l0-.005v0l0,0v0l0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0-.005v0l0,0v0l0-.005h0l0,0,0,0,0,0v0l0,0v0l0,0h0l0,0h0l0-.006h0l0-.005v0l0-.005,0-.006h0l-.009-.011h0l-.009-.012h0l-.009-.011h0l-.009-.012h0L12.6,2.712h0L12.6,2.7c-.077-.1-.156-.195-.237-.289a.5.5,0,0,0-.377-.172m1.323,2.423a.484.484,0,0,0-.14.02.5.5,0,0,0-.338.62,5.956,5.956,0,0,1,.181.836.5.5,0,0,0,.492.429.552.552,0,0,0,.071-.005A.5.5,0,0,0,13.994,6l-.012-.084,0-.016V5.891l0-.015v0l0-.014v-.1l0-.007V5.709h0v-.03h0V5.67h0l0-.006v0l0-.014h0V5.639l0-.007V5.624h0l0-.007V5.609h0l0-.015h0l0-.014h0V5.57l0-.008V5.555h0l0-.014h0l0-.015V5.516l0-.007,0-.008,0-.015,0-.015h0c-.034-.152-.073-.3-.116-.45a.5.5,0,0,0-.478-.359m.2,2.756a.5.5,0,0,0-.492.43,6.053,6.053,0,0,1-.18.835.5.5,0,0,0,.338.62.48.48,0,0,0,.14.021.5.5,0,0,0,.478-.36q.027-.093.051-.186l0-.015h0l0-.006h0l0-.007h0l0-.006h0l0-.007h0V8.717h0V8.685l0-.005V8.652l0-.008h0V8.636l0-.013V8.616q.073-.31.119-.631a.5.5,0,0,0-.423-.563.578.578,0,0,0-.071-.005m-.96,2.588a.5.5,0,0,0-.419.229,6.1,6.1,0,0,1-.512.685.5.5,0,0,0,.05.7.5.5,0,0,0,.7-.05q.143-.165.274-.339h0l.009-.012.009-.012h0l.005-.006,0-.006h0l0,0h0l0-.005h0l.005-.006,0-.005v0l0-.005h0l0-.005h0l0-.006h0l0-.005v0l0-.005h0l0-.005,0,0,0-.005h0l0-.005v0l0-.005h0l0-.005v0l0,0v0l0-.005v0l0,0h0l0,0,0,0,0,0h0l0-.005,0,0,0,0v0l0,0,0,0,0,0h0l0-.006h0l0,0h0l0-.006h0l0-.005h0l0-.005v0l0-.005h0l0-.005h0l0-.005h0l0-.006h0l0-.005h0l0-.006,0-.006h0l.009-.012h0c.043-.062.085-.125.126-.188a.5.5,0,0,0-.15-.691.492.492,0,0,0-.269-.079m.12,1.2Z'
            transform='translate(1)'
            fill='#1b1e1f'
          />
          <path
            d='M6.979,14A7,7,0,0,1,4.778.36a.5.5,0,0,1,.313.948A6,6,0,1,0,9.956,12.2a.5.5,0,0,1,.5.864A6.932,6.932,0,0,1,6.979,14'
            transform='translate(1)'
            fill='#1b1e1f'
          />
        </g>
      </g>
    </svg>
  )
}

export default ClockLines
