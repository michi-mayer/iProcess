import type { Theme } from '@aws-amplify/ui-react'
import { createTheme } from '@mui/material/styles'

export const colors = {
  babyblue: '#80B0C8',
  black: '#1B1E1F',
  blue: '#20607E',
  bluegray: '#EBEFF2',
  blue200Tertiary: '#C6DFE7',
  blueOpacity: 'rgba(32, 96, 126, 0.2)',
  blueLightOpacity: 'rgba(32, 96, 126, 0.1)',
  darkBlue: '#00354D',
  disabled: '#799FB1',
  gray1: '#4C5356',
  gray2: '#A8ADB3',
  gray3: '#CACDD2',
  gray4: '#F8F9FA',
  gray5: '#F0F1F2',
  lightGray: '#DFE2E5',
  green: '#46752F',
  greenTag: '#558F34',
  greenSuccess: '#67B210',
  red: '#800712',
  signalRed900: '#A60918',
  redError: '#DA0C1F',
  white: '#FFFFFF',
  orange: '#FF9B00'
} as const

export type Color = (typeof colors)[keyof typeof colors]

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 321,
      sm: 561,
      md: 961,
      lg: 1281, // 1280px is the max width of the tablet VW is using
      xl: 1620
    }
  },
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.bluegray
    }
  },
  typography: {
    fontFamily: 'VWAGTheSans, Roboto, sans-serif',
    body1: {
      fontWeight: 'normal',
      fontSize: '1rem',
      color: colors.black,
      fontStyle: 'normal'
    },
    body2: {
      fontWeight: 'normal',
      fontSize: '0.875rem',
      color: colors.black,
      fontStyle: 'normal'
    },
    h1: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: colors.black
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      color: colors.black
    },
    h3: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: colors.blue,
      fontStyle: 'normal'
    },
    h4: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: colors.black,
      fontStyle: 'normal'
    },
    h5: {
      fontWeight: 'normal',
      fontSize: '0.625rem',
      color: colors.gray1,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontStyle: 'normal'
    },
    subtitle1: {
      fontWeight: 'bold',
      fontSize: '0.875rem',
      color: colors.gray1
    },
    subtitle2: {
      fontWeight: 'normal',
      fontSize: '0.75rem',
      color: colors.redError
    },
    caption: {
      fontWeight: 'normal',
      fontSize: '0.75rem',
      color: colors.gray1
    },
    button: {
      fontSize: '1rem',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textTransform: 'unset'
    },
    overline: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: colors.black,
      fontStyle: 'normal',
      textTransform: 'unset'
    }
  },
  transitions: {
    easing: {
      // This is the most common easing curve.
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Objects enter the screen at full velocity from off-screen and
      // slowly decelerate to a resting point.
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      // Objects leave the screen at full velocity. They do not decelerate when off-screen.
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      // The sharp curve is used by objects that may return to the screen at any time.
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  }
})

export const amplifyUiTheme: Theme = {
  name: 'amplifyUiTheme',
  tokens: {
    components: {
      heading: {
        color: { value: theme.typography.h1.color as string },
        3: {
          fontSize: {
            value: theme.typography.h1.fontSize as string
          },
          fontWeight: {
            value: theme.typography.h1.fontWeight as string
          }
        }
      },
      button: {
        fontSize: {
          value: theme.typography.button.fontSize as string
        },
        primary: {
          backgroundColor: {
            // --amplify-components-button-primary-background-color
            value: colors.blue
          }
        }
      }
    },
    colors: {
      background: {
        // --amplify-colors-background-primary
        primary: { value: colors.white }
      },
      font: {
        primary: { value: colors.blue },
        secondary: { value: colors.bluegray }
      }
    }
  }
}
