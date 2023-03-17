<script setup lang="ts">
import { ref, onBeforeMount, withDefaults } from 'vue';

const props = withDefaults(defineProps<{
    value: string,
    placeholder: string,
    editable?: boolean
    onChange?: (value: string) => void,
}>(), { 
	editable: false, 
	onChange: undefined
});

const editMode = ref(false);
const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['update:value']);

const onChange = (event: Event) => {
	const inputElement = event.currentTarget as HTMLInputElement;
	const val = inputElement.value;

	props.onChange ? props.onChange(val) : emit('update:value', val);
};

const onConfirm = () => {
	if (props.value.length === 0) return;
	editMode.value = false;
};

const onEdit = () => {
	if (!props.editable) return;
	editMode.value = true;

	setTimeout(() => {
		input.value?.focus();
	}, 1);
};

const onBlur = () => {
	onConfirm();		
};

onBeforeMount(() => {
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
        {{ props.value }}
      </div>
    </div>
    <div
      v-else
      class="w-full"
    >
      <input
        ref="input"
        :value="props.value"
        :placeholder="props.placeholder"
        class="p-1 rounded-lg border-[2px] focus:border-black transition-colors duration-300 w-full"
        @keyup.enter="onConfirm"
        @keyup.esc="onConfirm"
        @blur="onBlur"
        @input="onChange"
      >
    </div>
  </div>
</template>