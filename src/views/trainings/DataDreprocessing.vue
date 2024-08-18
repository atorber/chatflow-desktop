<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>数据预处理</span>
      </div>
    </el-header>

    <el-main>
      <!-- <el-tag type="success">任务信息</el-tag> -->

      <el-form :model="form" label-width="auto" style="margin: 10px">
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
          <el-col :span="8">
            <el-form-item label="训练方式">
              <el-select
                v-model="form.trainingMethod"
                placeholder="选择训练方式"
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
            <el-form-item
              label="微调方式"
              v-if="form.trainingMethod === 'finetuning'"
            >
              <el-select
                v-model="form.fineTuningMethod"
                placeholder="选择微调方式"
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

      <el-divider border-style="dashed">
        <el-tag type="success"
          >数据预处理任务参数信息 {{ form.filePath }}</el-tag
        >
      </el-divider>

      <el-card class="box-card">
        <el-form :model="form" label-width="auto" style="margin: 10px">
          <el-row :gutter="48">
            <el-col :span="22">
              <el-form-item label="镜像地址">
                <el-input
                  v-model="form.imageUrl"
                  type="textarea"
                  rows="1"
                  placeholder="选择配置后自动生成"
                  ref="imageUrl"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="2"
              v-if="form.imageUrl"
              @click="go2copy(form.imageUrl)"
            >
              <el-tooltip
                class="box-item"
                effect="dark"
                content="点击复制到剪切板"
                placement="top-start"
              >
                <el-icon color="#E6A23C"><CopyDocument /></el-icon>
              </el-tooltip>
            </el-col>
          </el-row>

          <el-row :gutter="48">
            <el-col :span="22">
              <el-form-item label="执行命令">
                <el-input
                  v-model="form.command"
                  type="textarea"
                  rows="15"
                  placeholder="选择配置后自动生成"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="2"
              v-if="form.command"
              @click="go2copy(form.command)"
            >
              <el-tooltip
                class="box-item"
                effect="dark"
                content="点击复制到剪切板"
                placement="top-start"
              >
                <el-icon color="#E6A23C"><CopyDocument /></el-icon>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";

import { reactive, computed } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore

import {
  UploadInstance,
  UploadProps,
  // UploadRawFile,
  ElMessage,
  CascaderProps,
} from "element-plus";

import { yamlCreate } from "../trainings/yamlCreate.js";
import { go2copy } from "../../utils.js";

import type Node from "element-plus/es/components/tree/src/model/node";

const store = useStore();

/*树形结构数据*/
interface Tree {
  name: string;
  leaf?: boolean;
}

const curNode = ref<Node | null>(null);
const curResolve = ref<((data: Tree[]) => void) | null>(null);

const k8sRecordStore: any = computed({
  get: () => store.getters.k8sRecord,
  set: (value) => store.commit("updateK8sRecord", value),
});
const k8sRecord = k8sRecordStore.value;
// let k8sRecord = reactive(JSON.parse(JSON.stringify(k8sActions[0])));

const upload = ref<UploadInstance>();

const recordStore: any = computed({
  get: () => store.getters.record,
  set: (value) => store.commit("updateRecord", value),
});

// console.log("record1", JSON.stringify(record1.value, null, 2));

// const record: TrainingModel = JSON.parse(JSON.stringify(DefaultRecord));

const record = recordStore.value;

// do not use same name with ref
// const form = reactive(record);
const form = record;

const menuName = ref("0");

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);
  // console.log("method", method);
  // console.log("params", params);

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
    case "execCommandInPod": {
      console.log("execCommandInPod webside", params);
      k8sRecord.res = JSON.stringify(params, null, 2);
      k8sRecord.log += params.command + "\n";
      if (params.stdout) {
        k8sRecord.log += "success:" + params.stdout + "\n";
      } else {
        k8sRecord.log += "error:" + params.stderr + "\n";
      }
      break;
    }
    default:
      break;
  }
});

// 选择模型系列
function setModelFamilies(params: string[]) {
  form.modelFamilies = Object.keys(params).filter(
    (item: string) => item.indexOf("version.txt") === -1
  );
  handleModelFamily(form.modelFamilies[0]);
}

// 发送消息
function send2ipc(method: string, params: string | object) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}

// 选择文件
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

// 选择镜像源
function handleSource(val: string | number | boolean | undefined) {
  console.log("source", val);
  form.source = String(val);
  if (val === "预置版本") {
    send2ipc("getPreinstallVersions", "");
    handleImageVersion("");
  } else {
    handleImageVersion("");
  }
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
    if (menuName.value === "convert") {
      getConverts();
    }
  } else {
    form.modelFamilies = [];
    handleTrainingMethod("");
    handleModelConvert("");
  }
}

