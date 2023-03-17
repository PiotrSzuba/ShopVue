<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon, NumberPicker } from 'src/components/Common';
import { MdCancelOutlined } from 'oh-vue-icons/icons';
import type { ICartItem } from 'src/Types';
import { useCartStore } from 'src/Stores';

const props = defineProps<{item: ICartItem}>();
const store = useCartStore();
const { deleteFromBasket } = store;

const item = ref<ICartItem | undefined >(undefined);

onMounted(() => item.value = props.item);
</script>

<template>
  <tr
    v-if="item"
    class="border-b-[1px]"
  >
    <th
      class="hover:text-red-600 cursor-pointer w-8"
      @click="() => deleteFromBasket(item)"
    >
      <Icon 
        :src="MdCancelOutlined" 
        class="w-5 h-5"
      />
    </th>
    <th>
      <img
        :src="item.previewImage"
        class="mx-auto w-20"
      >
    </th>
    <th class="font-normal">
      {{ item.name }}
    </th>
    <th class="font-normal">
      {{ item.price }} zł
    </th>
    <th>
      <div class="flex">
        <div class="mx-auto">
          <NumberPicker v-model="item.quantity" />
        </div>
      </div>
    </th>
    <th class="font-normal">
      {{ item.quantity * item.price }} zł
    </th>
  </tr>
</template>