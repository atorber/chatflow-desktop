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
}

export const MenusInstance = {
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
          }
        ],
        subMenus: [
          {
            index: "1-4",
            title: "工具包",
            items: [
              {
                index: "1-4-1",
                title: "并行策略搜索"
              }
            ]
          }
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
    filePath: ""
  };