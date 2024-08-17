<template>
  <el-container
    class="layout-container-demo"
    style="width: 1200px; height: 100%; min-height: 800px"
  >
    <el-aside width="200px">
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

    <el-container v-else-if="menuName == 'files'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>文件管理</span>
        </div>
      </el-header>

      <el-main>
        <el-form
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

    <FileStorage v-else-if="menuName == 'files1'" />

    <DevelopmentMachine v-else-if="menuName == 'devmachine'" />

    <!-- 集群 -->
    <el-container v-else-if="menuName == 'kubernetes'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <!-- <el-dropdown>
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
          <span>Tom</span> -->
          <span>创建部署</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->

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

    <el-container v-else-if="menuName == 'appList'">
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
          <div>
            预置系统AIAK GPU Pod，用于数据预处理、模型转换等自定义任务。
          </div>
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

    <el-container v-else-if="menuName == 'nodeList'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>节点列表</span>
        </div>
      </el-header>

      <el-main>
        <el-form
          :model="k8sInfo.NodeList"
          label-width="auto"
          style="margin: 10px 0px 10px 0px; text-align: left"
        >
          <!-- 刷新 -->
          <el-button
            :loading="updateNodeListIsLoading"
            @click="updateNodeList"
            icon="Refresh"
            color="blue"
            >刷新</el-button
          >
        </el-form>

        <el-table :data="k8sInfo.NodeList" style="width: 100%">
          <el-table-column prop="name" label="节点名称" />
          <el-table-column prop="uid" label="ID" />
          <el-table-column prop="osImage" label="操作系统" />
          <el-table-column prop="architecture" label="架构" />
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
          v-if="k8sInfo.NodeList.length > 0"
          class="example-pagination-block"
        >
          <el-pagination
            layout="total, prev, pager, next"
            :page-size="10"
            :total="k8sInfo.NodeList.length"
          />
        </div>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'jobList'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>训练任务</span>
        </div>
      </el-header>

      <el-main>
        <el-form
          :model="k8sInfo.PyTorchJobList"
          label-width="auto"
          style="margin: 10px 0px 10px 0px; text-align: left"
        >
          <!-- 刷新 -->
          <el-button
            :loading="updatePyTorchJobListIsLoading"
            @click="updatePyTorchJobList"
            icon="Refresh"
            color="blue"
            >刷新</el-button
          >
        </el-form>

        <el-table :data="k8sInfo.PyTorchJobList" style="width: 100%">
          <el-table-column prop="name" label="任务名称" />
          <!-- <el-table-column prop="uid" label="ID" /> -->
          <el-table-column prop="kind" label="类型" />
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
          v-if="k8sInfo.PyTorchJobList.length > 0"
          class="example-pagination-block"
        >
          <el-pagination
            layout="total, prev, pager, next"
            :page-size="10"
            :total="k8sInfo.PyTorchJobList.length"
          />
        </div>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'normalJobList'">
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

    <el-container v-else-if="menuName == 'podList'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>容器组</span>
        </div>
      </el-header>

      <el-main>
        <el-form
          :model="k8sInfo.PodList"
          label-width="auto"
          style="margin: 10px 0px 10px 0px; text-align: left"
        >
          <!-- 刷新 -->
          <el-button
            :loading="updatePodListIsLoading"
            @click="updatePodList"
            icon="Refresh"
            color="blue"
            >刷新</el-button
          >
        </el-form>

        <el-table v-if="false" :data="k8sInfo.PodList" style="width: 100%">
          <el-table-column prop="name" label="任务名称" />
          <el-table-column prop="active" label="运行状态" />
          <el-table-column prop="namespace" label="命名空间" />
          <el-table-column prop="startTime" label="开始时间" />
          <!-- <el-table-column prop="completionTime" label="结束时间" /> -->
          <el-table-column prop="creationTimestamp" label="创建时间" />
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleClickAction"
              >
                目录
              </el-button>
              <!-- <el-button link type="primary" size="small">编辑</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="k8sInfo.PodList" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                <p m="t-0 b-2">name: {{ props.row.name }}</p>
                <p m="t-0 b-2">active: {{ props.row.active }}</p>
                <p m="t-0 b-2">namespace: {{ props.row.namespace }}</p>
                <p m="t-0 b-2">startTime: {{ props.row.startTime }}</p>
                <h3>Family</h3>
                <el-table :data="props.row.family">
                  <el-table-column prop="name" label="任务名称" />
                  <el-table-column prop="active" label="运行状态" />
                  <el-table-column prop="namespace" label="命名空间" />
                  <el-table-column prop="startTime" label="开始时间" />
                  <!-- <el-table-column prop="completionTime" label="结束时间" /> -->
                  <el-table-column prop="creationTimestamp" label="创建时间" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称" />
          <el-table-column prop="active" label="运行状态" />
          <el-table-column prop="namespace" label="命名空间" />
          <el-table-column prop="startTime" label="开始时间" />
          <!-- <el-table-column prop="completionTime" label="结束时间" /> -->
          <el-table-column prop="creationTimestamp" label="创建时间" />
        </el-table>

        <div v-if="k8sInfo.PodList.length > 0" class="example-pagination-block">
          <el-pagination
            layout="total, prev, pager, next"
            :page-size="10"
            :total="k8sInfo.PodList.length"
          />
        </div>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'namespaceList'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>命名空间</span>
        </div>
      </el-header>

      <el-main>
        <el-form
          :model="k8sInfo.NamespaceList"
          label-width="auto"
          style="margin: 10px 0px 10px 0px; text-align: left"
        >
          <!-- 刷新 -->
          <el-button
            :loading="updateNamespaceListIsLoading"
            @click="updateNamespaceList"
            icon="Refresh"
            color="blue"
            >刷新</el-button
          >
        </el-form>

        <el-table :data="k8sInfo.NamespaceList" style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="active" label="状态" />
          <el-table-column prop="tags" label="标签" />
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
          v-if="k8sInfo.NamespaceList.length > 0"
          class="example-pagination-block"
        >
          <el-pagination
            layout="total, prev, pager, next"
            :page-size="10"
            :total="k8sInfo.NamespaceList.length"
          />
        </div>
      </el-main>
    </el-container>

    <!-- 设置 -->
    <ClusterCredentials v-else-if="menuName == 'k8sconfig'" />
    <Backup v-else-if="menuName == 'backup'" />
    <AccountKey v-else-if="menuName == 'aksk'" />

    <!-- 其他 -->
    <el-container v-else>
      <!-- <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>数据预处理</span>
        </div>
      </el-header> -->

      <el-main>
        <el-empty description="Coming soon ..." />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
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

