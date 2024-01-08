import { FC, SVGProps } from 'react'

const CloudUploadIcon: FC<SVGProps<SVGSVGElement>> = ({ ...svgProps }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' {...svgProps}>
      <path
        fill='#20607E'
        fillRule='evenodd'
        d='M18.424 15.424a3.5 3.5 0 0 0-2.746-6.327l-.693.166-.383-.6a5.75 5.75 0 1 0-9.16 6.896l-.708.708a6.75 6.75 0 1 1 10.711-8.142 4.5 4.5 0 0 1 3.698 8.018l-.719-.719zM11.5 13.707V20h1v-6.293l2.146 2.146.708-.707-3-3a.5.5 0 0 0-.707 0l-3 3 .707.707 2.146-2.146z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export default CloudUploadIcon
