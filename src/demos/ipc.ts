
window.ipcRenderer.on('main-process-message', (_event: any, ...args: any) => {
  console.log('[Receive Main-process message]:', ...args)
})