import { reactive, computed } from "vue";
import { useStore } from "../store"; // 确保从 vuex 导入 useStore

import {
  MenusInstance,
  k8sActions,
  k8sActionsData,
} from "./types.js";
import {
  // UploadRawFile,
  ElMessage,
} from "element-plus";

import { yamlCreate } from "./trainings/yamlCreate.js";
import { go2copy } from "../utils.js";

import type Node from "element-plus/es/components/tree/src/model/node";

const store = useStore();

defineProps<{ msg: string }>();

/*树形结构数据*/
interface Tree {
  name: string;
  leaf?: boolean;
}

const filesProps = {
  label: "name",
  children: "zones",
  isLeaf: "leaf",
};

const cpuPod = ref({ status: { phase: "" }, metadata: { name: "" } });

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

const showFiles = ref(true);
const updatePage = () => {
  showFiles.value = false;
  setTimeout(() => {
    showFiles.value = true;
  }, 100);
};

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

const menus = ref(MenusInstance);

const menuName = ref("0");

const k8sInfo = reactive({
  NodeList: [],
  PyTorchJobList: [],
  NormalJobList: [],
  PodList: [],
  NamespaceList: [],
});

const updateNodeListIsLoading = ref(false);
const updatePyTorchJobListIsLoading = ref(false);
const updateNormalJobListIsLoading = ref(false);
const updatePodListIsLoading = ref(false);
const updateFilesIsLoading = ref(false);
const updateNamespaceListIsLoading = ref(false);

