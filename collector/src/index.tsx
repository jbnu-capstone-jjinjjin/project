import React from 'react'
import ReactDOM from 'react-dom/client'
import { SSEProvider } from 'react-hooks-sse'
import { config } from 'dotenv'

import './index.css'
import App from './App'
import { registerStartupApplication } from './startup'

registerStartupApplication()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const result = config()
console.log('dotenv config result:', result)
const RECAT_APP_API_URL = process.env.REACT_APP_API_URL

async function renderApp() {
  root.render(
    <React.StrictMode>
      <SSEProvider endpoint={`${RECAT_APP_API_URL}/daemon/connect`}>
        <App />
      </SSEProvider>
    </React.StrictMode>
  )
}

renderApp()
