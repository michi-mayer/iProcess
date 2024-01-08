import { FC, SVGProps } from 'react'
import { IconButton, Typography } from '@mui/material'

interface Props extends SVGProps<SVGSVGElement> {
  showLogo: boolean
  color?: string
  onClickLogo?: () => void
}

const Logo: FC<Props> = ({ showLogo, onClickLogo, color = '#fff', height = '24px', width = '24px', ...svgProps }) => {
  return (
    <IconButton onClick={onClickLogo} size='medium'>
      {showLogo && (
        <svg width={width} height={height} viewBox='0 0 24 24' {...svgProps}>
          <defs>
            <clipPath id='clip-path'>
              <rect id='Rectangle_1693' data-name='Rectangle 1693' width='24' height='22.295' fill='none' />
            </clipPath>
            <clipPath id='clip-LOGO'>
              <rect width='24' height='24' />
            </clipPath>
          </defs>
          <g id='LOGO' clipPath='url(#clip-LOGO)'>
            <g id='Logo-2' data-name='Logo' transform='translate(0 1.001)'>
              <g id='Group_1027' data-name='Group 1027' clipPath='url(#clip-path)'>
                <path
                  id='Path_2169'
                  data-name='Path 2169'
                  d='M4.653,18.636a1.964,1.964,0,1,1,.719,2.684,1.964,1.964,0,0,1-.719-2.684'
                  transform='translate(0.136 0.549)'
                  fill={color}
                />
                <path
                  id='Path_2170'
                  data-name='Path 2170'
                  d='M1.473,9.7A1.473,1.473,0,1,1,0,11.173,1.474,1.474,0,0,1,1.473,9.7'
                  transform='translate(0 0.302)'
                  fill={color}
                />
                <path
                  id='Path_2171'
                  data-name='Path 2171'
                  d='M7.321,2.162a1.145,1.145,0,1,1-1.564-.42,1.145,1.145,0,0,1,1.564.42'
                  transform='translate(0.161 0.05)'
                  fill={color}
                />
                <path
                  id='Path_2172'
                  data-name='Path 2172'
                  d='M18.523,4.176A2.784,2.784,0,1,1,17.5.373a2.784,2.784,0,0,1,1.019,3.8'
                  transform='translate(0.414 0)'
                  fill={color}
                />
                <path
                  id='Path_2173'
                  data-name='Path 2173'
                  d='M20.969,13.66A2.457,2.457,0,1,1,23.425,11.2a2.456,2.456,0,0,1-2.456,2.456'
                  transform='translate(0.575 0.272)'
                  fill={color}
                />
                <path
                  id='Path_2174'
                  data-name='Path 2174'
                  d='M14.25,20.686a2.128,2.128,0,1,1,2.908.779,2.128,2.128,0,0,1-2.908-.779'
                  transform='translate(0.434 0.544)'
                  fill={color}
                />
                <path
                  id='Path_2175'
                  data-name='Path 2175'
                  d='M13.719,8.093a.839.839,0,1,1-.307-1.147.839.839,0,0,1,.307,1.147'
                  transform='translate(0.377 0.213)'
                  fill={color}
                />
                <path
                  id='Path_2176'
                  data-name='Path 2176'
                  d='M15.065,11.9a.629.629,0,1,1,.629-.629.629.629,0,0,1-.629.629'
                  transform='translate(0.448 0.331)'
                  fill={color}
                />
                <path
                  id='Path_2177'
                  data-name='Path 2177'
                  d='M12.559,15.108a.489.489,0,1,1,.668.179.487.487,0,0,1-.668-.179'
                  transform='translate(0.388 0.447)'
                  fill={color}
                />
                <path
                  id='Path_2178'
                  data-name='Path 2178'
                  d='M7.817,14.29a1.188,1.188,0,1,1,.434,1.624,1.186,1.186,0,0,1-.434-1.624'
                  transform='translate(0.238 0.426)'
                  fill={color}
                />
                <path
                  id='Path_2179'
                  data-name='Path 2179'
                  d='M6.764,10.231a1.049,1.049,0,1,1-1.05,1.05,1.05,1.05,0,0,1,1.05-1.05'
                  transform='translate(0.177 0.318)'
                  fill={color}
                />
                <path
                  id='Path_2180'
                  data-name='Path 2180'
                  d='M9.624,7.221a.909.909,0,1,1-1.241-.333.909.909,0,0,1,1.241.333'
                  transform='translate(0.246 0.21)'
                  fill={color}
                />
              </g>
            </g>
          </g>
        </svg>
      )}
      <Typography variant='h2' color='white' style={{ marginLeft: showLogo ? '1rem' : undefined }}>
        i.Process
      </Typography>
    </IconButton>
  )
}

export default Logo
