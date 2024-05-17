import fs from 'fs'

(async () => {
  console.log('initializing services')
  fs.writeFileSync('output.log', 'hello world')
  // await checkService()
  // await registerService()
})()

export { }
