import treeKill from 'tree-kill'

function closeProcess(args: object): void {
  console.log('args:', args)
  const argArray = Object.values(args)
  const pid = argArray[0] as number
  treeKill(pid, 'SIGTERM', (err: unknown) => {
    console.error('Error closing process:', err)
  })
  console.log('Process closed:', pid)
}

export { closeProcess }
