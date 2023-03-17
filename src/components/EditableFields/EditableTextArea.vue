<script setup lang="ts">
import { ref, onBeforeMount, onMounted, withDefaults } from 'vue';
import { EditableText } from 'src/components/EditableFields';

const props = withDefaults(defineProps<{
    value: string,
    placeholder: string,
    editable?: boolean,
    title?: string,
}>(), { editable: false, title: '' });

const value = ref('');
const editMode = ref(false);
const input = ref<HTMLTextAreaElement | null>(null);
const inputHidden = ref<HTMLTextAreaElement | null>(null);
const inputHeight = ref(0);

const emit = defineEmits(['update:value', 'update:title']);

const onConfirm = () => {
	if (value.value.length === 0) return;
	editMode.value = false;
	emit('update:value', value.value);
};

const onCancel = () => {
	if (value.value.length === 0) return;
	editMode.value = false;
	value.value = props.value;
};

const resizeTextArea = () => {
	setTimeout(() => {
		if (input.value && inputHidden.value){
			input.value.scrollTop = 0;
			inputHidden.value.style.cssText = 'height:auto;';
			inputHidden.value.style.cssText = 'height:' + inputHidden.value.scrollHeight + 'px;';
			inputHeight.value = inputHidden.value.scrollHeight;
			input.value.focus();
		}
	},0);
};

const onEdit = (force?: boolean) => {
	if (props.editable && force){
		editMode.value = true;
		resizeTextArea();
		return;
	}

	if (!props.editable || force) return;

	editMode.value = true;
	resizeTextArea();
};

const onInput = () => {
	resizeTextArea();
};

const onChangeTitle = (value: string) => {
	emit('update:title', value);
};

const onBlur = () => {
	if (!value.value || value.value.length === 0) return;

	onConfirm();		
};

onBeforeMount(() => {
	value.value = props.value;
    
	if (props.value || !props.editable) return;

	editMode.value = true;
});

onMounted(() => {
	resizeTextArea();
	input.value?.blur();
});

</script>

<template>
  <div class="flex-col w-full">
    <div
      class="w-full font-semibold flex"
      v-if="title || props.editable"
    >
      <EditableText
        placeholder="Enter title"
        :value="title"
        :editable="props.editable"
        :icons="false"
        :on-change="onChangeTitle"
      />
    </div>
    <div
      class="group flex w-full"
      @click="() => onEdit()"
    >
      <div
        v-if="!editMode"
        class="p-2 border-2 border-transparent"
      >
        {{ props.value }}
      </div>
      <div
        v-else-if="editMode"
        class="w-full h-fit relative flex pl-1 pt-1"
      >
        <textarea
          ref="inputHidden"
          v-model="value"
          class="absolute -z-50 invisible editableTextArea top-0"
        />
        <textarea
          ref="input"
          data-role="none"
          v-model="value"
          :placeholder="props.placeholder"
          :style="{ 'height': `${inputHeight + 36}px`}"
          class="p-1 rounded-lg editableTextArea"
          @input="onInput"
          @keyup.esc="onCancel"
          @blur="onBlur"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editableTextArea {
    @apply p-1 rounded-lg border-[2px] focus:border-black transition-all duration-300 w-full overflow-y-hidden box-border
}
</style>