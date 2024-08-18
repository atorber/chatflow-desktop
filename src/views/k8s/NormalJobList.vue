<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>普通任务</span>
      </div>
    </el-header>

    <el-main>
      <el-form
        :model="k8sInfo.NormalJobList"
        label-width="auto"
        style="margin: 10px 0px 10px 0px; text-align: left"
      >
        <!-- 刷新 -->
        <el-button
          :loading="updateNormalJobListIsLoading"
          @click="updateNormalJobList"
          icon="Refresh"
          color="blue"
          >刷新</el-button
        >
      </el-form>

      <el-table :data="k8sInfo.NormalJobList" style="width: 100%">
        <el-table-column prop="name" label="任务名称" />
        <el-table-column prop="active" label="运行Pod数" />
        <el-table-column prop="namespace" label="命名空间" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="completionTime" label="结束时间" />
        <el-table-column prop="creationTimestamp" label="创建时间" />
        <!-- <el-table-column fixed="right" label="操作" min-width="120">
              <template #default>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleClickAction"
                >
                  详情
                </el-button>
                <el-button link type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column> -->
      </el-table>
      <div
        v-if="k8sInfo.NormalJobList.length > 0"
        class="example-pagination-block"
      >
        <el-pagination
          layout="total, prev, pager, next"
          :page-size="10"
          :total="k8sInfo.NormalJobList.length"
        />
      </div>
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

const store = useStore();

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

const updateNormalJobListIsLoading = ref(false);

// 初始化时载入updateKubeconfig
// send2ipc("updateKubeconfig", "");

const updateNormalJobList = () => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  if (updateNormalJobListIsLoading.value) {
    return;
  }
  updateNormalJobListIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updateNormalJobListIsLoading.value = false;
  }, 60000);
  send2ipc("getNormalJobList", "");
};

updateNormalJobList();

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);
  // console.log("method", method);
  // console.log("params", params);

  switch (method) {
    case "getNormalJobList": {
      // console.log("params.response.body", params.response.body.items[0]);
      const names = params.response.body.items.map((item: any) => {
        // console.log("item", item);
        return {
          name: item.metadata.name,
          creationTimestamp: item.metadata.creationTimestamp,
          active: item.status.active || "0",
          uid: item.metadata.uid,
          namespace: item.metadata.namespace,
          startTime: item.status.startTime,
          completionTime: item.status.completionTime || "--",
        };
      });
      names.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      k8sInfo.NormalJobList = names;
      ElMessage.success("更新成功");
      updateNormalJobListIsLoading.value = false;

      break;
    }
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
  name: "NormalJobList",
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