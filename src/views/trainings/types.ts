export interface TrainingModel {
  name: string;
  version: string;
  modelFamily: string;
  trainingMethod: string;
  fineTuningMethod: string;
  modelName: string;
  imageUrl: string;
  command: string;
  env: string;
  modelFamilies: string[];
  trainingMethods: string[];
  fineTuningMethods: string[];
  modelNames: string[];
  preinstallVersions: string[];
  source: string;
  path: string;
  infos: any;
  versions: any;
  modelConvertNames: string[];
  modelConvertName: string;
  modelConvertInfo: any;
  modelConvertSource: string;
  modelConvertSources: string[];
  modelConvertTarget: string;
  modelConvertTargets: string[];
  filePath: string;
  envs: string;
  yaml?: string;
}

// 菜单项的类型接口
interface MenuItem {
  index: string;
  title: string;
  icon?: string; // 图标，可选属性
}

// 子菜单数组类型接口
interface SubMenuItem extends MenuItem {
  index: string;
  title: string;
  items: MenuItem[];
}

// 菜单数组类型接口
interface MenuList {
  index: string;
  title: string;
  icon?: string; // 图标，可选属性
  items: MenuItem[]; // 子菜单
  subMenus?: SubMenuItem[]; // 存在无限层级可能的话可以使用递归类型, 这里注释掉了
}

// 菜单实例类型接口
interface MenusInstance {
  defaultOpeneds: string[]; // 默认打开的菜单项索引数组
  defaultActive: string; // 当前活跃的菜单项索引
  items: MenuList[]; // 菜单项列表
}

export const MenusInstance: MenusInstance = {
  defaultOpeneds: ['1'],
  defaultActive: "training",
  items: [
    {
      index: "1",
      title: "训练加速",
      icon: "Cellphone",
      items: [
        {
          index: "training",
          title: "训练参数"
        },
        {
          index: "preprocess",
          title: "数据预处理"
        },
        {
          index: "convert",
          title: "模型转换"
        },
        // {
        //   index: "1-4",
        //   title: "并行策略搜索"
        // }
      ],
      subMenus: [
        // {
        //   index: "1-4",
        //   title: "加速工具",
        //   items: [
        //     {
        //       index: "1-4-1",
        //       title: "并行策略搜索"
        //     }
        //   ]
        // }
      ]
    },
    {
      index: "2",
      title: "工具箱",
      icon: "Tools",
      items: [
        {
          index: "devmachine",
          title: "开发机部署"
        },
        {
          index: "3-2",
          title: "训练模板"
        },
      ],
      // subMenus: [
      //   {
      //     index: "kubernetesInfo",
      //     title: "集群",
      //     items: [
      //       {
      //         index: "1-4-1",
      //         title: "并行策略搜索"
      //       }
      //     ]
      //   }
      // ]
    },
    {
      index: "4",
      title: "集群",
      icon: "UploadFilled",
      items: [
        {
          index: "kubernetes",
          title: "创建部署"
        },
        {
          index: "jobList",
          title: "任务列表"
        },
        // {
        //   index: "info",
        //   title: "基本信息"
        // },
        {
          index: "nodeList",
          title: "节点列表"
        },
        // {
        //   index: "namespace",
        //   title: "命名空间"
        // },
      ],
      // subMenus: [
      //   {
      //     index: "kubernetesInfo",
      //     title: "集群",
      //     items: [
      //       {
      //         index: "1-4-1",
      //         title: "并行策略搜索"
      //       }
      //     ]
      //   }
      // ]
    },
    {
      index: "3",
      title: "设置",
      icon: "SetUp",
      items: [
        {
          index: "k8sconfig",
          title: "集群凭证"
        },
        {
          index: "aksk",
          title: "账号密钥"
        }
      ]
    }
  ]
}

export const DefaultRecord: TrainingModel = {
  name: "",
  version: "",
  modelFamily: "",
  trainingMethod: "",
  fineTuningMethod: "sft",
  modelName: "",
  imageUrl: "",
  command: "#! /bin/bash",
  env: "",
  modelConvertName: "",
  modelFamilies: [],
  trainingMethods: [],
  fineTuningMethods: [],
  modelNames: [],
  preinstallVersions: [],
  modelConvertNames: [],
  source: "自定义版本",
  path: "",
  infos: {},
  versions: {},
  modelConvertInfo: {},
  modelConvertSource: "",
  modelConvertSources: [],
  modelConvertTarget: "",
  modelConvertTargets: [],
  filePath: "",
  envs: '',
  yaml: ""
};