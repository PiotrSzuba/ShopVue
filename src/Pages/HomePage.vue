<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { CircleSpinner } from 'src/components/Common';
import { ItemCard } from 'src/components';
import { useHomePageStore } from 'src/Stores';
import type { IItem } from 'src/Types';

const homeStore = useHomePageStore();
const { getItems } = homeStore;
const { itemsLoading } = storeToRefs(homeStore);
const items = ref<IItem[]>([]);

onMounted(async () => {
	items.value = await getItems();
});
</script>

<template>
  <div class="page">
    <div
      v-if="(items.length && !itemsLoading)"
      class="mainGrid"
    >
      <div
        v-for="item in items"
        :key="item.name"
        class="min-h-[50%] w-full flex"
      >
        <ItemCard :item="item" />
      </div>
    </div>
    <div
      v-else-if="(!items.length && !itemsLoading)"
      class="drop-shadow-xl bg-white py-8 flex"
    >
      <div class="mx-auto font-semibold text-lg">
        No Items available
      </div>
    </div>
    <div
      v-else-if="itemsLoading"
      class="flex mt-[20%]"
    >
      <div class="h-[5rem] w-[5rem] mx-auto my-auto">
        <CircleSpinner />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .mainGrid{
    @apply m-auto grid xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 place-items-center gap-4
  }
</style>
