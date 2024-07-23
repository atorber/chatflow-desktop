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
          @select="handleSelect"
          @click="handleClick"
        >
          <template v-for="menu in menus.items" :key="menu.index">
            <el-sub-menu :index="menu.index">
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
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container v-if="menuName == 'training'">
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
          <span>训练任务参数</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->
        <el-form :model="form" label-width="auto" style="margin: 10px">
          <el-descriptions title="模型信息" column="3" size="large" border>
          </el-descriptions>
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="镜像源">
                <el-radio-group v-model="form.source" @change="handleSource">
                  <el-radio value="预置版本">预置版本</el-radio>
                  <el-radio value="自定义版本">自定义版本</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-alert
            v-if="form.source === '自定义版本'"
            title="在examples目录中创建version.txt文件并增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
            type="warning"
          />

          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="镜像版本">
                <el-select
                  v-model="form.version"
                  placeholder="选择镜像版本"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.source === '自定义版本'">
              <el-form-item label="文件路径">
                <el-input
                  disabled
                  v-model="form.path"
                  placeholder="脚本存放路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="form.source === '自定义版本'">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :limit="1"
                :on-change="handleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <template #trigger>
                  <el-button type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </el-col>
            <el-col :span="2" v-if="form.source === '自定义版本'">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="在examples目录中创建version.txt文件增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
                placement="top-start"
              >
                <el-icon color="#E6A23C"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="模型系列">
                <el-select
                  v-model="form.modelFamily"
                  placeholder="选择模型系列"
                  @change="handleModelFamily"
                >
                  <el-option
                    v-for="item in form.modelFamilies"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="训练方式">
                <el-select
                  v-model="form.trainingMethod"
                  placeholder="选择训练方式"
                  @change="handleTrainingMethod"
                >
                  <!-- trainingMethods作为选项 -->
                  <el-option
                    v-for="item in form.trainingMethods"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="微调方式"
                v-if="form.trainingMethod === 'finetuning'"
              >
                <el-select
                  v-model="form.fineTuningMethod"
                  placeholder="选择微调方式"
                  @change="handleFineTuningMethod"
                >
                  <!-- fineTuningMethods作为选项 -->
                  <el-option
                    v-for="item in form.fineTuningMethods"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="模型名称">
                <el-select
                  v-model="form.modelName"
                  placeholder="选择模型系列"
                  @change="handleModel"
                >
                  <!-- modelNames作为选项 -->
                  <el-option
                    v-for="item in form.modelNames"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider border-style="dashed">
            <el-tag type="success">训练任务参数信息 {{ form.filePath }}</el-tag>
          </el-divider>

          <el-card class="box-card">
            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="镜像地址">
                  <el-input
                    v-model="form.imageUrl"
                    type="textarea"
                    rows="1"
                    placeholder="选择配置后自动生成"
                    ref="imageUrl"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.imageUrl"
                @click="go2copy(form.imageUrl)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>

            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="执行命令">
                  <el-input
                    v-model="form.command"
                    type="textarea"
                    rows="15"
                    placeholder="选择配置后自动生成"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.command"
                @click="go2copy(form.command)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>

            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="环境变量">
                  <el-input
                    v-model="form.env"
                    type="textarea"
                    rows="5"
                    placeholder="选择配置后自动生成"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="form.env" @click="go2copy(form.env)">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>

          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        <el-divider />
        <el-form :model="form" label-width="auto" style="margin: 10px">
          <el-descriptions title="资源配置" column="3" size="large" border>
          </el-descriptions>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="队列">
                <el-select
                  v-model="form.version"
                  placeholder="选择队列"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优先级">
                <el-select
                  v-model="form.version"
                  placeholder="选择优先级"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="加速卡类型">
                <el-select
                  v-model="form.version"
                  placeholder="选择加速卡型号"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实例数">
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="10"
                  @change="handleNumChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="每实例卡数">
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="10"
                  @change="handleNumChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="22">
              <el-form-item label="PFS挂载路径">
                <el-input
                  v-model="form.name"
                  placeholder="默认路径/mnt/cluster"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="22">
              <el-form-item label="共享内存">
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="10"
                  @change="handleNumChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="RDMA">
            <el-switch :v-model="false" />
          </el-form-item>
          <el-divider border-style="dotted" />
          <el-descriptions title="高级选项" column="3" size="large" border>
          </el-descriptions>
          <el-form-item label="容错">
            <el-switch :v-model="false" />
          </el-form-item>
          <el-form-item label="日志持久化">
            <el-switch :v-model="false" />
          </el-form-item>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="Tensorboard">
                <el-switch model-value="true" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="日志读取路径">
                <el-input
                  v-model="form.name"
                  placeholder="默认路径/mnt/cluster/output/training_logs"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="容器网络类型">
                <el-radio-group v-model="form.source" @change="handleSource">
                  <el-radio value="物理网络">物理网络</el-radio>
                  <el-radio value="容器网络">容器网络</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider border-style="dashed">
            <el-tag type="success">yaml配置信息 {{ form.filePath }}</el-tag>
          </el-divider>
          <el-card class="box-card">
            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="YAML模板">
                  <el-input
                    v-model="form.yaml"
                    type="textarea"
                    rows="15"
                    placeholder="选择配置后自动生成"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="form.yaml" @click="go2copy(form.yaml)">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>
          <el-form-item>
            <el-button type="primary">提交任务</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'convert'">
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
          <span>模型权重转换</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->

        <el-form :model="form" label-width="auto" style="margin: 20px">
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="镜像源">
                <el-radio-group v-model="form.source" @change="handleSource">
                  <el-radio value="预置版本">预置版本</el-radio>
                  <el-radio value="自定义版本">自定义版本</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-alert
            v-if="form.source === '自定义版本'"
            title="在examples目录中创建version.txt文件并增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
            type="warning"
          />

          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="镜像版本">
                <el-select
                  v-model="form.version"
                  placeholder="选择镜像版本"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.source === '自定义版本'">
              <el-form-item label="文件路径">
                <el-input
                  disabled
                  v-model="form.path"
                  placeholder="脚本存放路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="form.source === '自定义版本'">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :limit="1"
                :on-change="handleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <template #trigger>
                  <el-button type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </el-col>
            <el-col :span="2" v-if="form.source === '自定义版本'">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="在examples目录中创建version.txt文件增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
                placement="top-start"
              >
                <el-icon color="#E6A23C"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="模型系列">
                <el-select
                  v-model="form.modelFamily"
                  placeholder="选择模型系列"
                  @change="handleModelFamily"
                >
                  <el-option
                    v-for="item in form.modelFamilies"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模型名称">
                <el-select
                  v-model="form.modelConvertName"
                  placeholder="选择模型系列"
                  @change="handleModelConvert"
                >
                  <!-- modelNames作为选项 -->
                  <el-option
                    v-for="item in form.modelConvertNames"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="原始格式">
                <el-select
                  v-model="form.modelConvertSource"
                  placeholder="请选择原始格式"
                  @change="handleModelConvertSource"
                >
                  <!-- trainingMethods作为选项 -->
                  <el-option
                    v-for="item in form.modelConvertSources"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="目标格式">
                <el-select
                  v-model="form.modelConvertTarget"
                  placeholder="选择目标格式"
                  @change="handleModelConvertTarget"
                >
                  <!-- fineTuningMethods作为选项 -->
                  <el-option
                    v-for="item in form.modelConvertTargets"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider border-style="dashed">
          <el-tag type="success"
            >模型权重转换参数信息 {{ form.filePath }}</el-tag
          >
        </el-divider>

        <el-card class="box-card">
          <el-form :model="form" label-width="auto" style="margin: 20px">
            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="镜像地址">
                  <el-input
                    v-model="form.imageUrl"
                    type="textarea"
                    rows="1"
                    placeholder="选择配置后自动生成"
                    ref="imageUrl"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.imageUrl"
                @click="go2copy(form.imageUrl)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>

            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="执行命令">
                  <el-input
                    v-model="form.command"
                    type="textarea"
                    rows="15"
                    placeholder="选择配置后自动生成"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.command"
                @click="go2copy(form.command)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>
            <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
          </el-form>
        </el-card>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'preprocess'">
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
          <span>数据预处理</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->

        <el-form :model="form" label-width="auto" style="margin: 20px">
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="镜像源">
                <el-radio-group v-model="form.source" @change="handleSource">
                  <el-radio value="预置版本">预置版本</el-radio>
                  <el-radio value="自定义版本">自定义版本</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-alert
            v-if="form.source === '自定义版本'"
            title="在examples目录中创建version.txt文件并增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
            type="warning"
          />

          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="镜像版本">
                <el-select
                  v-model="form.version"
                  placeholder="选择镜像版本"
                  :disabled="form.source === '自定义版本'"
                >
                  <el-option
                    v-for="item in form.preinstallVersions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.source === '自定义版本'">
              <el-form-item label="文件路径">
                <el-input
                  disabled
                  v-model="form.path"
                  placeholder="脚本存放路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="form.source === '自定义版本'">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :limit="1"
                :on-change="handleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <template #trigger>
                  <el-button type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </el-col>
            <el-col :span="2" v-if="form.source === '自定义版本'">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="在examples目录中创建version.txt文件增加一行文本版本信息，格式：version=2.1.0.1，选择examples/version.txt文件"
                placement="top-start"
              >
                <el-icon color="#E6A23C"><InfoFilled /></el-icon>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="8">
              <el-form-item label="模型系列">
                <el-select
                  v-model="form.modelFamily"
                  placeholder="选择模型系列"
                  @change="handleModelFamily"
                >
                  <el-option
                    v-for="item in form.modelFamilies"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="训练方式">
                <el-select
                  v-model="form.trainingMethod"
                  placeholder="选择训练方式"
                  @change="handleTrainingMethod"
                >
                  <!-- trainingMethods作为选项 -->
                  <el-option
                    v-for="item in form.trainingMethods"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="微调方式"
                v-if="form.trainingMethod === 'finetuning'"
              >
                <el-select
                  v-model="form.fineTuningMethod"
                  placeholder="选择微调方式"
                  @change="handleFineTuningMethod"
                >
                  <!-- fineTuningMethods作为选项 -->
                  <el-option
                    v-for="item in form.fineTuningMethods"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-divider border-style="dashed">
          <el-tag type="success"
            >数据预处理任务参数信息 {{ form.filePath }}</el-tag
          >
        </el-divider>

        <el-card class="box-card">
          <el-form :model="form" label-width="auto" style="margin: 20px">
            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="镜像地址">
                  <el-input
                    v-model="form.imageUrl"
                    type="textarea"
                    rows="1"
                    placeholder="选择配置后自动生成"
                    ref="imageUrl"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.imageUrl"
                @click="go2copy(form.imageUrl)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>

            <el-row :gutter="48">
              <el-col :span="22">
                <el-form-item label="执行命令">
                  <el-input
                    v-model="form.command"
                    type="textarea"
                    rows="15"
                    placeholder="选择配置后自动生成"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                v-if="form.command"
                @click="go2copy(form.command)"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="点击复制到剪切板"
                  placement="top-start"
                >
                  <el-icon color="#E6A23C"><CopyDocument /></el-icon>
                </el-tooltip>
              </el-col>
            </el-row>
            <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
          </el-form>
        </el-card>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'devmachine'">
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
          <span>集群操作</span>
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
          <el-form :model="form" label-width="auto" style="margin: 20px">
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
              <el-button link type="primary" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'jobList'">
      <el-header style="text-align: left; font-size: 16px">
        <div class="toolbar">
          <span>任务列表</span>
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
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'k8sconfig'">
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
          <span>集群凭证</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->

        <el-form :model="form" label-width="auto" style="margin: 10px">
          <el-form-item label="k8sconfig">
            <el-input
              v-model="k8sRecord.log"
              type="textarea"
              rows="25"
              placeholder="输入k8sconfig"
            />
          </el-form-item>

          <el-row :gutter="48">
            <el-col :span="24">
              <!-- <el-button type="primary" @click="onSubmit">保存</el-button> -->
              <el-button color="red" @click="handlek8s">更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>

    <el-container v-else-if="menuName == 'aksk'">
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
          <span>账号密钥</span>
        </div>
      </el-header>

      <el-main>
        <!-- <el-tag type="success">任务信息</el-tag> -->

        <el-form :model="form" label-width="auto" style="margin: 10px">
          <el-form-item label="AK">
            <el-input
              v-model="k8sRecord.command"
              type="textarea"
              rows="3"
              placeholder="输入AK"
            />
          </el-form-item>

          <el-form-item label="SK">
            <el-input
              v-model="k8sRecord.command"
              type="textarea"
              rows="3"
              placeholder="输入SK"
            />
          </el-form-item>

          <el-row :gutter="48">
            <el-col :span="24">
              <!-- <el-button type="primary" @click="onSubmit">保存</el-button> -->
              <el-button color="red" @click="handlek8s">更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>

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
// import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { reactive } from "vue";
import { TrainingModel, MenusInstance, DefaultRecord } from "./types.js";
// import { genFileId } from "element-plus";
import {
  UploadInstance,
  UploadProps,
  // UploadRawFile,
  ElMessage,
} from "element-plus";

