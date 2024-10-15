<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElForm,
  ElFormItem,
  ElImage,
  ElMessage,
} from "element-plus";

// 定义组件的 Props
const props = defineProps<{ msg: string }>();

// 定义响应式变量
const testMsg = ref("...");
const errorInfo = ref("");
const isReady = ref(false);
const qrUrl = ref("");
const info = ref({
  username: "",
  password: "",
  endpoint: "http://127.0.0.1:9503",
  puppet: "wechaty-puppet-wechat4u",
  token: "",
  adminRoom: "",
});

// 启动机器人
const startBot = () => {
  if (!isReady.value) {
    errorInfo.value = "请填写完整信息";
    ElMessage.error("请填写完整信息");
    return;
  } else {
    window.ipcRenderer.send("start-bot");
    ElMessage.success("机器人启动中...");
  }
};

// 停止机器人
const stopBot = () => {
  window.ipcRenderer.send("stop-bot");
  ElMessage.success("机器人停止中...");
};

// 停止机器人
const restartBot = () => {
  window.ipcRenderer.send("start-bot");
  ElMessage.success("机器人重启中...");
};

// 获取配置
const getConfig = () => {
  window.ipcRenderer.send("get-config");
};

// 接收 IPC 事件
const handleActionResult = (_event: any, ...args: string[]) => {
  console.log("[Receive action-result]:", ...args);
  testMsg.value = args[0];
};

const handleInit = (_event: any, ...args: string[]) => {
  console.log("[Receive init]:", ...args);
  info.value = JSON.parse(args[0]);
};

const handleQRCodeResult = (_event: any, ...args: string[]) => {
  console.log("[Receive qrcode-result]:", ...args);
  qrUrl.value = args[0];
};

// 注册 IPC 事件监听
onMounted(() => {
  window.ipcRenderer.on("action-result", handleActionResult);
  window.ipcRenderer.on("init", handleInit);
  window.ipcRenderer.on("qrcode-result", handleQRCodeResult);
});

// 组件卸载前移除监听
onBeforeUnmount(() => {
  window.ipcRenderer.off("action-result", handleActionResult);
  window.ipcRenderer.off("init", handleInit);
  window.ipcRenderer.off("qrcode-result", handleQRCodeResult);
});

// 启动测试
const start = (infos: any) => {
  errorInfo.value = "";
  console.log("start", JSON.stringify(infos));
  if (
    infos.username === "" ||
    infos.password === "" ||
    infos.endpoint === "" ||
    infos.puppet === "" ||
    infos.adminRoom === ""
  ) {
    errorInfo.value = "请填写完整信息";
    ElMessage.error("请填写完整信息");
    isReady.value = false;
  } else {
    isReady.value = true;
    window.ipcRenderer.send("start-test", JSON.stringify(info.value));
    ElMessage.success("测试启动中...");
  }
};
</script>

<script lang="ts">
export default {
  name: "HelloWorld",
};
</script>

<template>
  <el-container style="min-width: 960px">
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>启动ChatFlow</span>
      </div>
    </el-header>

    <el-main>
      <div style="margin: 20px;">
        <!-- 表单 -->
        <el-form :model="info" label-width="120px">
          <el-row :gutter="48">
            <el-col :span="12">
              <!-- Puppet 选择 -->
              <el-form-item label="Puppet">
                <el-select v-model="info.puppet" placeholder="选择一个 Puppet">
                  <el-option
                    label="puppet-wechat4u"
                    value="wechaty-puppet-wechat4u"
                  ></el-option>
                  <el-option
                    label="puppet-padlocal"
                    value="wechaty-puppet-padlocal"
                  ></el-option>
                  <el-option
                    label="puppet-service"
                    value="wechaty-puppet-service"
                  ></el-option>
                  <el-option
                    label="puppet-bridge"
                    value="wechaty-puppet-bridge"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- Token 输入 -->
              <el-form-item label="Wechaty Token">
                <el-input
                  v-model="info.token"
                  placeholder="Wechaty Token (选填)"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="48">
            <el-col :span="12">
              <!-- 用户名输入 -->
              <el-form-item label="空间ID">
                <el-input
                  v-model="info.username"
                  placeholder="空间ID"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 密码输入 -->
              <el-form-item label="Token">
                <el-input
                  v-model="info.password"
                  type="password"
                  placeholder="Token"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 接入地址输入 -->
          <el-form-item label="接入地址">
            <el-input
              v-model="info.endpoint"
              placeholder="接入地址，默认：http://127.0.0.1:9503"
              clearable
            ></el-input>
          </el-form-item>

          <!-- 管理群输入 -->
          <el-form-item label="管理群">
            <el-input
              v-model="info.adminRoom"
              placeholder="管理群"
              clearable
            ></el-input>
          </el-form-item>

          <!-- 按钮组 -->
          <el-form-item>
            <el-button type="primary" @click="getConfig">载入</el-button>
            <el-button type="success" @click="start(info)">设定</el-button>
            <el-button type="warning" @click="startBot">启动</el-button>
            <el-button type="info" @click="restartBot">重启</el-button>
            <el-button type="error" @click="stopBot">停止</el-button>
          </el-form-item>

          <!-- 错误信息 -->
          <el-form-item v-if="errorInfo" label="">
            <el-alert
              title="错误"
              type="error"
              :description="errorInfo"
              show-icon
            ></el-alert>
          </el-form-item>
        </el-form>

        <!-- QR 码显示 -->
        <div v-if="qrUrl" style="margin-top: 20px">
          <el-image
            :src="qrUrl"
            fit="contain"
            style="width: 200px; height: 200px"
            alt="二维码"
          ></el-image>
        </div>

        <!-- 消息显示 -->
        <div style="margin-top: 20px">
          <el-input
            v-model="testMsg"
            type="textarea"
            :rows="14"
            placeholder="消息内容"
            readonly
          ></el-input>
        </div>

        <!-- 相关链接 -->
        <p style="margin-top: 20px; color: #000">
          到语雀文档查看
          <a href="https://www.yuque.com/atorber/chatflow" target="_blank"
            >操作指南</a
          >
          | 下载源码
          <a href="https://github.com/atorber/chatflow" target="_blank"
            >GitHub</a
          >
        </p>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
.margin-5 {
  margin: 0 3px;
}
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>