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
    envs:string;
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

export const MenusInstance:MenusInstance = {
    defaultOpeneds: ['1'],
    defaultActive: "training",
    items: [
      {
        index: "1",
        title: "训练加速",
        icon: "SetUp",
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
          {
            index: "1-4",
            title: "并行策略搜索"
          }
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
        title: "推理引擎",
        icon: "Cellphone",
        items: [
          {
            index: "2-1",
            title: "推理参数"
          },
          {
            index: "2-2",
            title: "模型量化"
          }
        ]
      },
      {
        index: "3",
        title: "工具箱",
        icon: "Cellphone",
        items: [
          {
            index: "3-1",
            title: "开发机部署"
          },
          {
            index: "3-2",
            title: "训练模板"
          },
          {
            index: "kubernetes",
            title: "集群操作"
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
    envs:'',
    yaml: ""
  };