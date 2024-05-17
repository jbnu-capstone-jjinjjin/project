import * as path from 'path'

const nssmVersion = '2.24'
const nssmDir = path.resolve(process.cwd(), 'nssm', nssmVersion)
export const nssmPath = {
  win32: path.resolve(nssmDir, 'win32', 'nssm.exe'),
  win64: path.resolve(nssmDir, 'win64', 'nssm.exe'),
}
