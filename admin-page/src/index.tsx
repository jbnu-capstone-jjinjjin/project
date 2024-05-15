import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'

import App from './App'

import '@mantine/core/styles/global.css'
import '@mantine/core/styles/UnstyledButton.css'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Popover.css'
import '@mantine/core/styles/Group.css'
import '@mantine/core/styles/Input.css'
import '@mantine/core/styles/Paper.css'
import '@mantine/dates/styles.css'
import '@mantine/core/styles/CloseButton.css'
import '@mantine/core/styles/Table.css'
import '@mantine/core/styles/Tabs.css'
import '@mantine/core/styles/Text.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
)
