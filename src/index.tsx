import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from '@aws-amplify/core'
import * as GroupUIButton from '@group-ui/group-ui-react/node_modules/@group-ui/group-ui/dist/components/groupui-button'
import * as GroupUIRadioButton from '@group-ui/group-ui-react/node_modules/@group-ui/group-ui/dist/components/groupui-radio-button'
import * as GroupUIRadioForm from '@group-ui/group-ui-react/node_modules/@group-ui/group-ui/dist/components/groupui-radio-group'
import { setMode } from '@group-ui/group-ui-react/node_modules/@stencil/core'
import type { Environment } from 'types'
import App from './App'
import awsExports from './aws-exports'
import reportWebVitals from './reportWebVitals'
import '@group-ui/group-ui-react/node_modules/@group-ui/group-ui/dist/group-ui/assets/themes/vwag/vwag.css'
import './index.css'

Amplify.configure(awsExports)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv extends Environment {
      NODE_ENV: 'development' | 'production'
      DEBUG: string
    }
  }
}

setMode(() => 'vwag')
GroupUIButton.defineCustomElement()
GroupUIRadioButton.defineCustomElement()
GroupUIRadioForm.defineCustomElement()

const rootContainer = document.querySelector('#root')
if (rootContainer === null) throw new Error('Root container missing in index.html')
const root = createRoot(rootContainer)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
