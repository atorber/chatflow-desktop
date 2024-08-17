<template>
  <el-checkbox-group
    v-model="checkedCities"
    :min="1"
    :max="2"
  >
    <el-checkbox v-for="city in cities" :key="city" :label="city">
      {{ city }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "../store"; // 确保从 vuex 导入 useStore

const store = useStore();

const cities = computed(() => store.getters.cities);

const checkedCities = computed({
  get: () => store.getters.checkedCities,
  set: (value) => store.commit("updateCheckedCities", value),
});

// const updateCheckedCities = (value: string[]) => {
//   console.log("updateCheckedCities", value);
//   store.commit("updateCheckedCities", value);
// };
</script>
