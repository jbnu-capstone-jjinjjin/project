import React from 'react'
import ReactDOM from 'react-dom/client'
import { config } from 'dotenv'
import { SSEProvider } from 'react-hooks-sse'

import './index.css'
import App from './App'
import { registerStartupApplication } from './startup'

registerStartupApplication()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

async function renderApp() {
  const result = config()
  console.log('dotenv config result:', result)
  const REACT_APP_SSE_ENDPOINT = process.env.REACT_APP_SSE_ENDPOINT
  root.render(
    <SSEProvider endpoint={`${REACT_APP_SSE_ENDPOINT}`}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SSEProvider>
  )
}

renderApp()
