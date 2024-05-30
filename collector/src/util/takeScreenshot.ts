import fs from 'fs'
import path from 'path'

import FormData from 'form-data'
import axios from 'axios'
import screenshot from 'screenshot-desktop'

import { publicPath } from './consts'
import { serverId } from './serverIdSetup'

// 스크린샷을 찍고 저장할 파일 경로
const screenshotFilePath = path.join(publicPath, `ScreenShot-${serverId}.png`)

// 스크린샷을 찍는 함수
async function takeScreenshot(): Promise<void> {
  try {
    screenshot({ filename: screenshotFilePath })
  } catch (err) {
    console.error('Error taking screenshot:', err)
  }
}

// 스크린샷을 서버로 전송하는 함수
async function uploadScreenshot(): Promise<void> {
  const form = new FormData()
  form.append('imageData', fs.createReadStream(screenshotFilePath))
  form.append('machineId', serverId)
  form.append('createdAt', new Date().toISOString())
  form.append('imageName', `ScreenShot-${serverId}.png`)

  try {
    const response = await axios.post('http://localhost:8080/screenshot', form, {
      headers: {
        ...form.getHeaders(),
      },
    })
    console.log('Screenshot uploaded successfully:', response.data)
  } catch (err) {
    console.error('Error uploading screenshot:', err)
  }
}

// 메인 함수
async function takeAndUploadScreenshot(): Promise<void> {
  await takeScreenshot()
  await uploadScreenshot()
}

export { takeAndUploadScreenshot }
