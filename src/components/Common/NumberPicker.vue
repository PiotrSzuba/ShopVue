<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from 'src/components/Common';
import { LaAngleUpSolid } from 'oh-vue-icons/icons';

const props = defineProps<{modelValue: number, size?: 'sm' | 'md' | 'lg' | 'xl'}>();

const emit = defineEmits(['update:modelValue']);

const number = ref(0);

const changeUp = () => {
	number.value++;
	emit('update:modelValue', number.value);
};

const changeDown = () => {
	if (number.value <= 1) {
		number.value = 1;
		return;
	}
	number.value--;
	emit('update:modelValue', number.value);
};

onMounted(() => number.value = props.modelValue);

</script>

<template>
  <div class="flex border-[1px] w-[12%] min-w-[80px] pl-4 pr-3 select-none">
    <div class="my-auto text-xl font-normal">
      {{ number }}
    </div>
    <div class="flex flex-col ml-auto my-auto">
      <div
        @click="changeUp"
        class="cursor-pointer text-black mx-auto"
      >
        <Icon
          :src="LaAngleUpSolid"
          class="h-5 w-5"
        />
      </div>
      <div
        @click="changeDown"
        class="cursor-pointer text-black rotate-180 mx-auto"
        :style="{ 'color': number === 1 ? 'rgb(229 231 235)' : 'rgb(0 0 0)'}"
      >
        <Icon
          :src="LaAngleUpSolid"
          class="h-5 w-5"
        />
      </div>
    </div>
  </div>
</template>