import { exec } from 'child_process'
import path from 'path'

import axios from 'axios'
import FormData from 'form-data'

import { publicPath } from './consts'
import { serverId } from './serverIdSetup'
import { config } from './getConfig'

const SCREENSHOT_ENDPOINT = `${config.API_BASE_URL}/screenshot`

function takeScreenshot() {
  return new Promise<void>((resolve, reject) => {
    exec(`${publicPath}/getScreenshot.exe`, (error) => {
      if (error) {
        console.error(`Error executing getScreenshot.exe: ${error}`)
        reject(error)
        return
      }

      console.log('getScreenshot.exe executed successfully')
      resolve()
    })
  })
}

async function uploadScreenshot() {
  try {
    const screenshot = await fetch(`${publicPath}/screenshot.png`)
    const blob = await screenshot.blob()

    const form = new FormData()
    form.append('imageData', blob, {
      filepath: path.resolve(`${publicPath}/screenshot.png`),
      contentType: 'image/png',
    })
    form.append('machineId', serverId)
    form.append('createdAt', new Date().toISOString())
    form.append('imageName', 'screenshot.png')

    const response = await axios.post(`${SCREENSHOT_ENDPOINT}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Screenshot uploaded successfully:', response.data)
  } catch (error) {
    console.error('Error uploading screenshot:', error)
  }
}

function takeAndUploadScreenshot() {
  takeScreenshot().then(() => {
    uploadScreenshot()
  }).catch((error) => {
    console.error('Error taking and uploading screenshot:', error)
  })
}

export { takeAndUploadScreenshot }