import { yamlCreate } from "./yamlCreate.js";
import { dataBox } from "js-tool-big-box";
import { ElLoading } from "element-plus";

defineProps<{ msg: string }>();

const num = ref(1);
const handleNumChange = (value: number) => {
  console.log(value);
};

const handleClickAction = () => {
  console.log("click");
};

const devmachineAdd = () => {
  console.log("add");
};

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
];

const k8sActions = [
  {
    id: 4,
    action: "创建PytorchJob",
    res: "",
    command: "",
    placeholder: "输入PytorchJob yaml",
    log: "",
  },
  {
    id: 3,
    action: "创建Job",
    res: "",
    command: "",
    placeholder: "输入Job yaml",
    log: "",
  },
  {
    id: 2,
    action: "创建Deployment",
    res: "",
    command: "",
    placeholder: "输入Deployment yaml",
    log: "",
  },
  // {
  //   id: 0,
  //   action: "获取节点列表",
  //   res: "",
  //   command: "",
  //   log: "",
  // },
  // {
  //   id: 1,
  //   action: "获取PytorchJob列表",
  //   res: "",
  //   command: "",
  //   log: "",
  // },
];

const k8sActionsData = [
  {
    date: "2016-05-02 15:00",
    name: "创建Job",
    state: `apiVersion: v1
data:
  launch.sh: |-
    #! /bin/bash
    `,
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Office",
  },
  {
    date: "2016-05-04 15:00",
    name: "创建Job",
    state: `apiVersion: v1
data:
  launch.sh: |-
    #! /bin/bash
    `,
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
  {
    date: "2016-05-03 15:00",
    name: "创建Deployment",
    state: `apiVersion: v1
data:
  launch.sh: |-
    #! /bin/bash
    `,
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036",
    tag: "Home",
  },
];

let k8sRecord = reactive(JSON.parse(JSON.stringify(k8sActions[0])));

const handleActionChange = (val: string) => {
  console.log("action", val);

  const record: any = k8sActions.find((item) => item.action === val);
  console.log("records", JSON.stringify(record, null, 2));
  k8sRecord.action = record.action;
  k8sRecord.placeholder = record.placeholder || "";
  k8sRecord.command = "";
  console.log("k8sRecord after", JSON.stringify(k8sRecord, null, 2));
};

const upload = ref<UploadInstance>();

const record: TrainingModel = JSON.parse(JSON.stringify(DefaultRecord));

const menus = ref(MenusInstance);

const menuName = ref("training");

// do not use same name with ref
const form = reactive(record);

const k8sInfo = reactive({
  NodeList: [],
  PyTorchJobList: [],
});

const updateNodeListIsLoading = ref(false);
const updatePyTorchJobListIsLoading = ref(false);

// 执行k8s命令
function handlek8s() {
  console.log("handlek8s k8sRecord", JSON.stringify(k8sRecord, null, 2));
  if ((k8sRecord.command && k8sRecord.placeholder) || !k8sRecord.placeholder) {
    send2ipc("k8s", k8sRecord);
  } else {
    ElMessage.error("请输入指令参数");
  }
}

const updateNodeList = () => {
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
  handleActionChange("获取节点列表");
  handlek8s();
};

const updatePyTorchJobList = () => {
  if (updatePyTorchJobListIsLoading.value) {
    return;
  }
  updatePyTorchJobListIsLoading.value = true;
  // 计时60s，超时则重置loading
  setTimeout(() => {
    updatePyTorchJobListIsLoading.value = false;
  }, 60000);
  handleActionChange("获取PytorchJob列表");
  handlek8s();
};

// 切换菜单
function handleSelect(index: string) {
  console.log("index", index);
  menuName.value = index;
  console.log("menuName", menuName.value);
  handleModelFamily(form.modelFamily);
  if (index === "jobList" && k8sInfo.PyTorchJobList.length === 0) {
    updatePyTorchJobList();
  }
  if (index === "nodeList" && k8sInfo.NodeList.length === 0) {
    updateNodeList();
  }
}

// 点击菜单
function handleClick(item: string) {
  console.log("item", item);
}

// 接收消息
window.ipcRenderer.on("send2web", (_event: any, ...args: string[]) => {
  // console.log("[Receive send2web]:", ...args);
  const { method, params } = JSON.parse(args[0]);

  switch (method) {
    case "getPreinstallVersions":
      form.preinstallVersions = params;
      if (form.source === "预置版本") {
        handleImageVersion(params[0]);
      }
      break;
    case "getCustomVersions":
      form.preinstallVersions = params;

      const version = params[0];
      const imageUrl = `registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v${version}_release`;
      form.imageUrl = imageUrl;
      form.version = version;
      send2ipc("listFiles", form.path);
      break;
    case "listFiles":
      form.infos = params;
      setModelFamilies(params);
      break;
    case "k8s":
      k8sRecord.res = JSON.stringify(params, null, 2);

      if (
        params.response &&
        params.response.body &&
        params.response.body.items
      ) {
        console.log("params.response.body", params.response.body.items[0]);
        const names = params.response.body.items.map((item: any) => {
          if (params.response.body.kind === "NodeList") {
            return {
              name: item.metadata.name,
              creationTimestamp: item.metadata.creationTimestamp,
              uid: item.metadata.uid,
              osImage: item.status.nodeInfo.osImage,
              architecture: item.status.nodeInfo.architecture,
            };
          } else if (params.response.body.kind === "PyTorchJobList") {
            return {
              name: item.metadata.name,
              creationTimestamp: item.metadata.creationTimestamp,
              kind: item.kind,
              uid: item.metadata.uid,
              namespace: item.metadata.namespace,
              startTime: item.status.startTime,
              completionTime: item.status.completionTime,
            };
          } else {
            return {
              name: item.metadata.name,
              creationTimestamp: item.metadata.creationTimestamp,
              kind: item.kind,
            };
          }
        });
        names.sort((a: any, b: any) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
        k8sRecord.res = JSON.stringify(names, null, 2);
        if (params.response.body.kind === "NodeList") {
          k8sInfo.NodeList = names;
          ElMessage.success("更新成功");
          updateNodeListIsLoading.value = false;
        }
        if (params.response.body.kind === "PyTorchJobList") {
          k8sInfo.PyTorchJobList = names;
          ElMessage.success("更新成功");
          updatePyTorchJobListIsLoading.value = false;
        }
      }
      break;
    case "updateKubeconfig":
      ElMessage.success("Kubeconfig更新成功");
      k8sRecord.log = JSON.stringify(params, null, 2);
      break;
    case "initError":
      ElMessage.error("初始化失败, 请退出重启程序");
      break;
    default:
      break;
  }
});

// 选择模型系列
function setModelFamilies(params: string[]) {
  form.modelFamilies = Object.keys(params).filter(
    (item: string) => item.indexOf("version.txt") === -1
  );
  handleModelFamily(form.modelFamilies[0]);
}

// 发送消息
function send2ipc(method: string, params: string | object) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}

// 选择文件
const handleChange: any = (uploadFile: any, uploadFiles: any) => {
  console.log("on handleChange", uploadFile);
  const file = uploadFile;
  console.log("file", file.raw);
  if (file.raw.path.indexOf("examples") !== -1 && file.name === "version.txt") {
    form.path = file.raw.path;
    console.log("form.path", form.path);
    send2ipc("getCustomVersions", form.path);
  } else {
    ElMessage.error("请选择正确的文件");
  }
};

// 选择文件
const handleExceed: UploadProps["onExceed"] = (files) => {
  console.log("on exceed", files);
  const file = files[0];
  if (file.name === "version.txt" && file.path.indexOf("examples") !== -1) {
    form.path = file.path;
    send2ipc("getCustomVersions", form.path);
  } else {
    ElMessage.error("请选择正确的文件");
  }
};

// 选择镜像源
function handleSource(val: string | number | boolean | undefined) {
  console.log("source", val);
  form.source = String(val);
  if (val === "预置版本") {
    send2ipc("getPreinstallVersions", "");
    handleImageVersion("");
  } else {
    handleImageVersion("");
  }
}

// 初始化
function init(files: string[]) {
  form.modelFamilies = files;
  handleModelFamily(files[0]);
}

// 选择镜像版本
function handleImageVersion(val: string) {
  const version = String(val);
  form.version = val;

  if (version) {
    form.imageUrl = `registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v${version}_release`;
    send2ipc("listFiles", version);
  } else {
    handleModelFamily("");
  }
}

// 选择模型系列
function handleModelFamily(val: string) {
  form.modelFamily = val;

  if (val) {
    // 读取模型系列目录下的文件夹
    form.trainingMethods = Object.keys(form.infos[val]).filter(
      (item: string) => {
        return item.indexOf("checkpoint_convert") === -1;
      }
    );
    handleTrainingMethod(form.trainingMethods[0]);
    if (menuName.value === "convert") {
      getConverts();
    }
  } else {
    form.modelFamilies = [];
    handleTrainingMethod("");
    handleModelConvert("");
  }
}

function getConverts() {
  const { modelFamily } = form;
  const convertInfo: any = {};
  if (modelFamily && form.infos[modelFamily]["checkpoint_convert"]) {
    const keys = Object.keys(form.infos[modelFamily]["checkpoint_convert"]);
    console.log("keys", keys);
    for (const convert of keys) {
      console.log("convert", convert);
      // const convert = key.split("_")[1] + '_' + key.split("_")[2];

      // 排除megatron_core
      if (convert.indexOf("megatron_core") === -1) {
        const convertArr = convert.split("_");
        const modelName = convertArr[1] + "_" + convertArr[2];
        const source = convertArr[3];
        const target = convertArr[5].split(".")[0];
        if (convertInfo[modelName]) {
          if (convertInfo[modelName][source]) {
            convertInfo[modelName][source].push(target);
          } else {
            convertInfo[modelName][source] = [target];
          }
        } else {
          convertInfo[modelName] = {};
          convertInfo[modelName][source] = [target];
        }
      }
    }

    console.log("convertInfo", JSON.stringify(convertInfo));

    form.modelConvertInfo = convertInfo;
    form.modelConvertNames = Object.keys(convertInfo);

    const defaultModel = form.modelConvertNames[0];
    handleModelConvert(defaultModel);
  } else {
    form.modelConvertInfo = {};
    form.modelConvertNames = [];
    handleModelConvert("");
  }
}

function handleModelConvertSource(val: string) {
  form.modelConvertSource = val;
  if (val) {
    form.modelConvertTargets =
      form.modelConvertInfo[form.modelConvertName][val];
    form.modelConvertTarget = form.modelConvertTargets[0];
    handleModelConvertTarget(form.modelConvertTarget);
  } else {
    handleModelConvert("");
  }
}

function handleModelConvertTarget(val: string) {
  form.modelConvertTarget = val;
  if (val) {
    const filePath = `examples/${form.modelFamily}/checkpoint_convert/convert_${form.modelConvertName}_${form.modelConvertSource}_to_${form.modelConvertTarget}.sh`;
    const command =
      form.infos[form.modelFamily]["checkpoint_convert"][
        `convert_${form.modelConvertName}_${form.modelConvertSource}_to_${form.modelConvertTarget}.sh`
      ];
    form.filePath = filePath;
    handleCommand(command);
  } else {
    clearCommand();
  }
}

function clearCommand() {
  form.command = "";
  form.env = "";
  form.imageUrl = "";
  form.filePath = "";
}

function handleModelConvert(val: string) {
  form.modelConvertName = val;
  if (val) {
    form.modelConvertSources = Object.keys(form.modelConvertInfo[val]);
    handleModelConvertSource(form.modelConvertSources[0]);
  } else {
    clearCommand();
    form.modelConvertNames = [];
    form.modelConvertSources = [];
    form.modelConvertSource = "";
    form.modelConvertTargets = [];
    form.modelConvertTarget = "";
  }
}

// 选择训练方式
function handleTrainingMethod(val: string) {
  const fineTuningMethods: string[] = [];
  form.trainingMethod = val;

  if (val) {
    // 读取训练方式目录下的文件列表
    const files = Object.keys(
      form.infos[form.modelFamily][form.trainingMethod]
    ).filter((item: string) => {
      return item.indexOf("preprocess_data") === -1;
    });
    for (const file of files) {
      const fineTuningMethod = file.split("_")[0];
      if (!fineTuningMethods.includes(fineTuningMethod)) {
        fineTuningMethods.push(fineTuningMethod);
      }
    }
    form.fineTuningMethods = fineTuningMethods;
    handleFineTuningMethod(fineTuningMethods[0]);
  } else {
    form.trainingMethods = [];
    handleFineTuningMethod("");
  }
}

// 选择数据预处理脚本
function handlePreprocessData() {
  const filePath = `examples/${form.modelFamily}/${form.trainingMethod}/preprocess_data.sh`;
  const command =
    form.infos[form.modelFamily][form.trainingMethod]["preprocess_data.sh"];
  form.filePath = filePath;
  handleCommand(command);
}

// 选择微调方法
function handleFineTuningMethod(val: string) {
  form.fineTuningMethod = val;
  if (val) {
    if (menuName.value === "training") {
      handleModelList(form.version);
    }

    if (menuName.value === "preprocess") {
      handlePreprocessData();
    }
  } else {
    form.trainingMethods = [];
    handleModel("");
  }
}

// 选择模型名称
function handleModel(val: string) {
  form.modelName = val;
  if (val) {
    const command = form.infos[form.modelFamily][form.trainingMethod][val];
    const filePath = `examples/${form.modelFamily}/${form.trainingMethod}/${val}`;
    form.filePath = filePath;
    handleCommand(command);
  } else {
    form.modelNames = [];
    clearCommand();
  }
}

function handleCommand(command: string) {
  form.command = command;
  handleEnvList(form.command);
}

// 提取环境变量
function handleEnvList(command: string) {
  // ${DATA_PATH:-"/mnt/cluster/aiak-training-llm/dataset/sft_aplaca_zh_data.json"}
  // 从command中提取出所有的环境变量并赋予默认值，格式：DATA_PATH=/mnt/cluster/aiak-training-llm/dataset/sft_aplaca_zh_data.json
  const envList = command.match(/\${[A-Z_]+:-".*?"}/g);
  let env =
    "#根据实际需求配置修改环境变量，推荐使用示例中的默认路径存放，尽量通过环境变量修改配置而不是直接修改执行命令\n\n";

  let envs = "";
  if (envList) {
    for (const item of envList) {
      const key = item.match(/[A-Z_]+/g);
      const value = item.match(/".*?"/g);
      // console.log('value', value)

      if (key && value) {
        const newValue = value[0].replace(/"/g, "");
        const newKey = key[0];
        env += `${newKey}=${newValue}`;
        switch (newKey) {
          case "MEGATRON_PATH":
            env += " #megatron的代码路径，建议保持默认值";
            break;
          case "AIAK_TRAINING_PATH":
            env += " #AIAK加速训练代码路径，保持默认值";
            break;
          case "DATA_PATH":
            env +=
              " #数据集路径，建议将数据集放在/mnt/cluster/aiak-training-llm/dataset/下，并根据实际修改数据集路径";
            break;
          case "DATASET_CONFIG_PATH":
            env += " #数据集配置文件路径，建议保持默认值";
            break;
          case "DATA_CACHE_PATH":
            env += " #数据缓存路径，建议保持默认值";
            break;
          case "TOKENIZER_PATH":
            env += " #分词器路径，建议保持默认值";
            break;
          case "CHECKPOINT_PATH":
            env += " #checkpoint保存路径，建议保持默认值";
            break;
          case "TENSORBOARD_PATH":
            env += " #tensorboard保存路径，建议保持默认值";
            break;
          case "MASTER_ADDR":
            env += " #master地址，建议保持默认值";
            break;
          case "MASTER_PORT":
            env += " #master端口，建议保持默认值";
            break;
          case "WORLD_SIZE":
            env += " #训练节点数量，建议保持默认值";
            break;
          case "RANK":
            env += " #训练节点编号，建议保持默认值";
            break;
          default:
            break;
        }

        env += "\n";

        envs += `                - name: ${newKey}\n`;
        envs += `                  value: ${newValue}\n`;
      }
    }
  }
  envs =
    "                - name: CUDA_DEVICE_MAX_CONNECTIONS\n                  value: 1";
  env =
    "#根据实际需求配置修改环境变量，推荐使用示例中的默认路径存放，尽量通过环境变量修改配置而不是直接修改执行命令\n\n" +
    "CUDA_DEVICE_MAX_CONNECTIONS=1";

  form.env = env;
  form.envs = envs;

  // 将command的每一行缩进4个空格
  const commandList = command.split("\n");
  let newCommand = "";
  for (const item of commandList) {
    newCommand += `    ${item}\n`;
  }
  const yaml = yamlCreate(newCommand, form.imageUrl, form.envs);
  console.log("yaml demo", yaml);
  form.yaml = yaml;
}

// 计算可选的模型列表
function handleModelList(version: string) {
  const { modelFamily, trainingMethod, fineTuningMethod } = form;
  if (version) {
    const modelList = Object.keys(
      form.infos[modelFamily][trainingMethod]
    ).filter((item: string) => {
      return item.indexOf("preprocess_data") === -1;
    });
    form.modelNames = modelList;
    if (form.trainingMethod) {
      handleModel(modelList[0]);
    }
  } else {
    form.modelNames = [];
    handleModel("");
  }
}

const go2copy = (text: string) => {
  dataBox.copyText(
    text,
    () => {
      ElMessage.success("复制成功");
    },
    () => {
      ElMessage.error("复制失败");
    }
  );
};

function getNamespacePods() {
  send2ipc("getNamespacePods", "");
}

function listNodes() {
  send2ipc("listNodes", "");
}

function updateKubeconfig() {
  send2ipc("updateKubeconfig", "");
}
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
</style>
