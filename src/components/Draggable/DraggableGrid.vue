<script setup lang="ts">
import { ref, useSlots, onMounted, h, VNode, RendererNode, RendererElement } from 'vue';

interface IElement {
	id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	element: VNode<RendererNode, RendererElement, {[key: string]: any}>;
	offsetX: number;
	offsetY: number;
}

const props = defineProps<{
    class: string,
    columns: number,
}>();

const items = ref<IElement[]>([]);
const draggedIndex = ref<number>(-1);
const droppedIn = ref<boolean>(false);
const element = ref<Array<HTMLElement | null>>([]);

const slots = useSlots();

const onDragStart = (index: number) => {
	draggedIndex.value = index;
};

const onDragOver = (event: DragEvent) => {
	event.preventDefault();
};

const onDragEnd = () => {
	if (droppedIn.value) return;
	draggedIndex.value = -1;
};

const onDrop = (index: number) => {
	if (draggedIndex.value < 0 || !element.value.length || !element.value[index]) return;

	let elementWidth = element.value[index]?.offsetWidth;
	let elementHeight = element.value[index]?.offsetHeight;

	if (!elementWidth || !elementHeight) return;

	droppedIn.value = true;

	let xOffset = index - draggedIndex.value;

	if (index < draggedIndex.value) {
		xOffset = -xOffset;
		elementWidth = -elementWidth;
	}

	items.value[index].offsetX = -xOffset * elementWidth;
	items.value[draggedIndex.value].offsetX = xOffset * elementWidth;

	setTimeout(() => {
		items.value[index].offsetX = 0;
		items.value[draggedIndex.value].offsetX = 0;

		const temp = items.value[index];
		items.value[index] = items.value[draggedIndex.value];
		items.value[draggedIndex.value] = temp;

		draggedIndex.value = -1;
		droppedIn.value = false;
	}, 250);
};

onMounted(() => {
	const elements = h('div', {}, slots).children;

	if (!elements || !Array.isArray(elements)) return;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items.value = elements.map((node: any, index: any) => {
		return {
			id: index + 1,
			element: h('div', {}, node.children),
			offsetX: 0,
			offsetY: 0,
		};
	});
});
</script>

<template>
  <div
    :class="props.class"
    :style="{'display': 'grid', 'grid-template-columns': `repeat(${props.columns}, minmax(0, 1fr))` }"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      ref="element"
      :style="{ 'transform': `translate(${item.offsetX}px, ${item.offsetY}px)`}"
      :class="{'opacity-50': draggedIndex === index, 'transition-all duration-300': draggedIndex !== -1 }"
      @dragstart="() => onDragStart(index)"
      @dragover="onDragOver"
      @dragend="onDragEnd"
      @drop="() => onDrop(index)"
      :draggable="true"
    >
      <component :is="item.element" />
    </div>
  </div>
</template>