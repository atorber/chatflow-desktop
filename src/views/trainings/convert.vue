<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <!-- <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px">
                <setting />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span> -->
        <span>模型权重转换</span>
      </div>
    </el-header>

    <el-main>
      <!-- <el-tag type="success">任务信息</el-tag> -->

      <el-form :model="form" label-width="auto" style="margin: 20px">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="镜像源">
              <el-radio-group v-model="form.source" @change="handleSource">
                <el-radio value="预置版本">预置版本</el-radio>
                <el-radio value="自定义版本">自定义版本</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert
          v-if="form.source === '自定义版本'"
          title="在examples目录中创建version.txt文件并增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
          type="warning"
        />

        <el-row :gutter="48">
          <el-col :span="8">
            <el-form-item label="镜像版本">
              <el-select
                v-model="form.version"
                placeholder="选择镜像版本"
                :disabled="form.source === '自定义版本'"
              >
                <el-option
                  v-for="item in form.preinstallVersions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.source === '自定义版本'">
            <el-form-item label="文件路径">
              <el-input
                disabled
                v-model="form.path"
                placeholder="脚本存放路径"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="form.source === '自定义版本'">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :limit="1"
              :on-change="handleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template>
            </el-upload>
          </el-col>
          <el-col :span="2" v-if="form.source === '自定义版本'">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="在examples目录中创建version.txt文件增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
              placement="top-start"
            >
              <el-icon color="#E6A23C"><InfoFilled /></el-icon>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="48">
          <el-col :span="8">
            <el-form-item label="模型系列">
              <el-select
                v-model="form.modelFamily"
                placeholder="选择模型系列"
                @change="handleModelFamily"
              >
                <el-option
                  v-for="item in form.modelFamilies"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型名称">
              <el-select
                v-model="form.modelName"
                placeholder="选择模型系列"
                @change="handleModel"
              >
                <!-- modelNames作为选项 -->
                <el-option
                  v-for="item in form.modelNames"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="48">
          <el-col :span="8">
            <el-form-item label="原始格式">
              <el-select
                v-model="form.trainingMethod"
                placeholder="请选择原始格式"
                @change="handleTrainingMethod"
              >
                <!-- trainingMethods作为选项 -->
                <el-option
                  v-for="item in form.trainingMethods"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标格式">
              <el-select
                v-model="form.fineTuningMethod"
                placeholder="选择目标格式"
                @change="handleFineTuningMethod"
              >
                <!-- fineTuningMethods作为选项 -->
                <el-option
                  v-for="item in form.fineTuningMethods"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-tag type="success">模型权重转换参数信息</el-tag>

      <el-form :model="form" label-width="auto" style="margin: 20px">
        <el-form-item label="镜像地址">
          <el-input
            v-model="form.imageUrl"
            type="textarea"
            rows="1"
            placeholder="选择配置后自动生成"
          />
        </el-form-item>
        <el-form-item label="执行命令">
          <el-input
            v-model="form.command"
            type="textarea"
            rows="15"
            placeholder="选择配置后自动生成"
          />
        </el-form-item>
        <el-form-item label="环境变量">
          <el-input
            v-model="form.env"
            type="textarea"
            rows="15"
            placeholder="选择配置后自动生成"
          />
        </el-form-item>
        <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item> -->
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
// import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { reactive } from "vue";

import {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  ElMessage,
} from "element-plus";

defineProps<{ msg: string }>();

interface TrainingModel {
  name: string;
  version: string;
  modelFamily: string;
  trainingMethod: string;
  fineTuningMethod: string;
  modelName: string;
  imageUrl: string;
  command: string;
  env: string;
  modelFamilies: string[];
  trainingMethods: string[];
  fineTuningMethods: string[];
  modelNames: string[];
  preinstallVersions: string[];
  source: string;
  path: string;
  infos: any;
  versions: any;
}

const upload = ref<UploadInstance>();

const record: TrainingModel = {
  name: "",
  version: "",
  modelFamily: "",
  trainingMethod: "",
  fineTuningMethod: "sft",
  modelName: "",
  imageUrl: "",
  command: "#! /bin/bash",
  env: "",
  modelFamilies: [],
  trainingMethods: [],
  fineTuningMethods: [],
  modelNames: [],
  preinstallVersions: [],
  source: "自定义版本",
  path: "",
  infos: {},
  versions: {},
};

