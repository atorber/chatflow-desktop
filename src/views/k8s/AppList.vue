<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>预置应用</span>
      </div>
    </el-header>

    <el-main>
      <el-card
        class="box-card"
        style="margin-top: 10px; text-align: left"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span>aihc-helper-job-cpu</span>
            <el-button
              v-if="cpuPod.status.phase"
              class="button"
              type="success"
              text
              >{{ cpuPod.status.phase }}</el-button
            >
            <el-button v-else class="button" type="primary" text
              >立即部署</el-button
            >
          </div>
        </template>
        <div>预置系统CPU Pod，用于读取存储目录、数据处理等自定义任务。</div>
      </el-card>
      <el-card
        class="box-card"
        style="margin-top: 10px; text-align: left"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span>aihc-helper-job-gpu</span>
            <el-button class="button" type="primary" text>立即部署</el-button>
          </div>
        </template>
        <div>预置系统AIAK GPU Pod，用于数据预处理、模型转换等自定义任务。</div>
      </el-card>
      <el-card
        class="box-card"
        style="margin-top: 10px; text-align: left"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span>JuypterLab</span>
            <el-button class="button" type="primary" text>立即部署</el-button>
          </div>
        </template>
        <div>
          JuypterLab开发机，在资源池中一键部署，使用Web IDE进行程序开发。
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";

import { reactive, computed } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore

import {
  // UploadRawFile,
  ElMessage,
} from "element-plus";

import type Node from "element-plus/es/components/tree/src/model/node";

const store = useStore();

/*树形结构数据*/
interface Tree {
  name: string;
  leaf?: boolean;
}

const systemPodStore = computed({
  get: () => store.getters.systemPod,
  set: (value) => store.commit("updateSystemPod", value),
});

const cpuPod = ref({ status: { phase: "" }, metadata: { name: "" } });

const curNode = ref<Node | null>(null);
const curResolve = ref<((data: Tree[]) => void) | null>(null);

const setFiles = (params: any) => {
  // console.log("setFiles", params);
  const files = params.files;
  const parent = params.parent;

  const node = curNode.value;
  const resolve = curResolve.value;

  if (node && resolve) {
    const data: Tree[] = files
      .filter((item: { name: string }) => item.name.indexOf("->") === -1)
      .map((item: any) => {
        return {
          name:
            node.level === 0 ? parent + item.name : parent + "/" + item.name,
          leaf: item.type !== "directory",
        };
      });
    updateFilesIsLoading.value = false;

    return resolve(data);
  }
};

const k8sRecordStore: any = computed({
  get: () => store.getters.k8sRecord,
  set: (value) => store.commit("updateK8sRecord", value),
});
const k8sRecord = k8sRecordStore.value;
// let k8sRecord = reactive(JSON.parse(JSON.stringify(k8sActions[0])));

const k8sInfo = reactive({
  NodeList: [],
  PyTorchJobList: [],
  NormalJobList: [],
  PodList: [],
  NamespaceList: [],
});

const updateNodeListIsLoading = ref(false);
const updatePodListIsLoading = ref(false);
const updateFilesIsLoading = ref(false);

// 初始化时载入updateKubeconfig
send2ipc("updateKubeconfig", "");
send2ipc("getSystemPod", "");

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);
  // console.log("method", method);
  // console.log("params", params);

  switch (method) {
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
    case "getSystemPod": {
      // console.log("getSystemPod", params);
      cpuPod.value = params;

      systemPodStore.value.cpuPod = cpuPod.value.metadata.name;
      // console.log("cpuPod", cpuPod.value);
      break;
    }
    case "listNodes": {
      const names = params.response.body.items.map((item: any) => {
        // console.log("item", item);
        return {
          name: item.metadata.name,
          creationTimestamp: item.metadata.creationTimestamp,
          uid: item.metadata.uid,
          osImage: item.status.nodeInfo.osImage,
          architecture: item.status.nodeInfo.architecture,
        };
      });
      names.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      k8sInfo.NodeList = names;
      ElMessage.success("更新成功");
      updateNodeListIsLoading.value = false;

      break;
    }
    case "getNamespacePods": {
      const names = params.response.body.items.map((item: any) => {
        // console.log("item", item);
        return {
          name: item.metadata.name,
          creationTimestamp: item.metadata.creationTimestamp,
          active: item.status.phase || "--",
          uid: item.metadata.uid,
          namespace: item.metadata.namespace,
          startTime: item.status.startTime,
          completionTime: item.status.completionTime || "--",
        };
      });
      names.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      if (params.response.body.kind === "PodList") {
        const namesNew = names.filter(
          (item: any) =>
            item.active === "Running" ||
            item.name.includes("aihc-helper-job-cpu")
        );
        k8sInfo.PodList = namesNew;
        ElMessage.success("更新成功");
        updatePodListIsLoading.value = false;
      }
      break;
    }
    case "updateFiles": {
      setFiles(params);
      break;
    }
    case "k8s":
      k8sRecord.res = JSON.stringify(params, null, 2);
      break;
    case "updateKubeconfig":
      ElMessage.success("Kubeconfig更新成功");
      // console.log("updateKubeconfig k8sRecord.config", params);
      k8sRecord.config = params;
      break;
    default:
      break;
  }
});

// 发送消息
function send2ipc(method: string, params: string | object) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}
</script>
  
  <script lang="ts">
export default {
  name: "AppList",
};
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
  /* padding: 0; */
  min-height: 768px;
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