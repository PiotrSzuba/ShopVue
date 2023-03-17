<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useCartStore } from 'src/Stores';

const store = useCartStore();
const { basketPopupVisible } = storeToRefs(store);
</script>

<template>
  <div
    v-if="basketPopupVisible"
    class="fixed bg-white border-2 top-[20%] right-0 p-8 rounded-l-xl border-r-transparent shadow-2xl flex z-20"
  >
    <div class="my-auto">
      Product added to basket
    </div>
    <div class="ml-4 bg-black text-white rounded-2xl px-3 py-1">
      <RouterLink to="/cart">
        View basket
      </RouterLink>
    </div>
  </div>
</template>