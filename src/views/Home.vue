<template>
  <el-container
    class="layout-container-demo"
    style="width: 1200px; height: 100%; min-height: 800px"
  >
    <el-aside width="180px">
      <el-scrollbar>
        <el-menu
          :default-openeds="menus.defaultOpeneds"
          :default-active="menus.defaultActive"
          @select="handleMenuSelect"
          @click="handleMenuClick"
          :unique-opened="true"
        >
          <template v-for="menu in menus.items" :key="menu.index">
            <el-sub-menu v-if="menu.items" :index="menu.index">
              <template #title>
                <el-icon><component :is="menu.icon" /></el-icon>{{ menu.title }}
              </template>
              <el-menu-item-group v-if="menu.items">
                <el-menu-item
                  v-for="item in menu.items"
                  :index="item.index"
                  :key="item.index"
                >
                  {{ item.title }}
                </el-menu-item>
              </el-menu-item-group>
              <template v-if="menu.subMenus">
                <el-sub-menu
                  v-for="subMenu in menu.subMenus"
                  :index="subMenu.index"
                  :key="subMenu.index"
                >
                  <template #title>{{ subMenu.title }}</template>
                  <el-menu-item
                    v-for="subItem in subMenu.items"
                    :index="subItem.index"
                    :key="subItem.index"
                  >
                    {{ subItem.title }}
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.index">
              <el-icon><component :is="menu.icon" /></el-icon>
              <template #title>概览</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 概览 -->
    <Overview v-if="menuName == '0'" />

    <!-- 训练 -->
    <TrainingParameters v-else-if="menuName == 'training'" />
    <ModelTransformation v-else-if="menuName == 'convert'" />
    <DataDreprocessing v-else-if="menuName == 'preprocess'" />

    <!-- 数据资产 -->
    <ModelWeights v-else-if="menuName == 'models'" />
    <DataSet v-else-if="menuName == 'datasets'" />
    <FileStorage v-else-if="menuName == 'files'" />
    <DevelopmentMachine v-else-if="menuName == 'devmachine'" />

    <!-- 集群 -->
    <K8sOperation v-else-if="menuName == 'kubernetes'" />
    <AppList v-else-if="menuName == 'appList'" />
    <NodeList v-else-if="menuName == 'nodeList'" />
    <PyTorchJobList v-else-if="menuName == 'jobList'" />
    <NormalJobList v-else-if="menuName == 'normalJobList'" />
    <PodList v-else-if="menuName == 'podList'" />
    <NameSpaceList v-else-if="menuName == 'namespaceList'" />

    <!-- 设置 -->
    <ClusterCredentials v-else-if="menuName == 'k8sconfig'" />
    <Backup v-else-if="menuName == 'backup'" />
    <AccountKey v-else-if="menuName == 'aksk'" />

    <!-- 其他 -->
    <ComingSoon v-else />
  </el-container>
</template>

<script lang="ts" setup>
import Backup from "./setting/Backup.vue";
import Overview from "./Overview.vue";
import AccountKey from "./setting/AccountKey.vue";
import ClusterCredentials from "./setting/ClusterCredentials.vue";
import DataSet from "./dataAssets/DateSet.vue";
import ModelWeights from "./dataAssets/ModelWeights.vue";
import DevelopmentMachine from "./dataAssets/DevelopmentMachine.vue";
import FileStorage from "./dataAssets/FileStorage.vue";
import TrainingParameters from "./trainings/TrainingParameters.vue";
import DataDreprocessing from "./trainings/DataDreprocessing.vue";
import ModelTransformation from "./trainings/ModelTransformation.vue";
import ComingSoon from "./ComingSoon.vue";
import K8sOperation from "./k8s/K8sOperation.vue";
import AppList from "./k8s/AppList.vue";
import NodeList from "./k8s/NodeList.vue";
import NameSpaceList from "./k8s/NamespaceList.vue";
import PodList from "./k8s/PodList.vue";
import PyTorchJobList from "./k8s/PyTorchJobList.vue";
import NormalJobList from "./k8s/NormalJobList.vue";

import { ref, computed } from "vue";
import { useStore } from "../store"; // 确保从 vuex 导入 useStore

import { MenusInstance } from "./types.js";
import {
  // UploadRawFile,
  ElMessage,
} from "element-plus";

import type Node from "element-plus/es/components/tree/src/model/node";

const store = useStore();

defineProps<{ msg: string }>();

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

const menus = ref(MenusInstance);

const menuName = ref("0");

const updateFilesIsLoading = ref(false);

// 初始化时载入updateKubeconfig
send2ipc("updateKubeconfig", "");
send2ipc("getSystemPod", "");

// 切换菜单
function handleMenuSelect(index: string) {
  // console.log("index", index);
  menuName.value = index;
  // console.log("menuName", menuName.value);
  // handleModelFamily(form.modelFamily);

  // if (index === "files") {
  //   updateFiles();
  // }

  if (index === "k8sconfig") {
    send2ipc("updateKubeconfig", "");
  }
}

// 点击菜单
function handleMenuClick(item: any) {
  // console.log("handleMenuClick item", item);
}

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
    case "initError":
      ElMessage.error("初始化失败, 请退出重启程序");
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
  name: "Home",
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