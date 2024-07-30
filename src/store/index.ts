// src/store/index.ts
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { InjectionKey } from 'vue'

interface State {
    cities: string[];
    checkedCities: string[];
}

const state: State = {
    cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'],
    checkedCities: ['Shanghai', 'Beijing']
};

const mutations = {
    updateCheckedCities(state: State, checkedCities: string[]) {
        state.checkedCities = checkedCities;
    }
};

const getters = {
    cities: (state: State) => state.cities,
    checkedCities: (state: State) => state.checkedCities
};

const actions = {}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

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