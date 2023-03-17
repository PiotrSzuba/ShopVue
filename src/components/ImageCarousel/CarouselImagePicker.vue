<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { LaPlusSolid, RiCloseLine } from 'oh-vue-icons/icons';
import { Icon } from 'src/components/Common';

interface IDraggableImage {
	id: number;
	image: string;
	offsetX: number;
	offsetY: number;
}

const props = withDefaults(defineProps<{
  editable?: boolean,
  images: string[],
  activeIndex: number,
  onImageUpload?: (event: Event) => void,
  onImageDelete?: (index: number) => void,
  onImageClick: (index: number) => void,
  onOrderChange?: (sourceIndex: number, targetIndex: number) => void,
}>(), {
	editable: false,
	onImageUpload: undefined,
	onImageDelete: undefined,
	onOrderChange: undefined,
});

const draggedIndex = ref<number>(-1);
const draggedOverIndex = ref<number>(-1);
const droppedIn = ref<boolean>(false);
const element = ref<Array<HTMLElement | null>>([]);
const images = ref<IDraggableImage[]>([]);    


const onDragStart = (index: number) => {
	if (!props.editable || !props.onOrderChange) return;
	draggedIndex.value = index;
};

const onDragOver = (event: DragEvent, index: number) => {
	event.preventDefault();
	if (!props.editable || !props.onOrderChange) return;
	draggedOverIndex.value = index;
};

const onDragEnd = () => {
	if (droppedIn.value) return;
	draggedIndex.value = -1;
	draggedOverIndex.value = -1;
};

const onDrop = (index: number) => {
	if (!props.editable || !props.onOrderChange) return;
	if (draggedIndex.value < 0 || !element.value.length || !element.value[index]) return; 

	let elementWidth = element.value[index]?.offsetWidth;
	let elementHeight = element.value[index]?.offsetHeight;

	if (!elementWidth || !elementHeight) return;

	droppedIn.value = true;
   
	let xOffset = index % 4 - draggedIndex.value % 4;
	let yOffset = Math.floor(index / 4) - Math.floor(draggedIndex.value / 4);

	if (index < draggedIndex.value) {
		xOffset = -xOffset;
		elementWidth = -elementWidth;
		yOffset = -yOffset;
		elementHeight = -elementHeight;
	}

	images.value[index].offsetX = -xOffset * elementWidth;
	images.value[draggedIndex.value].offsetX = xOffset * elementWidth;

	images.value[index].offsetY = -yOffset * elementHeight;
	images.value[draggedIndex.value].offsetY = yOffset * elementHeight;

	draggedOverIndex.value = -1;
    
	setTimeout(() => {
		const temp = images.value[index];
		images.value[index] = images.value[draggedIndex.value];
		images.value[draggedIndex.value] = temp;

		if (props.onOrderChange) {
			props.onOrderChange(index, draggedIndex.value);
		}
		draggedIndex.value = -1;
		droppedIn.value = false;
	}, 100);
};

onMounted(() => {
	images.value = props.images.map<IDraggableImage>((image, index) => {
		return {id: index + 1, image, offsetX: 0, offsetY: 0};
	});
});

watch(props, () => {
	images.value = props.images.map<IDraggableImage>((image, index) => {
		return {id: index + 1, image, offsetX: 0, offsetY: 0};
	});
});

</script>

<template>
  <div
    class="grid grid-cols-4 gap-2 mt-4 pb-4"
    v-if="props.images.length !== 0"
  >
    <div
      v-for="(item, index) in images"
      :key="item.id"
      ref="element"
      class="relative drop-shadow-xl"
      :style="{ 'transform': `translate(${item.offsetX}px, ${item.offsetY}px)`}"
      :class="{'opacity-50 transition-opacity': (draggedIndex === index && draggedOverIndex !== -1) || draggedOverIndex === index,
               'transition-all duration-150': draggedIndex !== -1,
               'select-none': !props.editable || !props.onOrderChange }"
      @dragstart="() => onDragStart(index)"
      @dragover="(event) => onDragOver(event, index)"
      @dragend="onDragEnd"
      @drop="() => onDrop(index)"
      :draggable="props.editable && !!props.onOrderChange"
    >
      <div class="bg-black z-50">
        <img
          :key="index"
          class="transition-all object-cover drop-shadow-lg image-preview w-full"
          :class="{'opacity-100 hover:cursor-default': index === props.activeIndex,
                   'opacity-[.55] hover:opacity-100 hover:cursor-pointer': index !== props.activeIndex}"
          :src="item.image"
          :draggable="false"
          @click="() => props.onImageClick(index)"
        >
      </div>
      <Icon
        v-if="props.editable && props.onImageDelete"
        :src="RiCloseLine"
        class="absolute top-0 right-0 h-[25%] w-[25%] min-w-[5px] min-h-[5px] cursor-pointer text-white hover:text-red-500 active:text-red-800"
        @click="props.onImageDelete ? props.onImageDelete(index) : () => {} "
      />
    </div>
    <input
      v-if="props.onImageUpload"
      id="image-carousel"
      type="file"
      accept="image/*"
      :multiple="true"
      class="hidden"
      value=""
      @change="props.onImageUpload"
    >
    <label
      v-if="props.editable && props.images.length > 0 && props.onImageUpload"
      class="image-input-label"
      :class="{'-z-10': draggedIndex !== -1}"
      for="image-carousel"
    >
      <div class="flex h-full w-full image-preview">
        <Icon
          :src="LaPlusSolid"
          class="add-icon"
        />
      </div>
    </label>
  </div>
</template>

<style scoped>
  .image-preview {
    @apply h-[9vw]
  }
  .image-input-label {
    @apply flex cursor-pointer border-2 bg-white text-neutral-300 hover:border-black 
        hover:text-black transition-all drop-shadow-lg active:ring-2 active:ring-neutral-400
  }
  .add-icon {
    @apply mx-auto my-auto h-[50%] w-[50%] min-w-[10px] min-h-[10px]
  }
</style>