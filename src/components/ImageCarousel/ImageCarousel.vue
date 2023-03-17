<script setup lang="ts">
import { ref, withDefaults } from 'vue';
import { LaPlusSolid, MdNophotographyOutlined  } from 'oh-vue-icons/icons';
import { Icon } from 'src/components/Common';
import {default as ImagePicker} from './CarouselImagePicker.vue';


const props = withDefaults(defineProps<{
  editable?: boolean,
  images: string[],
  onImageUpload?: (file: string) => void;
  onImageDelete?: (index: number) => void,
  onOrderChange?: (sourceIndex: number, targetIndex: number) => void,
}>(), {
	editable: false,
	onImageUpload: undefined,
	onImageDelete: undefined,
	onOrderChange: undefined,
});

const activeIndex = ref(0);

const onImageUpload = (event: Event) => {
	if (!props.onImageUpload) return;

	const eventTarget = event.target as HTMLInputElement;
	if (!eventTarget.files) return;

	for (let i = 0; i < eventTarget.files.length; i++) {
		const file = eventTarget.files[i];
		if (!file) continue;

		const reader = new FileReader();

		reader.onload = (e) => {
			const fileData = (e.target as FileReader).result;

			if (fileData && props.onImageUpload) {
				props.onImageUpload(fileData as string);
			}

			setTimeout(() => { 
				activeIndex.value = props.images.length - 1;
			}, 100);
		};

		reader.readAsDataURL(file);
	}
  
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	((event.target as HTMLInputElement).value as any) = null;
};

const onImageDelete = (index: number) => {
	if (!props.onImageDelete) return;

	props.onImageDelete(index);

	if (activeIndex.value !== index || index !== props.images.length - 1) return;

	activeIndex.value = index - 1;
};

const onImageClick = (index: number) => {
	activeIndex.value = index;
};

const onOrderChange = (sourceIndex: number, targetIndex: number) => {
	if (!props.onOrderChange) return;

	props.onOrderChange(sourceIndex, targetIndex);
};
</script>

<template>
  <div class="relative w-full overflow-hidden select-none">
    <div 
      v-for="(image, index) in props.images"
      :key="index"
      class="absolute w-full transition-all duration-300"
      :class="{'translate-x-[100%] transition-all': activeIndex < index, 
               '-translate-x-[100%] transition-all': activeIndex > index}"
    >
      <img
        :src="image"
        class="mx-auto object-cover relative image"
      > 
    </div>
    <img
      v-if="images.length > 0"
      :src="images[activeIndex]"
      class="opacity-0 image border-0"
    >
    <div
      class="h-[40vw]"
      v-if="images.length === 0"
    >
      <input
        v-if="props.editable && props.onImageUpload"
        id="image-carousel"
        type="file"
        accept="image/*"
        :multiple="true"
        class="hidden"
        value=""
        @change="onImageUpload"
      >
      <label
        :class="{'h-full image-input-label': props.editable && props.onImageUpload, 
                 'h-full flex border-2 bg-white text-neutral-300': !props.editable || !props.onImageUpload}"
        for="image-carousel"
      >
        <div class="flex h-full w-full">
          <Icon
            v-if="props.editable && props.onImageUpload"
            :src="LaPlusSolid"
            class="preview-icon"
          />
          <Icon
            v-else
            :src="MdNophotographyOutlined"
            class="preview-icon"
          />
        </div>
      </label>
    </div>
    <ImagePicker
      :editable="props.editable"
      :images="props.images"
      :active-index="activeIndex"
      :on-image-click="onImageClick"
      :on-image-upload="props.onImageUpload ? onImageUpload : undefined"
      :on-image-delete="props.onImageDelete ? onImageDelete : undefined"
      :on-order-change="props.onOrderChange ? onOrderChange : undefined"
    />
  </div>
</template>

<style scoped>
  .image {
    @apply h-[40vw] w-[100vw]
  }

  .preview-icon {
    @apply mx-auto my-auto h-[50%] w-[50%] min-w-[10px] min-h-[10px]
  }

  .image-input-label {
    @apply flex cursor-pointer border-2 bg-white text-neutral-300 hover:border-black
      hover:text-black transition-all drop-shadow-lg active:ring-2 active:ring-neutral-400
  }
</style>