function getConverts() {
  const { modelFamily } = form;
  const convertInfo: any = {};
  if (modelFamily && form.infos[modelFamily]["checkpoint_convert"]) {
    const keys = Object.keys(form.infos[modelFamily]["checkpoint_convert"]);
    // console.log("keys", keys);
    for (const convert of keys) {
      console.log("convert", convert);
      // const convert = key.split("_")[1] + '_' + key.split("_")[2];

      // 排除megatron_core
      if (convert.indexOf("megatron_core") === -1) {
        const convertArr = convert.split("_");
        const modelName = convertArr[1] + "_" + convertArr[2];
        const source = convertArr[3];
        const target = convertArr[5].split(".")[0];
        if (convertInfo[modelName]) {
          if (convertInfo[modelName][source]) {
            convertInfo[modelName][source].push(target);
          } else {
            convertInfo[modelName][source] = [target];
          }
        } else {
          convertInfo[modelName] = {};
          convertInfo[modelName][source] = [target];
        }
      }
    }

    // console.log("convertInfo", JSON.stringify(convertInfo));

    form.modelConvertInfo = convertInfo;
    form.modelConvertNames = Object.keys(convertInfo);

    const defaultModel = form.modelConvertNames[0];
    handleModelConvert(defaultModel);
  } else {
    form.modelConvertInfo = {};
    form.modelConvertNames = [];
    handleModelConvert("");
  }
}

function handleModelConvertSource(val: string) {
  form.modelConvertSource = val;
  if (val) {
    form.modelConvertTargets =
      form.modelConvertInfo[form.modelConvertName][val];
    form.modelConvertTarget = form.modelConvertTargets[0];
    handleModelConvertTarget(form.modelConvertTarget);
  } else {
    handleModelConvert("");
  }
}

function handleModelConvertTarget(val: string) {
  form.modelConvertTarget = val;
  if (val) {
    const filePath = `examples/${form.modelFamily}/checkpoint_convert/convert_${form.modelConvertName}_${form.modelConvertSource}_to_${form.modelConvertTarget}.sh`;
    const command =
      form.infos[form.modelFamily]["checkpoint_convert"][
        `convert_${form.modelConvertName}_${form.modelConvertSource}_to_${form.modelConvertTarget}.sh`
      ];
    form.filePath = filePath;
    handleCommand(command);
  } else {
    clearCommand();
  }
}

function clearCommand() {
  form.command = "";
  form.env = "";
  form.imageUrl = "";
  form.filePath = "";
}

function handleModelConvert(val: string) {
  form.modelConvertName = val;
  if (val) {
    form.modelConvertSources = Object.keys(form.modelConvertInfo[val]);
    handleModelConvertSource(form.modelConvertSources[0]);
  } else {
    clearCommand();
    form.modelConvertNames = [];
    form.modelConvertSources = [];
    form.modelConvertSource = "";
    form.modelConvertTargets = [];
    form.modelConvertTarget = "";
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
    form.trainingMethods = [];
    handleFineTuningMethod("");
  }
}

// 选择数据预处理脚本
function handlePreprocessData() {
  const filePath = `examples/${form.modelFamily}/${form.trainingMethod}/preprocess_data.sh`;
  const command =
    form.infos[form.modelFamily][form.trainingMethod]["preprocess_data.sh"];
  form.filePath = filePath;
  handleCommand(command);
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
    form.trainingMethods = [];
    handleModel("");
  }
}

// 选择模型名称
function handleModel(val: string) {
  form.modelName = val;
  if (val) {
    const command = form.infos[form.modelFamily][form.trainingMethod][val];
    const filePath = `examples/${form.modelFamily}/${form.trainingMethod}/${val}`;
    form.filePath = filePath;
    handleCommand(command);
  } else {
    form.modelNames = [];
    clearCommand();
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

  let envs = "";
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

        envs += `                - name: ${newKey}\n`;
        envs += `                  value: ${newValue}\n`;
      }
    }
  }
  envs =
    "                - name: CUDA_DEVICE_MAX_CONNECTIONS\n                  value: 1";
  env =
    "#根据实际需求配置修改环境变量，推荐使用示例中的默认路径存放，尽量通过环境变量修改配置而不是直接修改执行命令\n\n" +
    "CUDA_DEVICE_MAX_CONNECTIONS=1";

  form.env = env;
  form.envs = envs;

  // 将command的每一行缩进4个空格
  const commandList = command.split("\n");
  let newCommand = "";
  for (const item of commandList) {
    newCommand += `    ${item}\n`;
  }
  const yaml = yamlCreate(newCommand, form.imageUrl, form.envs);
  // console.log("yaml demo", yaml);
  form.yaml = yaml;
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
</script>
  
  <script lang="ts">
export default {
  name: "DataDreprocessing",
};
</script>
  
  <style scoped>
.el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.el-aside {
  color: var(--el-text-color-primary);
  /* background: var(--el-color-primary-light-8); */
}
.el-menu {
  border-right: none;
}
.el-main {
  /* padding: 0; */
  min-height: 768px;
}
.toolbar {
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

.el-col-10,
.el-col-10.is-guttered {
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
.el-header {
  border-radius: 3px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.example-pagination-block {
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  text-align: left;
}

/* .box-card {
    width: 480px;
  } */

.margin-top {
  margin-top: 10px;
}
.margin-bottom {
  margin-bottom: 10px;
}
.margin-left {
  margin-left: 10px;
}
.margin-right {
  margin-right: 10px;
}
</style>./types.js