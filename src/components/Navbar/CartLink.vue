<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { Icon } from 'src/components/Common';
import { CoCart } from 'oh-vue-icons/icons';
import { useCartStore } from 'src/Stores';
import { formatDecimal } from 'src/Helpers';

const store = useCartStore();
const { getTotalPrice, getTotalQuantity } = store;
const { cartItems } = storeToRefs(store);
</script>

<template>
  <RouterLink to="/cart">
    <div class="relative flex">
      <Icon
        :src="CoCart"
        class="h-[30px] w-[30px]"
      />
      <div
        v-if="(cartItems.length !== 0)"
        class="absolute flex -top-1 left-4 rounded-full bg-red-600 w-6 h-6 text-xs font-thin text-center my-auto"
      >
        <div class="mx-auto my-auto">
          {{ getTotalQuantity() }}
        </div>
      </div>
      <div class="my-auto z-10 ml-4 text-sm hover:underline">
        {{ formatDecimal(getTotalPrice()) }} zł
      </div>
    </div>
  </RouterLink>
</template>