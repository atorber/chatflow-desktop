<template>
  <el-container>
    <el-header style="text-align: left; font-size: 16px">
      <div class="toolbar">
        <span>备份与恢复</span>
      </div>
    </el-header>

    <el-main>
      <el-descriptions class="margin-top" :column="1" size="default" border>
        <!-- <template #extra>
          <el-button type="primary">从云端下载</el-button>
          <el-button type="success">立即备份</el-button>
        </template> -->
        <el-descriptions-item label="系统目录">
          <div>/user/system/</div>
          <el-button type="primary" link>查看</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="工作目录">
          <div>/user/choo/</div>
          <el-button type="primary" link>更改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="S3存储桶">
          <div>endpoint:https://aihc-helper.s3.cn-north-1.jdcloud-oss.com</div>
          <div>access_key:AIHC-HELPER-KEY</div>
          <div>secret_key:AIHC-HELPER-SECRET</div>
          <div>region:cn-north-1</div>
          <div>bucket:aihc-helper</div>
          <el-button type="primary" link>更改</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="备份与恢复">
          <el-button type="primary">从云端下载</el-button>
          <el-button type="success">备份到云端</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../../store"; // 确保从 vuex 导入 useStore

const store = useStore();

const cities = computed(() => store.getters.cities);
const checkedCities = computed({
  get: () => store.getters.checkedCities,
  set: (value) => store.commit("updateCheckedCities", value),
});

const updateCheckedCities = (value: string[]) => {
  console.log("updateCheckedCities", value);
  store.commit("updateCheckedCities", value);
};
</script>

<script lang="ts">
export default {
  name: "Backup",
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
