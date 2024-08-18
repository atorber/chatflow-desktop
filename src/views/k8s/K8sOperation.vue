<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>创建部署</span>
      </div>
    </el-header>

    <el-main>
      <el-form :model="k8sRecord" label-width="auto" style="margin: 20px">
        <el-row :gutter="48">
          <el-col :span="8">
            <el-form-item label="操作">
              <el-select
                v-model="k8sRecord.action"
                placeholder="选择操作"
                @change="handleActionChange"
              >
                <el-option
                  v-for="item in k8sActions"
                  :key="item.id"
                  :label="item.action"
                  :value="item.action"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="输入参数" v-if="k8sRecord.placeholder">
          <el-input
            v-model="k8sRecord.command"
            type="textarea"
            rows="10"
            :placeholder="k8sRecord.placeholder"
          />
        </el-form-item>

        <el-row :gutter="48">
          <el-col :span="24">
            <!-- <el-button type="primary" @click="onSubmit">保存</el-button> -->
            <el-button color="red" @click="handlek8s">立即执行</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-divider border-style="dashed">
        <el-tag type="success">执行信息</el-tag>
      </el-divider>
      <el-card class="box-card">
        <el-form label-width="auto" style="margin: 20px">
          <el-form-item label="执行结果">
            <el-input
              v-model="k8sRecord.res"
              type="textarea"
              rows="15"
              placeholder="执行指令后自动生成"
            />
          </el-form-item>
          <el-form-item label="操作日志">
            <el-input
              v-model="k8sRecord.log"
              type="textarea"
              rows="15"
              placeholder="执行指令后自动生成"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <el-table :data="k8sActionsData" style="width: 100%">
        <el-table-column prop="name" label="类别" />
        <el-table-column prop="state" label="输入参数" />
        <el-table-column prop="date" label="创建日期" />
        <el-table-column fixed="right" label="操作">
          <template #default>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleClickAction"
            >
              载入
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleClickAction"
            >
              保存为模板
            </el-button>
            <!-- <el-button link type="primary" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
  
  <script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore

import { k8sActions, k8sActionsData } from "../types.js";
import {
  // UploadRawFile,
  ElMessage,
} from "element-plus";

const store = useStore();

const handleClickAction = (value: any) => {
  console.log("click", value);
};

const k8sRecordStore: any = computed({
  get: () => store.getters.k8sRecord,
  set: (value) => store.commit("updateK8sRecord", value),
});
const k8sRecord = k8sRecordStore.value;
// let k8sRecord = reactive(JSON.parse(JSON.stringify(k8sActions[0])));

const handleActionChange = (val: string) => {
  console.log("action", val);

  const record: any = k8sActions.find((item) => item.action === val);
  // console.log("records", JSON.stringify(record, null, 2));
  k8sRecord.action = record.action;
  k8sRecord.placeholder = record.placeholder || "";
  k8sRecord.command = record.command;
  // console.log("k8sRecord after", JSON.stringify(k8sRecord, null, 2));
};

// 初始化时载入updateKubeconfig
send2ipc("updateKubeconfig", "");

// 执行k8s命令
function handlek8s() {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  // console.log("handlek8s k8sRecord", JSON.stringify(k8sRecord, null, 2));
  if ((k8sRecord.command && k8sRecord.placeholder) || !k8sRecord.placeholder) {
    send2ipc("k8s", k8sRecord);
  } else {
    ElMessage.error("请输入指令参数");
  }
}

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);
  // console.log("method", method);
  // console.log("params", params);

  switch (method) {
    case "k8s":
      k8sRecord.res = JSON.stringify(params, null, 2);
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
  name: "k8sOperation",
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