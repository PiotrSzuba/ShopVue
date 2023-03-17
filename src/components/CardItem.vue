<script setup lang="ts">
import type { IItem } from 'src/Types';
import { RouterLink } from 'vue-router';
import { formatDecimal } from 'src/Helpers';

defineProps<{item: IItem}>();
</script>

<template>
  <RouterLink :to="`/item/${item.id}`">
    <div class="flex flex-col w-full h-full mb-4 font-semibold select-none">
      <div class="flex">
        <img
          :src="item.images[0].file"
          class="hover:cursor-pointer mx-auto object-cover h-[35vw] w-[100vw] brightness-90 hover:brightness-100 transition-all"
        >
      </div>
      <div class="text-center mt-4">
        {{ item.name }}
      </div>
      <div className="text-center">
        {{ formatDecimal(item.price) }} zł
      </div>
    </div>
  </RouterLink>
</template>