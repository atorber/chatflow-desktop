import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import fs from 'fs'
import path from 'path'
import {
  downloadFile,
  extractFile
} from './update'

import { updateKubeconfig, getNamespacePods, getNamespacePytorchJobs, listNodes, createDeployment, createJob, createPytorchJob } from './kubectl.js'

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

console.log('__filename:', __filename)
console.log('__dirname:', __dirname)

const baseUrl = 'https://aihc-aiak-helper.bj.bcebos.com/shs/'
const configUrl = baseUrl + 'versions.json'

// 获取当前目录的根目录
let rootPath = app.getPath('exe');
console.log('rootPath:', rootPath)

// 如果是开发环境，则获取当前目录的根目录
if (rootPath.includes('electron.exe')) {
  rootPath = path.join(__dirname, '../..');
  console.log('rootPath:', rootPath)
} else {
  // 如果是生产环境，则去掉rootPath最后的文件名
  rootPath = path.dirname(rootPath);
}

const dataPath = app.getPath('userData')
console.log('dataPath:', dataPath)

// 定义数据目录的完整路径
const dataDir = path.join(dataPath, 'data');
console.log('dataDir:', dataDir)

// 检查数据目录是否存在，如果不存在则创建
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir);
    console.log('Data directory created successfully.');
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
} else {
  console.log('Data directory already exists.');
}

// 取得/data目录的读写权限
// app.setPath("userData", dataDir)

// 检测./data文件夹，如果不存在则创建
// 在程序安装目录下创建/data目录，用于存放配置文件、日志文件、数据库文件、媒体文件等
if (!fs.existsSync(join(dataPath, 'data/table'))) {
  fs.mkdirSync(join(dataPath, 'data/table'))
}
if (!fs.existsSync(join(dataPath, 'data/logs'))) {
  fs.mkdirSync(join(dataPath, 'data/logs'))
}
if (!fs.existsSync(join(dataPath, 'data/db'))) {
  fs.mkdirSync(join(dataPath, 'data/db'))
}
if (!fs.existsSync(join(dataPath, 'data/media'))) {
  fs.mkdirSync(join(dataPath, 'data/media'))
}
if (!fs.existsSync(join(dataPath, 'data/media/image'))) {
  fs.mkdirSync(join(dataPath, 'data/media/image'))
}
if (!fs.existsSync(join(dataPath, 'data/media/image/room'))) {
  fs.mkdirSync(join(dataPath, 'data/media/image/room'))
}
if (!fs.existsSync(join(dataPath, 'data/media/image/contact'))) {
  fs.mkdirSync(join(dataPath, 'data/media/image/contact'))
}
if (!fs.existsSync(join(dataPath, 'data/media/image/qrcode'))) {
  fs.mkdirSync(join(dataPath, 'data/media/image/qrcode'))
}

// 如果配置文件./config.json不存在，则创建一个
if (!fs.existsSync(join(dataPath, 'data/config.json'))) {
  console.log('config.json does not exist, creating one.');
  fs.writeFileSync(join(dataDir, 'config.json'), JSON.stringify({
    "username": "",
    "password": "",
    "endpoint": "http:chat.vlist.cc",
    "puppet": "wechaty-puppet-wechat4u",
    "token": "",
    "adminRoom": "",
  }, null, 2))
} else {
  console.log('config.json already exists.');
}

const getTime = () => {
  const timeutc = new Date().toLocaleString();
  return timeutc;
};

let wechatyIsOn = false;
let bot = null;
let result = "";
let botConfig: {
  username: string;
  password: string;
  endpoint: string;
  puppet: string;
  token: string;
  adminRoom: string;
} = {
  "username": "",
  "password": "",
  "endpoint": "",
  "puppet": "",
  "token": "",
  "adminRoom": "",
}

// 从配置文件congfig.json中读取配置信息
const readConfig = () => {
  try {
    const data = fs.readFileSync(join(dataDir, 'config.json'), 'utf8')
    // console.log('readConfig data:', data)
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.error('Error reading file from disk:', err)
    return {}
  }
}