const menuName = ref("training");

// do not use same name with ref
const form = reactive(record);

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);

  switch (method) {
    case "getPreinstallVersions":
      form.preinstallVersions = params;
      if (form.source === "预置版本") {
        handleImageVersion(params[0]);
      }
      break;
    case "getCustomVersions":
      form.preinstallVersions = params;

      const version = params[0];
      const imageUrl = `registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v${version}_release`;
      form.imageUrl = imageUrl;
      form.version = version;
      send2ipc("listFiles", form.path);
      break;
    case "listFiles":
      form.infos = params;
      setModelFamilies(params);
      break;
    case "initError":
      ElMessage.error("初始化失败, 请退出重启程序");
      break;
    default:
      break;
  }
});

function setModelFamilies(params: string[]) {
  form.modelFamilies = Object.keys(params).filter(
    (item: string) => item.indexOf("version.txt") === -1
  );
  handleModelFamily(form.modelFamilies[0]);
}

// 发送消息
function send2ipc(method: string, params: string) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}

const handleChange: any = (uploadFile: any, uploadFiles: any) => {
  console.log("on handleChange", uploadFile);
  const file = uploadFile;
  console.log("file", file.raw);
  if (file.raw.path.indexOf("examples") !== -1 && file.name === "version.txt") {
    form.path = file.raw.path;
    console.log("form.path", form.path);
    send2ipc("getCustomVersions", form.path);
  } else {
    ElMessage.error("请选择正确的文件");
  }
};

// 选择文件
const handleExceed: UploadProps["onExceed"] = (files) => {
  console.log("on exceed", files);
  const file = files[0];
  if (file.name === "version.txt" && file.path.indexOf("examples") !== -1) {
    form.path = file.path;
    send2ipc("getCustomVersions", form.path);
  } else {
    ElMessage.error("请选择正确的文件");
  }
};

// 选择镜像源
function handleSource(val: string | number | boolean | undefined) {
  console.log("source", val);
  form.source = String(val);
  if (val === "预置版本") {
    send2ipc("getPreinstallVersions", "");
    handleImageVersion("");
  } else {
    form.path = "";
    handleImageVersion("");
  }
}

// 初始化
function init(files: string[]) {
  form.modelFamilies = files;
  handleModelFamily(files[0]);
}

// 选择镜像版本
function handleImageVersion(val: string) {
  const version = String(val);
  form.version = val;

  if (version) {
    form.imageUrl = `registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v${version}_release`;
    send2ipc("listFiles", version);
  } else {
    handleModelFamily("");
  }
}

// 选择模型系列
function handleModelFamily(val: string) {
  form.modelFamily = val;

  if (val) {
    // 读取模型系列目录下的文件夹
    form.trainingMethods = Object.keys(form.infos[val]).filter(
      (item: string) => {
        return item.indexOf("checkpoint_convert") === -1;
      }
    );
    handleTrainingMethod(form.trainingMethods[0]);
  } else {
    handleTrainingMethod("");
  }
}

// 选择训练方式
function handleTrainingMethod(val: string) {
  const fineTuningMethods: string[] = [];
  form.trainingMethod = val;

  if (val) {
    // 读取训练方式目录下的文件列表
    const files = Object.keys(
      form.infos[form.modelFamily][form.trainingMethod]
    ).filter((item: string) => {
      return item.indexOf("preprocess_data") === -1;
    });
    for (const file of files) {
      const fineTuningMethod = file.split("_")[0];
      if (!fineTuningMethods.includes(fineTuningMethod)) {
        fineTuningMethods.push(fineTuningMethod);
      }
    }
    form.fineTuningMethods = fineTuningMethods;
    handleFineTuningMethod(fineTuningMethods[0]);
  } else {
    handleFineTuningMethod("");
  }
}

// 选择数据预处理脚本
function handlePreprocessData() {
  console.log(
    "handlePreprocessData form",
    form.infos[form.modelFamily][form.trainingMethod]
  );
  const command =
    form.infos[form.modelFamily][form.trainingMethod]["preprocess_data.sh"];
  handleCommand(command);
  console.log("form.command", command);
}

// 选择微调方法
function handleFineTuningMethod(val: string) {
  form.fineTuningMethod = val;
  if (val) {
    if (menuName.value === "training") {
      handleModelList(form.version);
    }

    if (menuName.value === "preprocess") {
      handlePreprocessData();
    }
  } else {
    handleModel("");
  }
}

