import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execSync } from 'child_process'

import sudo from 'sudo-prompt'

import { collectorDirPath, nssmPath, startBatPath } from './consts'
import { nodeLogger } from './log'

const serviceName = 'Collector'
const lockFilePath = path.join(collectorDirPath, `${serviceName}.lock`)

export class ServiceManager {
  static getNssmPath(): string {
    nodeLogger.debug('Determining NSSM path based on system architecture')
    const arch = os.arch()
    const nssmPath2 = arch === 'x64' ? nssmPath.win64 : nssmPath.win32
    nodeLogger.debug(`NSSM path: ${nssmPath2}`)
    return nssmPath2
  }

  static isServiceRunning(): boolean {
    try {
      const nssm = this.getNssmPath()
      nodeLogger.debug(`Checking if service is running with command: ${nssm} status ${serviceName}`)
      const output = execSync(`${nssm} status ${serviceName}`, { encoding: 'utf-8' }).toString()
      nodeLogger.info(`Service status: ${output}`)
      return output.includes('SERVICE_RUNNING') || output.includes('SERVICE_STOPPED')
    } catch (error) {
      nodeLogger.debug('Service is not running or failed to check status')
      return false
    }
  }

  static createLockFile(): void {
    nodeLogger.info(`Creating lock file to indicate service registration. Path: ${lockFilePath}`)
    if (!fs.existsSync(lockFilePath)) {
      fs.writeFileSync(lockFilePath, 'lock', { flag: 'w' })
      nodeLogger.debug('Lock file created successfully')
    } else {
      nodeLogger.debug('Lock file already exists')
    }
  }

  static removeLockFile(): void {
    nodeLogger.debug('Attempting to remove lock file')
    if (fs.existsSync(lockFilePath)) {
      fs.unlinkSync(lockFilePath)
      nodeLogger.debug('Lock file removed successfully')
    } else {
      nodeLogger.debug('Lock file does not exist')
    }
  }

  static runElevatedCommand(command: string): void {
    const options = {
      name: 'Collector Service',
    }

    nodeLogger.debug(`Executing elevated command: ${command}`)
    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        const err = error as Error
        nodeLogger.error(`Failed to run elevated command: ${err.message}`)
        throw new Error(`Failed to run elevated command: ${err.message}`)
      }
      nodeLogger.info('Elevated command executed successfully')
      if (stdout) {
        nodeLogger.info(`Standard Output: ${stdout}`)
      }
      if (stderr) {
        nodeLogger.error(`Standard Error: ${stderr}`)
      }
    })
  }

  static checkAndRegisterService(): boolean {
    if (fs.existsSync(lockFilePath)) {
      nodeLogger.info('Service is already registered as indicated by the lock file.')
      return false
    }

    try {
      nodeLogger.info(`Checking service status: ${serviceName}`)

      if (this.isServiceRunning()) {
        nodeLogger.info(`Service already registered: ${serviceName}`)
        this.createLockFile()
        return false
      }

      const execPath = startBatPath
      const execDir = path.dirname(execPath)
      const nssm = this.getNssmPath()
      const batchScriptPath = path.join(os.tmpdir(), 'register_service.bat')

      const batchScript = `
@echo off
setlocal
set nssm="${nssm}"
set serviceName=${serviceName}
%nssm% status %serviceName% | find "SERVICE_RUNNING" > nul
if %errorlevel% equ 0 (
  echo Service is already running. Attempting to remove...
  %nssm% stop %serviceName%
  %nssm% remove %serviceName% confirm
)
%nssm% status %serviceName% | find "SERVICE_STOPPED" > nul
if %errorlevel% equ 0 (
  echo Service is already installed but stopped. Attempting to remove...
  %nssm% remove %serviceName% confirm
)
echo Registering service...
%nssm% install %serviceName% ${execPath}
%nssm% set %serviceName% AppDirectory ${execDir}
%nssm% start %serviceName%
endlocal      
      `

      fs.writeFileSync(batchScriptPath, batchScript.trim())
      nodeLogger.info(`Running batch script to register service: ${batchScriptPath}`)
      nodeLogger.debug(`Batch script content: ${batchScript}`)

      this.runElevatedCommand(batchScriptPath)
      nodeLogger.info(`Service checked and registered if necessary: ${serviceName}`)

      this.createLockFile()
    } catch (error) {
      const err = error as Error
      nodeLogger.error(`Failed to register service: ${err.message}`)
      throw err
    }

    return true
  }
}
