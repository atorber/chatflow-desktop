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
  items?: MenuItem[]; // 子菜单
  subMenus?: SubMenuItem[]; // 存在无限层级可能的话可以使用递归类型, 这里注释掉了
}

// 菜单实例类型接口
interface MenusInstance {
  defaultOpeneds: string[]; // 默认打开的菜单项索引数组
  defaultActive: string; // 当前活跃的菜单项索引
  items?: MenuList[]; // 菜单项列表
}

export const MenusInstance: MenusInstance = {
  defaultOpeneds: ['0'],
  defaultActive: "0",
  items: [
    {
      index: "0",
      title: "概览",
      icon: "House",
    },
    {
      index: "1",
      title: "训练",
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
        {
          index: "trainingTemplate",
          title: "训练模板"
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
      title: "数据资产",
      icon: "Folder",
      items: [
        {
          index: "models",
          title: "模型权重"
        },
        {
          index: "datasets",
          title: "数据集"
        },
        {
          index: "files",
          title: "文件存储"
        },
        {
          index: "datasource",
          title: "数据来源"
        },
        {
          index: "devmachine",
          title: "开发机"
        },
      ],
    },
    // {
    //   index: "2",
    //   title: "工具箱",
    //   icon: "Tools",
    //   items: [
    //     {
    //       index: "devmachine",
    //       title: "开发机部署"
    //     },
    //     {
    //       index: "3-2",
    //       title: "训练模板"
    //     },
    //   ],
    // },
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
          index: "appList",
          title: "预置应用"
        },
        {
          index: "jobList",
          title: "训练任务"
        },
        {
          index: "normalJobList",
          title: "普通任务"
        },
        {
          index: "podList",
          title: "容器组"
        },
        {
          index: "namespaceList",
          title: "命名空间"
        },
        {
          index: "nodeList",
          title: "节点列表"
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
      index: "3",
      title: "设置",
      icon: "SetUp",
      items: [
        {
          index: "k8sconfig",
          title: "集群凭证"
        },
        {
          index: "backup",
          title: "备份与恢复"
        },
        {
          index: "aksk",
          title: "账号密钥"
        },
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

export const DefaultTrainingParams = {
  gpu: 'baidu.com/a800_80g_cgpu',
  gpus_per_node: 8,
  replicas: 1,
  enableRDMA: false,
  mountPath: '/mnt/cluster',
  datasourceName: 'pfs-xx',
  datasourceType: 'pfs',
  queue: 'default',
  jobFramework: 'PyTorchJob',
  faultTolerance: false,
  priority: 'high',
  datasource: '',
  queues: ['default'],
  jobFrameworks: ['PyTorchJob'],
  priorities: ['high', 'normal', 'low'],
  datasourceTypes: ['pfs', 'hostPath'],
  gpus: ['baidu.com/a800_80g_cgpu'],
}

export const tableData = [
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

export const k8sconfigData = [
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

export const k8sActions = [
  {
    id: 4,
    action: "创建PytorchJob",
    res: "",
    command: "",
    placeholder: "输入PytorchJob yaml",
    log: "",
    config: "",
  },
  {
    id: 3,
    action: "创建Job",
    res: "",
    command: "",
    placeholder: "输入Job yaml",
    log: "",
    config: "",
  },
  {
    id: 2,
    action: "创建Deployment",
    res: "",
    command: "",
    placeholder: "输入Deployment yaml",
    log: "",
    config: "",
  },
];

export const k8sActionsData = [
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