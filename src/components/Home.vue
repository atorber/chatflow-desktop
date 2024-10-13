<template>
  <el-container class="layout-container-demo" style="height: 750px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu @select="handleSelect">
          <el-menu-item index="0">
            <el-icon><House /></el-icon>
            <span>登录</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><User /></el-icon>通讯录
            </template>
            <el-menu-item index="2-1">好友</el-menu-item>
            <el-menu-item index="2-2">群</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>自动化
            </template>
            <el-menu-item index="1-1">定时提醒</el-menu-item>
            <el-menu-item index="1-2">群发消息</el-menu-item>
            <el-menu-item index="1-3">聊天机器人</el-menu-item>
            <el-menu-item index="1-4">自动问答</el-menu-item>
            <el-menu-item index="1-5">关键词</el-menu-item>
            <el-menu-item index="1-6">白名单</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>设置
            </template>
            <el-menu-item index="3-1">基本信息</el-menu-item>
            <el-menu-item index="3-2">秘钥</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container v-if="info == '1-1'" style="min-width: 960px">
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
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
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>

    <HelloWorld
      style="min-width: 960px"
      v-else-if="info == '0'"
      msg="ChatFLow Starter"
    />

    <el-container v-else style="min-width: 960px">
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
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
          <span>Tom</span>
        </div>
      </el-header>

      <el-main>
        <!-- Coming soon... -->
        <div>
          <h3 style="color: #000">{{ info }} Coming soon...</h3>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import HelloWorld from "./HelloWorld.vue";
import { ref } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";

const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({ length: 20 }).fill(item));

const info = ref("0");
const handleSelect = (index: string) => {
  console.log(index);
  info.value = index;
};
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
  background: #fff;
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
</style>
