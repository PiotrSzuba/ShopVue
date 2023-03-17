<script setup lang="ts">
import { ref } from 'vue';

const draggable = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const startPosition = ref({ x: 0, y: 0 });
const currentPosition = ref({ x: 0, y: 0 });

const startDragging = (event: MouseEvent) => {
	isDragging.value = true;
	startPosition.value = { x: event.clientX, y: event.clientY };
};

const drag = (event: MouseEvent) => {
	if (!isDragging.value || !draggable.value) return;

	currentPosition.value = { x: event.clientX, y: event.clientY };
	const deltaX = currentPosition.value.x - startPosition.value.x;
	const deltaY = currentPosition.value.y - startPosition.value.y;
	draggable.value.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
};

const stopDragging = () => {
	if (!draggable.value) return;
	isDragging.value = false;
	draggable.value.style.transform = '';
};

</script>

<template>
  <div
    ref="draggable"
    @mousedown="startDragging"
    @mousemove="drag"
    @mouseup="stopDragging"
  >
    Drag me
  </div>
</template>