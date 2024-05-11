import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{ colorScheme: 'light' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
)
