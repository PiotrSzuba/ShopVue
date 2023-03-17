<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/Stores';

const store = useCartStore();
const { getTotalPrice } = store;
const { cartItems } = storeToRefs(store);

</script>

<template>
  <tr v-if="(cartItems.length > 0)">
    <th />
    <th />
    <th />
    <th />
    <th class="text-xl">
      Total:
    </th>
    <th class="text-xl">
      {{ getTotalPrice() }} zł
    </th>
  </tr>
</template>