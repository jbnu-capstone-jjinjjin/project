import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

import sudo from 'sudo-prompt'

import { nssmPath, startBatPath } from './consts'
import { nodeLogger } from './log'

const serviceName = 'Collector'

function getNssmPath(): string {
  const arch = os.arch()
  return arch === 'x64' ? nssmPath.win64 : nssmPath.win32
}

function runElevatedCommand(command: string): void {
  const options = {
    name: 'Collector Service',
  }

  sudo.exec(command, options, (error, stdout, stderr) => {
    if (error) {
      const err = error as Error
      nodeLogger.error(`Failed to run elevated command: ${err.message}`)
      throw new Error(`Failed to run elevated command: ${err.message}`)
    }
    nodeLogger.info('Elevated command executed successfully')
    console.log(stdout)
    console.error(stderr)
  })
}

export function checkAndRegisterService(): void {
  const execPath = startBatPath
  const execDir = path.dirname(execPath)
  const nssm = getNssmPath()
  const batchScriptPath = path.join(os.tmpdir(), 'register_service.bat')

  const batchScript = `
@echo off
setlocal
set nssm="${nssm}"
set serviceName=${serviceName}
%nssm% status %serviceName% | find "SERVICE_RUNNING" > nul
if %errorlevel% equ 0 (
  echo Service is already running.
  exit /b 0
)
%nssm% status %serviceName% | find "SERVICE_STOPPED" > nul
if %errorlevel% equ 0 (
  echo Service is already installed but stopped.
  %nssm% start %serviceName%
  exit /b 0
)
echo Registering service...
%nssm% install %serviceName% ${execPath}
%nssm% set %serviceName% AppDirectory ${execDir}
%nssm% set %serviceName% ObjectName LocalSystem
%nssm% set %serviceName% Type SERVICE_INTERACTIVE_PROCESS
%nssm% start %serviceName%
endlocal
  `

  fs.writeFileSync(batchScriptPath, batchScript.trim())
  nodeLogger.info(`Running batch script to register service: ${batchScriptPath}`)

  runElevatedCommand(batchScriptPath)
  nodeLogger.info(`Service checked and registered if necessary: ${serviceName}`)
}