// 更新配置文件congfig.json中的配置信息
const writeConfig = (config) => {
  try {
    const data = JSON.stringify(config, null, 2)
    fs.writeFileSync(join(dataDir, 'config.json'), data)
  } catch (err) {
    console.error('Error writing file:', err)
  }
}
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1366,
    height: 768,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  win.setMenuBarVisibility(false)

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // botConfig = readConfig();
  // console.log('botConfig:', botConfig)

  try {
    // 下载配置文件
    console.log('configUrl:', configUrl)
    await downloadFile(configUrl, join(dataDir, 'versions.json'))

    // 读取版本信息
    const versionsInfo = JSON.parse(fs.readFileSync(join(dataDir, 'versions.json'), 'utf8'))
    console.log('versionsInfo:', versionsInfo)


    const versions = versionsInfo.versions

    // 下载预置版本配置文件
    for (const version of versions) {
      const versionConfigUrl = `${baseUrl}${version}/examples.zip`
      console.log('versionConfigUrl:', versionConfigUrl)
      const savePath = join(dataDir, version + '.zip')
      await downloadFile(versionConfigUrl, savePath)
      await extractFile(savePath, join(dataDir, version))
    }
    send2web('getPreinstallVersions', versions)
  } catch (error) {
    console.error('Error downloading file:', error)
    send2web('initError', [])
  }

  win.on('closed', () => {
    win = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.on("createTraining", async (event, data) => {
  console.log('createTraining on:', data)

  const payload = JSON.parse(data)
  const method = payload.method
  const params: any = payload.params

  switch (method) {
    case 'getPreinstallVersions':
      send2web(method, getPreinstallVersions())
      break
    case 'getCustomVersions': {
      const filePath = params
      send2web(method, getCustomVersions(filePath))
      // 获取filePath所在的目录路径
      const examplesPath = filePath.indexOf('version.txt') ? path.dirname(filePath) : filePath
      send2web('listFiles', listFiles(examplesPath))
      break
    }
    case 'listFiles':
      const version = params
      const examplesPath = version.indexOf('examples') > 0 ? path.dirname(version) : path.join(dataDir, version, 'examples')
      console.log('examplesPath:', examplesPath)
      send2web('listFiles', listFiles(examplesPath))
    // 更新kubeconfig
    case 'updateKubeconfig': {
      const res = await updateKubeconfig(params)
      if (res) {
        send2web('updateKubeconfig', res)
      } else {
        send2web('updateKubeconfig', 'updateKubeconfig failed')
      }
      break
    }
    case 'getNamespacePods': {
      const res = await getNamespacePods()
      send2web('getNamespacePods', res)
      break
    }
    case 'listNodes': {
      const res = await listNodes()
      send2web('listNodes', res)
      break
    }
    case 'createDeployment': {
      const res = await createDeployment(params)
      send2web('createDeployment', res)
      break
    }
    case 'createJob': {
      const res = await createJob(params)
      send2web('createJob', res)
      break
    }
    case 'k8s': {
      // const res = await updateKubeconfig('/Users/luyuchao/Documents/GitHub/electron-vite-vue/electron/main/kubectl-hwl.conf')

      // if (res) {
      //   send2web('updateKubeconfig', res)
      // } else {
      //   send2web('updateKubeconfig', 'updateKubeconfig failed')
      // }

      if (params.action === '创建PytorchJob') {
        const res1 = await createPytorchJob(params.command)
        send2web('k8s', res1)
      } else if (params.action === '创建Job') {
        const res1 = await createJob(params.command)
        send2web('k8s', res1)

      } else if (params.action === '创建Deployment') {
        const res1 = await createDeployment(params.command)
        send2web('k8s', res1)
      } else if (params.action === '获取节点列表') {
        const res1 = await listNodes()
        send2web('k8s', res1)
      } else if (params.action === '获取PytorchJob列表') {
        const res1 = await getNamespacePytorchJobs()
        send2web('k8s', res1)
      } else {
        send2web('k8s', 'action failed')
      }

      break
    }
    default:
      break
  }
});

const send2web = (method, params) => {
  win.webContents.send("send2web", JSON.stringify({ method, params }));
}
// 获取自定义版本
function getCustomVersions(filePath: string) {
  const text = fs.readFileSync(filePath, 'utf8')
  let versions = []
  if (text) {
    // version=2.2.1.1
    versions = [text.replace('version=', '')]
  }
  return versions
}

// 获取预置版本列表
function getPreinstallVersions() {
  const versionsPath = path.join(dataDir, 'versions.json')
  const text = fs.readFileSync(versionsPath, 'utf8')
  const versions: string[] = JSON.parse(text).versions
  return versions
}

// 列出文件下所有的文件，按层级展示为JSON格式，最后一层为文件的文本内容
function listFiles(filePath: string) {

  const files = fs.readdirSync(filePath);
  const result = {}
  files.forEach((file) => {
    const stats = fs.statSync(path.join
      (filePath, file));
    if (stats.isDirectory()) {
      result[file] = listFiles(path.join(filePath, file));
    } else {
      if (!file.startsWith('.')) {
        result[file] = fs.readFileSync(path.join(filePath, file), 'utf-8');
      }
    }
  });
  return result;
}

// 寻找指定目录及其子目录下的examples目录，当找到第一个examples目录时返回并结束查找
function findExamplesPath(dirPath: string): string | undefined {
  if (dirPath.endsWith("examples")) {
    return dirPath;
  }
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file === "examples") {
        return filePath;
      } else {
        findExamplesPath(filePath);
        const result: string | undefined = findExamplesPath(filePath);
        if (result) {
          return result;
        }
      }
    }
  }
}

// 读取路径下文件夹列表
function loadFolderList(filePath: string) {
  const files = fs.readdirSync(filePath);
  return files.filter((file) => {
    return fs.statSync(path.join(filePath, file)).isDirectory();
  });
}

// 读取路径下文件列表
function loadFileList(path: string) {
  const files = fs.readdirSync(path);
  return files;
}

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