// 初始化时载入updateKubeconfig
send2ipc("updateKubeconfig", "");
send2ipc("getSystemPod", "");

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

const updateNamespaceList = () => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  if (updateNamespaceListIsLoading.value) {
    return;
  }
  updateNamespaceListIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updateNamespaceListIsLoading.value = false;
  }, 60000);
  send2ipc("getNamespaceList", "");
};

const updateNodeList = () => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }

  if (updateNodeListIsLoading.value) {
    return;
  }
  updateNodeListIsLoading.value = true;
  // const loadingInstance = ElLoading.service({ fullscreen: true });
  // loadingInstance.close();

  // 计时60s，超时则重置loading
  setTimeout(() => {
    updateNodeListIsLoading.value = false;
  }, 60000);

  // 请求中
  send2ipc("listNodes", "");
};

const updatePyTorchJobList = () => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  if (updatePyTorchJobListIsLoading.value) {
    return;
  }
  updatePyTorchJobListIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updatePyTorchJobListIsLoading.value = false;
  }, 60000);
  send2ipc("getPytorchJobList", "");
};

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

const updatePodList = () => {
  if (k8sRecord.config === "") {
    ElMessage.error("请先更新Kubeconfig");
    return;
  }
  if (updatePodListIsLoading.value) {
    return;
  }
  updatePodListIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updatePodListIsLoading.value = false;
  }, 60000);
  send2ipc("getNamespacePods", "default");
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
  send2ipc("updateFiles", { podName: cpuPod.value.metadata.name, path });
};

// 切换菜单
function handleMenuSelect(index: string) {
  // console.log("index", index);
  menuName.value = index;
  // console.log("menuName", menuName.value);
  // handleModelFamily(form.modelFamily);

  if (index === "jobList" && k8sInfo.PyTorchJobList.length === 0) {
    updatePyTorchJobList();
  }

  if (index === "normalJobList" && k8sInfo.NormalJobList.length === 0) {
    updateNormalJobList();
  }

  if (index === "nodeList" && k8sInfo.NodeList.length === 0) {
    updateNodeList();
  }

  if (index === "namespaceList" && k8sInfo.NamespaceList.length === 0) {
    updateNamespaceList();
  }

  if (index === "podList" && k8sInfo.PodList.length === 0) {
    updatePodList();
  }

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
    case "getNamespaceList": {
      const names = params.response.body.items.map((item: any) => {
        // console.log("item", item);
        let tags: any[] = [];
        if (item.metadata.labels) {
          tags = Object.keys(item.metadata.labels).map((label: any) => {
            return label + ":" + item.metadata.labels[label];
          });
        }
        return {
          name: item.metadata.name,
          creationTimestamp: item.metadata.creationTimestamp,
          active: item.status.phase,
          tags: tags.join("\n"),
        };
      });
      names.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      k8sInfo.NamespaceList = names;
      ElMessage.success("更新成功");
      updateNamespaceListIsLoading.value = false;
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
    case "getPytorchJobList": {
      // console.log("params.response.body", params.response.body.items[0]);
      const names = params.response.body.items.map((item: any) => {
        // console.log("item", item);
        return {
          name: item.metadata.name,
          creationTimestamp: item.metadata.creationTimestamp,
          kind: item.kind,
          uid: item.metadata.uid,
          namespace: item.metadata.namespace,
          startTime: item.status.startTime,
          completionTime: item.status.completionTime,
        };
      });
      names.sort((a: any, b: any) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      k8sInfo.PyTorchJobList = names;
      ElMessage.success("更新成功");
      updatePyTorchJobListIsLoading.value = false;

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