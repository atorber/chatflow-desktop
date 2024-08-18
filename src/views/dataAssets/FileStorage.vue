<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>文件管理</span>
      </div>
    </el-header>

    <el-main>
      <el-form
        :model="form"
        label-width="auto"
        style="margin: 10px 0px 10px 0px; text-align: left"
      >
        <!-- 点击刷新按钮，刷整个新页面 -->
        <el-button
          @click="updatePage"
          icon="Refresh"
          color="blue"
          :loading="updateFilesIsLoading"
          >刷新</el-button
        >
      </el-form>

      <el-tree v-if="showFiles" :props="filesProps" :load="loadNode" lazy>
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span v-if="node.label.indexOf('->') == -1">{{
              node.label.split("/").pop()
            }}</span>
            <span v-else>{{ node.label }}</span>
            <span>
              <el-button type="primary" link @click="go2copy(data.name)"
                >复制路径</el-button
              >
              <el-button type="primary" link @click="go2copy(data.name)">
                添加到数据集</el-button
              >
            </span>
          </span>
        </template>
      </el-tree>
    </el-main>
  </el-container>
</template>
      <script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore
import { go2copy, send2ipc } from "../../utils.js";
import {
  UploadInstance,
  UploadProps,
  // UploadRawFile,
  ElMessage,
  CascaderProps,
} from "element-plus";
import {
  // TrainingModel,
  MenusInstance,
  // DefaultRecord,
  DefaultTrainingParams,
  tableData,
  // k8sconfigData,
  k8sActions,
  k8sActionsData,
} from "../types.js";
import type Node from "element-plus/es/components/tree/src/model/node";

const store = useStore();

const filesProps = {
  label: "name",
  children: "zones",
  isLeaf: "leaf",
};
const updateFilesIsLoading = ref(false);
const showFiles = ref(true);
const updatePage = () => {
  showFiles.value = false;
  setTimeout(() => {
    showFiles.value = true;
  }, 100);
};

const form = reactive({
  name: "",
  state: "",
  city: "",
  address: "",
  date: "",
});

/*树形结构数据*/
interface Tree {
  name: string;
  leaf?: boolean;
}

const systemPodStore = computed({
  get: () => store.getters.systemPod,
  set: (value) => store.commit("updateSystemPod", value),
});

const k8sRecordStore: any = computed({
  get: () => store.getters.k8sRecord,
  set: (value) => store.commit("updateK8sRecord", value),
});

const k8sRecord = k8sRecordStore.value;

const curNode = ref<Node | null>(null);
const curResolve = ref<((data: Tree[]) => void) | null>(null);

const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  // console.log("node", node);
  curNode.value = node;
  curResolve.value = resolve;
  if (node.level === 0) {
    updateFiles("/");
  } else {
    updateFiles(node.data.name);
  }
  updateFilesIsLoading.value = true;
};

const updateFiles = (path = "/") => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  if (updateFilesIsLoading.value) {
    return;
  }
  updateFilesIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updateFilesIsLoading.value = false;
  }, 60000);
  send2ipc("updateFiles", { podName: systemPodStore.value.cpuPod, path });
};

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

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);
  // console.log("method", method);
  // console.log("params", params);

  switch (method) {
    case "updateFiles": {
      setFiles(params);
      break;
    }
    default:
      break;
  }
});
</script>
      
      <script lang="ts">
export default {
  name: "FileStorage",
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
</style>
      