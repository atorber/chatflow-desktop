<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>集群凭证</span>
      </div>
    </el-header>

    <el-main>
      <el-form
        label-width="auto"
        style="margin: 10px 0px 10px 0px; text-align: left"
      >
        <el-button @click="devmachineAdd" icon="CirclePlus" color="red"
          >新建</el-button
        >
        &nbsp; &nbsp;
        <!-- 刷新 -->
        <el-button @click="devmachineAdd" icon="Refresh" color="blue"
          >刷新</el-button
        >
      </el-form>

      <el-table :data="k8sconfigData" style="width: 100%">
        <el-table-column type="expand">
          <template #default="">
            <el-form
              :model="k8sRecord"
              label-width="auto"
              style="margin: 20px 10px 20px 10px"
            >
              <el-form-item label="kubeconfig">
                <el-input
                  v-model="k8sRecord.config"
                  type="textarea"
                  rows="25"
                  placeholder="输入kubeconfig"
                />
              </el-form-item>

              <el-row :gutter="48">
                <el-col :span="24">
                  <!-- <el-button type="primary" @click="onSubmit">保存</el-button> -->
                  <el-button color="red" @click="updatek8sConfig"
                    >更新</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="state" label="状态" />
        <el-table-column prop="date" label="创建日期" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleClickAction"
              :disabled="scope.row.state === '在用'"
            >
              激活
            </el-button>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="k8sconfigData.length > 0" class="example-pagination-block">
        <el-pagination
          layout="total, prev, pager, next"
          :page-size="10"
          :total="k8sconfigData.length"
        />
      </div>
    </el-main>
  </el-container>
</template>
    <script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore

const k8sconfigData = [
  {
    date: "2016-05-03",
    name: "hwl-cce-bd/cce-e0isdmib",
    state: "在用",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "ENI-TEST/cce-vrdsn1jv",
    state: "未激活",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "未激活",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "未激活",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
];

const store = useStore();
const k8sRecordStore: any = computed({
  get: () => store.getters.k8sRecord,
  set: (value) => store.commit("updateK8sRecord", value),
});
const k8sRecord = k8sRecordStore.value;

const devmachineAdd = () => {
  console.log("add");
};

const updatek8sConfig = (k8sconfig: string) => {
  console.log("updatek8sConfig k8sconfig", k8sconfig);
  send2ipc("updateKubeconfig", k8sRecord.config);
};

const handleClickAction = (value: any) => {
  console.log("click", value);
};

// 发送消息
function send2ipc(method: string, params: string | object) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}
</script>
    
    <script lang="ts">
export default {
  name: "ClusterCredentials",
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
    