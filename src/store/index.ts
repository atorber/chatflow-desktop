// src/store/index.ts
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { InjectionKey } from 'vue'

import {
    TrainingModel,
    MenusInstance,
    DefaultRecord,
    DefaultTrainingParams,
    tableData,
    k8sconfigData,
    k8sActions,
    k8sActionsData,
} from '../views/types'

interface State {
    cities: string[];
    checkedCities: string[];
    record?: TrainingModel;
    k8sRecord?: {
        config: string
    };
}

const state: State = {
    cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'],
    checkedCities: ['Shanghai', 'Beijing'],
    record: DefaultRecord,
    k8sRecord: {
        config: '',
    }
};

const mutations = {
    updateCheckedCities(state: State, checkedCities: string[]) {
        state.checkedCities = checkedCities;
    },
    updateRecord(state: State, record: TrainingModel) {
        state.record = record;
    },
    updateK8sRecord(state: State, k8sRecord: { config: string }) {
        state.k8sRecord = k8sRecord;
    },
};

const getters = {
    cities: (state: State) => state.cities,
    checkedCities: (state: State) => state.checkedCities,
    record: (state: State) => state.record,
    k8sRecord: (state: State) => state.k8sRecord,
};

const actions = {}

// 定义 injection key
export const key: any = Symbol() as any;

export const store = createStore({
    state,
    mutations,
    getters,
    actions,
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
    return baseUseStore(key)
}
