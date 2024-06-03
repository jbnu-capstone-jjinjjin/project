import treeKill from 'tree-kill'

export function closeProcesses(args: object): void {
  console.log('args:', args)
  const argArray = Object.values(args)
  const pids = argArray as number[]

  pids.forEach(pid => {
    treeKill(pid, 'SIGTERM', (err: unknown) => {
      if (err) {
        console.error(`Error closing process ${pid}:`, err)
      } else {
        console.log(`Process closed: ${pid}`)
      }
    })
  })
}