// 选择模型名称
function handleModel(val: string) {
  form.modelName = val;
  if (val) {
    form.command = form.infos[form.modelFamily][form.trainingMethod][val];
    handleCommand(form.command);
  } else {
    form.command = "";
    form.env = "";
    form.imageUrl = "";
  }
}

function handleCommand(command: string) {
  form.command = command;
  handleEnvList(form.command);
}

// 提取环境变量
function handleEnvList(command: string) {
  // ${DATA_PATH:-"/mnt/cluster/aiak-training-llm/dataset/sft_aplaca_zh_data.json"}
  // 从command中提取出所有的环境变量并赋予默认值，格式：DATA_PATH=/mnt/cluster/aiak-training-llm/dataset/sft_aplaca_zh_data.json
  const envList = command.match(/\${[A-Z_]+:-".*?"}/g);
  let env =
    "#根据实际需求配置修改环境变量，推荐使用示例中的默认路径存放，尽量通过环境变量修改配置而不是直接修改执行命令\n\n";
  if (envList) {
    for (const item of envList) {
      const key = item.match(/[A-Z_]+/g);
      const value = item.match(/".*?"/g);
      // console.log('value', value)

      if (key && value) {
        const newValue = value[0].replace(/"/g, "");
        const newKey = key[0];
        env += `${newKey}=${newValue}`;
        switch (newKey) {
          case "MEGATRON_PATH":
            env += " #megatron的代码路径，建议保持默认值";
            break;
          case "AIAK_TRAINING_PATH":
            env += " #AIAK加速训练代码路径，保持默认值";
            break;
          case "DATA_PATH":
            env +=
              " #数据集路径，建议将数据集放在/mnt/cluster/aiak-training-llm/dataset/下，并根据实际修改数据集路径";
            break;
          case "DATASET_CONFIG_PATH":
            env += " #数据集配置文件路径，建议保持默认值";
            break;
          case "DATA_CACHE_PATH":
            env += " #数据缓存路径，建议保持默认值";
            break;
          case "TOKENIZER_PATH":
            env += " #分词器路径，建议保持默认值";
            break;
          case "CHECKPOINT_PATH":
            env += " #checkpoint保存路径，建议保持默认值";
            break;
          case "TENSORBOARD_PATH":
            env += " #tensorboard保存路径，建议保持默认值";
            break;
          case "MASTER_ADDR":
            env += " #master地址，建议保持默认值";
            break;
          case "MASTER_PORT":
            env += " #master端口，建议保持默认值";
            break;
          case "WORLD_SIZE":
            env += " #训练节点数量，建议保持默认值";
            break;
          case "RANK":
            env += " #训练节点编号，建议保持默认值";
            break;
          default:
            break;
        }

        env += "\n";
      }
    }
  }
  form.env = env;
}

// 计算可选的模型列表
function handleModelList(version: string) {
  const { modelFamily, trainingMethod, fineTuningMethod } = form;
  if (version) {
    const modelList = Object.keys(
      form.infos[modelFamily][trainingMethod]
    ).filter((item: string) => {
      return item.indexOf("preprocess_data") === -1;
    });
    form.modelNames = modelList;
    if (form.trainingMethod) {
      handleModel(modelList[0]);
    }
  } else {
    form.modelNames = [];
    handleModel("");
  }
}

// 复制镜像地址到剪贴板
function handleCopyImageUrl() {
  const { imageUrl } = form;
  if (imageUrl) {
    // 复制imageUrl
    // $copyText(imageUrl);

    ElMessage.success("复制成功");
  }
}

// 复制执行命令到剪贴板
function handleCopyCommand() {
  const { command } = form;
  if (command) {
    // $copyText(command);
    ElMessage.success("复制成功");
  }
}

// 复制环境变量到剪贴板
function handleCopyEnv() {
  const { env } = form;
  if (env) {
    // $copyText(env);
    ElMessage.success("复制成功");
  }
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  /* background: var(--el-color-primary-light-8); */
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.el-row {
  margin-bottom: 0;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.el-col-2,
.el-col-2.is-guttered {
  display: flex;
  align-items: center;
}

.el-col-3,
.el-col-3.is-guttered {
  display: flex;
  align-items: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.el-alert {
  margin: 10px;
}
.el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 9px;
  margin-top: 9px;
}
</style>
