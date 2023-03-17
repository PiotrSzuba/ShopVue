<script setup lang="ts">
import { ref, onBeforeMount, withDefaults } from 'vue';
import { formatDecimal } from 'src/Helpers';
import {RiEditLine } from 'oh-vue-icons/icons';
import { Icon } from 'src/components/Common';

const props = withDefaults(defineProps<{
    value: number,
    placeholder: string,
    floating: boolean,
    editable?: boolean,
    suffix?: string,
    min?: number,
    max?: number,
}>(), { 
	editable: false, 
	suffix: '',
	min: Number.MIN_SAFE_INTEGER,
	max: Number.MAX_SAFE_INTEGER
});

const value = ref(0);
const editMode = ref(false);
const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['update:value']);

const onConfirm = () => {
	editMode.value = false;
	emit('update:value', value.value);
};

const onCancel = () => {
	editMode.value = false;
	value.value = props.value;
};

const onEdit = () => {
	if (!props.editable) return;
	editMode.value = true;
  
	setTimeout(() => {
		input.value?.focus();
	}, 1);
};

const onBlur = () => {
	if (value.value === 0) return;

	onConfirm();		
};

onBeforeMount(() => {
	value.value = props.value;

	if (props.value || !props.editable) return;

	editMode.value = true;
});
</script>

<template>
  <div class="group flex w-full">
    <div
      v-if="!editMode"
      class="flex w-full"
    >
      <div
        class="p-1 border-2 border-transparent w-full"
        @click="onEdit"
      >
        {{ formatDecimal(props.value) }} {{ props.suffix }}
      </div>
      <div
        v-if="(props.editable)"
        @click="onEdit"
        class="flex ml-auto my-auto cursor-pointer select-none invisible group-hover:visible hover:text-blue-500"
      >
        <Icon
          :src="RiEditLine"
          class="h-5 w-5"
        />
      </div>
    </div>
    <div
      v-else
      class="flex rounded-lg border-[2px] transition-colors duration-300 w-full focus-within:border-black cursor-text"
    >
      <input
        ref="input"
        type="number"
        class="p-1 w-full rounded-lg"
        :placeholder="props.placeholder"
        v-model.number="value"
        @keyup.enter="onConfirm"
        @keyup.esc="onCancel"
        @input="() => { if(value > props.max || value < props.min) { value = props.min }}"
        @blur="onBlur"
      >
      <div class="my-auto mr-4 text-gray-400">
        {{ props.suffix }}
      </div>
    </div>
  </div>
</template>