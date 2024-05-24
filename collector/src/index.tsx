import React from 'react'
import ReactDOM from 'react-dom/client'
import { config } from 'dotenv'

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
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

renderApp()
