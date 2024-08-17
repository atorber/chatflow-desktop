<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>开发机部署</span>
      </div>
    </el-header>

    <el-main>
      <el-form
        :model="form"
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

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="state" label="状态" width="120" />
        <el-table-column prop="city" label="城市" width="120" />
        <el-table-column prop="address" label="地址" width="240" />
        <el-table-column prop="zip" label="航班" width="120" />
        <el-table-column prop="date" label="创建日期" width="150" />
        <el-table-column fixed="right" label="操作" min-width="120">
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
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
      <script lang="ts" setup>
import { computed, reactive } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore
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

const store = useStore();

const form = reactive({
  name: "",
  state: "",
  city: "",
  address: "",
  date: "",
});

const handleClickAction = (row: any) => {
  console.log(row);
};

const devmachineAdd = () => {
  console.log("devmachineAdd");
};
</script>
      
      <script lang="ts">
export default {
  name: "DevelopmentMachine",
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
      