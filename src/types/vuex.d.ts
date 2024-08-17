declare module 'vuex' {
  import { Store, CommitOptions, DispatchOptions, createStore, useStore } from 'vuex'

  export interface State {
    // 定义您的状态类型
  }

  export type Store<S> = Store<S>
  export { createStore, useStore }
}
