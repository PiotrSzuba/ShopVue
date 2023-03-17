<script setup lang="ts">
import { ref, watch } from 'vue';
import { DnDList } from 'src/components/Draggable';

const props = withDefaults(defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dnd: DnDList<any>;
    index: number;
    disabled?: boolean;
}>(), {
	disabled: false,
});

const element = ref<HTMLElement | null>(null);
const state = ref(-1);

const getItem = () => {
	return props.dnd.itemsList[props.index];
};

const checkIfItemIsOver = () => {
	return (props.dnd.draggedIndex === props.index && props.dnd.draggedOverIndex !== -1) || 
        props.dnd.draggedOverIndex === props.index && props.dnd.itemsList[props.index].value;
};

watch(element, () => {
	if(!element.value) return;
	props.dnd.setRef(element.value, props.index);
});

watch(props.dnd, () => {
	if(!element.value || props.dnd.draggedIndex === state.value) return;
	props.dnd.setRef(element.value, props.index);
	state.value = props.dnd.draggedIndex;
});
</script>

<template>
  <div
    ref="element"
    class="border border-transparent"
    :style="{ 'transform': `translate(0, ${getItem().offsetY}px)`}"
    :class="{'opacity-50 transition-opacity': checkIfItemIsOver(),
             'transition-all duration-[300ms]': getItem().offsetY !== 0,
             'select-none': props.disabled || !dnd.onOrderChange,
             'opacity-0 transition-all': getItem()?.deleting }"
    @dragstart="(event) => dnd.onDragStart(event, props.index, element)"
    @dragover="(event) => dnd.onDragOver(event, props.index)"
    @dragend="() => dnd.onDragEnd()"
    @drop="() => dnd.onDrop(props.index, element)"
    :draggable="props.disabled"
  >
    <slot />
  </div>
</template>