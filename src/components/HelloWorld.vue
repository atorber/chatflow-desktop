<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

// const count = ref(0);
const testMsg = ref("...");
const errorInfo = ref("");
const isReady = ref(false);
const qrUrl = ref("");
const info = ref({
  username: "",
  password: "",
  endpoint: "https://chat.vlist.cc",
  puppet: "wechaty-puppet-wechat4u",
  token: "",
  adminRoom: "",
});
const startBot = () => {
  // 如果info齐全，调用electron中的start-bot
  if (!isReady.value) {
    errorInfo.value = "请填写完整信息";
    return;
  } else {
    window.ipcRenderer.send("start-bot");
  }
};

const getConfig = () => {
    window.ipcRenderer.send("get-config")
};

window.ipcRenderer.on("action-result", (_event: any, ...args: string[]) => {
  console.log("[Receive action-result]:", ...args);
  testMsg.value = args[0];
});

window.ipcRenderer.on("init", (_event: any, ...args: string[]) => {
  console.log("[Receive init]:", ...args);
  info.value = JSON.parse(args[0]);
});

window.ipcRenderer.on("qrcode-result", (_event: any, ...args: string[]) => {
  console.log("[Receive qrcode-result]:", ...args);
  qrUrl.value = args[0];
});

const start = (infos: any) => {
  errorInfo.value = "";
  console.log("start", JSON.stringify(infos));
  // 如果字段不全则界面提示，否则调用electron中的start-test
  if (
    infos.username === "" ||
    infos.password === "" ||
    infos.endpoint === "" ||
    infos.puppet === "" ||
    infos.adminRoom === ""
  ) {
    errorInfo.value = "请填写完整信息";
    isReady.value = false;
  } else {
    isReady.value = true;
    window.ipcRenderer.send("start-test", JSON.stringify(info.value));
  }
};
</script>

<template>
  <!-- <h1>{{ msg }}</h1> -->
  <!-- 三个输入框，用户名、密码、接入地址，点击提交按钮时调用start方法,提交以上三个字段得值 -->
  <div>
    <!-- 下拉选择wechaty-puppet -->

    <select class="margin-5" v-model="info.puppet">
      <option value="">Select a Puppet</option>
      <option value="wechaty-puppet-wechat4u">puppet-wechat4u</option>
      <!-- <option value="wechaty-puppet-wechat">puppet-wechat</option> -->
      <!-- <option value="wechaty-puppet-xp">puppet-xp</option> -->
      <!-- <option value="wechaty-puppet-engine">puppet-engine</option> -->
      <option value="wechaty-puppet-padlocal">puppet-padlocal</option>
      <option value="wechaty-puppet-service">puppet-service</option>
      <option value="wechaty-puppet-bridge">puppet-bridge</option>
    </select>
    <input
      class="margin-5"
      type="text"
      v-model="info.token"
      placeholder="Wechaty Token (选填)"
    />
    <input
      class="margin-5"
      type="text"
      v-model="info.username"
      placeholder="空间ID"
    />
    <input
      class="margin-5"
      type="password"
      v-model="info.password"
      placeholder="Token"
    />
    <input
      class="margin-5"
      type="text"
      v-model="info.endpoint"
      placeholder="接入地址"
    />
    <input
      class="margin-5"
      type="text"
      v-model="info.adminRoom"
      placeholder="管理群"
    />
    <button @click="getConfig" class="margin-5">载入</button>

    <button @click="start(info)" class="margin-5">设定</button>
    <!-- 点击按钮调用electron中的start-bot -->
    <button type="button" @click="startBot" class="margin-5">启动</button>
    <!-- 如果 errorInfo 不为空则显示errorInfo -->
    <p style="color: red">{{ errorInfo }}</p>
  </div>
  <!-- 显示qrUrl图片 -->
  <div v-if="qrUrl">
    <img :src="qrUrl" alt="qrcode" />
  </div>
  <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div> -->
  <!-- 带滚动条的多行文本 -->
  <div style="width: 100%">
    <!-- 内联html代码 -->
    <textarea
      style="width: 700px; height: 300px; overflow-x: hidden"
      v-html="testMsg"
      rows="10"
      cols="30"
    ></textarea>
  </div>
  <p>
    到语雀文档查看
    <a href="https://www.yuque.com/atorber/chatflow" target="_blank"
      >操作指南</a
    >
    | 下载源码
    <a href="https://github.com/atorber/chatflow" target="_blank">GitHub</a>
  </p>
  <!-- <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p> -->
</template>

<style scoped>
.margin-5 {
  margin: 0 3px;
}
.read-the-docs {
  color: #888;
}
</style>: any: string[]: { value: string; }
