<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { CartRow, CartHead, CartSummary } from 'src/components/Cart';
import { useCartStore } from 'src/Stores';

const store = useCartStore();
const { cartItems, basketPopupVisible } = storeToRefs(store);

onMounted(() => {
	basketPopupVisible.value = false;
});
</script>

<template>
  <div class="page select-none h-screen">
    <div class="flex h-full">
      <div
        v-if="(cartItems.length === 0)"
        class="flex bg-white w-full drop-shadow-lg text-center font-semibold text-xl  h-[20%]"
      >
        <div class="mx-auto my-auto">
          Your cart is empty
        </div>
      </div>
      <div
        v-else
        class="mx-auto w-full"
      >
        <table class=" min-w-[100%] drop-shadow-lg bg-white">
          <CartHead />
          <CartRow
            v-for="item in cartItems"
            :key="item.name"
            :item="item"
          />
          <CartSummary :items="cartItems" />
        </table>
      </div>
    </div>
    <div class="flex w-full mt-16">
      <div
        class="flex ml-auto bg-black text-gray-300 py-3 rounded-full w-[20%] justify-center
         text-xl hover:text-white cursor-pointer active:ring-2 active:ring-gray-500"
      >
        Buy
      </div>
    </div>
  </div>
</template>

<style>
</style>