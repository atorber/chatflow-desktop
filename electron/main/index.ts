import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  WechatyBuilder, ScanStatus,
} from 'wechaty'

import qrcodeTerminal from "qrcode-terminal";
import { FileBox } from "file-box";

import {
  ChatFlow,
  ChatFlowOptions,
  getBotOps,
  logForm,
  init,
  log,
} from '@atorber/chatflow'

import fs from 'fs'
import path from 'path'

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { fork } from 'child_process';

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

console.log('__filename:', __filename)
console.log('__dirname:', __dirname)

let nestProcess: any = null;

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
    "endpoint": "http://chat.vlist.cc",
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

async function onScan(qrcode, status) {
  log.info("StarterBot", "onScan: %s(%s)", ScanStatus[status], status);
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");
    log.info(
      "StarterBot",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );

    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
    result = `${getTime()}:登录二维码地址 ${qrcodeImageUrl}\n` + result;
    win.webContents.send("action-result", result);
    // win.webContents.send("qrcode-result", qrcodeImageUrl);
    let file: FileBox = null;
    let filePath = "";
    try {
      file = FileBox.fromQRCode(qrcode);
      // filePath = join(rootPath, "data/", file.name) ;
      // log.info("StarterBot", "onScan: %s", filePath);
      const base64 = await file.toBase64();
      filePath = `data:image/png;base64,${base64}`;
      // win.webContents.send("qrcode-result", '../../data/' + file.name);
      win.webContents.send("qrcode-result", filePath);
    } catch (e) {
      result = `${getTime()}:二维码显示失败：${filePath}\n` + result;
      log.error("二维码显示失败：", e);
      win.webContents.send("action-result", result);
    }
  } else {
    log.info("StarterBot", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

async function onLogin(user) {
  log.info("onLogin", "%s login", user);
  result = `${getTime()}:${user} login\n` + result;
  win.webContents.send("action-result", result);

  const roomList = await bot.Room.findAll();
  console.info("room count:", roomList.length);
  const contactList = await bot.Contact.findAll();
  console.info("contact count:", contactList.length);
  result =
    `${getTime()}:contact count: ${contactList.length},room count: ${roomList.length
    }\n` + result;
  win.webContents.send("action-result", result);
  win.webContents.send("qrcode-result", '');
}

async function onMessage(message) {
  log.info("onMessage", JSON.stringify(message));

  const text = message.text();
  const room = message.room();
  const talker = message.talker();
  // 生成2024-1-28 21:51:06格式的时间
  const timeutc = new Date().toLocaleString();
  result =
    `${timeutc} ${room ? "[" + (await room.topic()) + "]" : ""
    } ${talker.name()}: ${text}\n` + result;
  win.webContents.send("action-result", result);
  // 1. send Image
  if (/^ding$/i.test(message.text())) {
    const fileBox = FileBox.fromUrl(
      "https://wechaty.github.io/wechaty/images/bot-qr-code.png"
    );
    await message.say(fileBox);
  }

  // 2. send Text

  if (/^dong$/i.test(message.text())) {
    await message.say("dingdingding");
  }
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
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
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  win.webContents.send('main-process-message', new Date().toLocaleString())
  botConfig = readConfig();
  console.log('botConfig:', botConfig)
  win.webContents.send("action-result", JSON.stringify(botConfig, undefined, 2));
  win.webContents.send('init', JSON.stringify(botConfig, undefined, 2));
  win.on('closed', () => {
    win = null
  })

  // 打开开发者工具
  win.webContents.openDevTools();
}

async function bootstrap() {
  const appNest = await NestFactory.create(AppModule);
  appNest.enableCors({ origin: '*', credentials: true });
  const port = process.env.PORT || 9503;
  await appNest.listen(port);
  console.log(`NestJS is running on http://localhost:${port}`);
}

// app.whenReady().then(createWindow)
app.whenReady().then(async () => {
  // 启动 NestJS 后端
  const mainfile = path.join(__dirname, '/backend/dist/src/main.js');
  // const mainfile = path.join(rootPath, 'electron/backend/dist/src/main.js');
  console.log('mainfile:', mainfile)
  nestProcess = fork(mainfile)
  // bootstrap();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  if (nestProcess) {
    nestProcess.kill();
  }
});

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

ipcMain.on("get-config", () => {
  win.webContents.send("init", JSON.stringify(botConfig, undefined, 2));
  // 设置环境变量
  process.env.VIKA_SPACE_ID = botConfig.username
  process.env.VIKA_TOKEN = botConfig.password
  process.env.WECHATY_TOKEN = botConfig.token
  process.env.WECHATY_PUPPET = botConfig.puppet
  process.env.ADMINROOM_ADMINROOMTOPIC = botConfig.adminRoom
  process.env.ENDPOINT = botConfig.endpoint
});

// 优化后的 startBot 函数
const startBot = async () => {
  if (wechatyIsOn) {
    result = `${getTime()}:正在停止当前Bot以启动新的实例...\n` + result;
    win.webContents.send("action-result", result);
    await stopBot(); // 先停止现有的Bot
  }

  // 从配置文件中读取最新的配置信息
  botConfig = readConfig();
  console.log('botConfig:', botConfig);

  // 设置环境变量
  process.env.VIKA_SPACE_ID = botConfig.username;
  process.env.VIKA_TOKEN = botConfig.password;
  process.env.WECHATY_TOKEN = botConfig.token;
  process.env.WECHATY_PUPPET = botConfig.puppet;
  process.env.ADMINROOM_ADMINROOMTOPIC = botConfig.adminRoom;
  process.env.ENDPOINT = botConfig.endpoint;

  // 从环境变量中获取配置信息
  const WECHATY_PUPPET = process.env.WECHATY_PUPPET;
  const WECHATY_TOKEN = process.env.WECHATY_TOKEN;
  const VIKA_SPACE_ID = process.env.VIKA_SPACE_ID;
  const VIKA_TOKEN = process.env.VIKA_TOKEN;
  const ADMINROOM_ADMINROOMTOPIC = process.env.ADMINROOM_ADMINROOMTOPIC;
  const endpoint = process.env.ENDPOINT;

  const chatFlowOps = {
    spaceId: VIKA_SPACE_ID,
    token: VIKA_TOKEN,
    adminRoomTopic: ADMINROOM_ADMINROOMTOPIC,
    endpoint,
    dataDir: dataPath,
  };

  console.log('chatFlowOps:', chatFlowOps);

  // 构建wechaty机器人
  const ops = getBotOps(WECHATY_PUPPET, WECHATY_TOKEN);
  bot = WechatyBuilder.build(ops);

  // 初始化检查数据库表，如果不存在则创建
  try {
    await init(chatFlowOps);
  } catch (e) {
    logForm('初始化检查失败：' + JSON.stringify(e));
  }

  // 启用ChatFlow插件
  bot.use(ChatFlow(chatFlowOps));

  // 绑定事件
  bot.on("login", onLogin);
  bot.on("message", onMessage);
  bot.on("scan", onScan);

  // 启动Bot
  try {
    await bot.start();
    wechatyIsOn = true;
    win.webContents.send("wechatyIsOn-result", wechatyIsOn);
    result = `${getTime()}:Bot已启动！\n` + result;
    win.webContents.send("action-result", result);
    log.info("StarterBot", "Starter Bot Started.");
  } catch (err) {
    console.error("bot start error", err);
    wechatyIsOn = false;
    win.webContents.send("wechatyIsOn-result", wechatyIsOn);
    result = `${getTime()}:启动Bot时发生错误...${err}\n` + result;
    win.webContents.send("action-result", result);
  }
};

// 优化后的 stopBot 函数
const stopBot = async () => {
  if (wechatyIsOn && bot) {
    try {
      // await bot.stop();
      wechatyIsOn = false;
      bot = null;
      win.webContents.send("wechatyIsOn-result", wechatyIsOn);
      const timeutc = getTime();
      result = `${timeutc}:Bot已停止...\n` + result;
      win.webContents.send("action-result", result);
      log.info("StarterBot", "Bot 已停止.");
    } catch (err) {
      console.error("bot stop error", err);
      const timeutc = getTime();
      result = `${timeutc}:Bot停止时发生错误...${err}\n` + result;
      win.webContents.send("action-result", result);
    }
  } else {
    const timeutc = getTime();
    result = `${timeutc}:Bot未在运行...\n` + result;
    win.webContents.send("action-result", result);
  }
};

// 优化后的 IPC 事件处理器
ipcMain.on("start-bot", async () => {
  try {
    console.log('start-bot...');
    await startBot(); // 直接调用优化后的 startBot
    result = `${getTime()}:ChatFlow启动中...\n` + result;
    win.webContents.send("action-result", result);
  } catch (e) {
    console.error("start-bot error", e);
    result = `${getTime()}:ChatFlow启动失败：${e}\n` + result;
    win.webContents.send("action-result", result);
  }
});

ipcMain.on("stop-bot", async () => { // 修改为 async
  const timeutc = getTime();
  if (wechatyIsOn && bot) {
    try {
      await stopBot(); // 调用优化后的 stopBot
    } catch (e) {
      console.error("stop-bot error", e);
      result = `${timeutc}:停止Bot时发生错误...${e}\n` + result;
      win.webContents.send("action-result", result);
    }
  } else {
    result = `${timeutc}:Bot未在运行...\n` + result;
    win.webContents.send("action-result", result);
  }
});

ipcMain.on("start-test", (event, data) => {
  log.info("start-test", JSON.stringify(event));
  log.info("start-test", data);
  data = JSON.parse(data);
  botConfig.username = data.username;
  botConfig.password = data.password;
  botConfig.endpoint = data.endpoint;
  botConfig.puppet = data.puppet;
  botConfig.token = data.token;
  botConfig.adminRoom = data.adminRoom;
  writeConfig(botConfig);
  const timeutc = getTime();
  result = `${timeutc}:配置信息...\n${JSON.stringify(botConfig, undefined, 2)}\n` + result;
  win.webContents.send("action-result", result);
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    title: 'Main window',
    width: 1366,
    height: 768,
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
