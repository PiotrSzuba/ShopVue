<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { LaPlusSolid, RiCloseLine } from 'oh-vue-icons/icons';
import { Icon } from 'src/components/Common';
import { EditableText } from 'src/components/EditableFields';
import { DnDList, DraggableItem } from 'src/components/Draggable';

const props = withDefaults(defineProps<{
    values: string[],
    title?: string,
    editable?: boolean,
    icons?: boolean,
    onTitleChange?: (value: string) => void,
    onOptionAdd?: () => void,
    onOptionUpdate?: (value: string, index: number) => void,
    onOptionDelete?: (index: number) => void,
    onOrderChange?: (sourceIndex: number, targetIndex: number) => void,
}>(), {
	title: '',
	editable: false, 
	icons: true,
	onTitleChange: undefined,
	onOptionAdd: undefined,
	onOptionUpdate: undefined,
	onOptionDelete: undefined,
	onOrderChange: undefined,
});

const dnd = ref<DnDList<string>>();

const onTitleChange = (value: string) => {
	if (!props.onTitleChange) return;

	props.onTitleChange(value);
};

const onAddOption = () => {
	if (!props.onOptionAdd || !dnd.value) return;
  
	props.onOptionAdd();
	dnd.value.addItem('');
};

const onOptionChange = (index: number, value: string) => {
	if (!props.onOptionUpdate || !dnd.value) return;

	props.onOptionUpdate(value, index);
	dnd.value.changeItem(value, index);
};

const onOptionDelete = (index: number) => {
	if (!props.onOptionDelete || !dnd.value) return;

	dnd.value.itemsList[index].deleting = true;

	setTimeout(() => {
		if (!props.onOptionDelete || !dnd.value) return;
		dnd.value.deleteItem(index);
		props.onOptionDelete(index);
	}, 150);
};

onBeforeMount(() => {
	dnd.value = new DnDList<string>(props.values, !props.editable, props.onOrderChange);
});
</script>

<template>
  <div class="flex-col w-full">
    <div
      class="group/title w-full font-semibold flex"
      v-if="props.title || props.editable && !!props.onTitleChange"
    >
      <EditableText
        placeholder="Enter text"
        :value="props.title"
        :editable="props.editable && !!props.onTitleChange"
        :on-change="onTitleChange"
      />
      <div
        v-if="props.editable"
        class="close-icon invisible group-hover/title:visible"
      >
        <Icon
          :src="RiCloseLine"
          class="h-5 w-5"
        />
      </div>
    </div>
    <ul
      class="ml-12 list-disc"
      v-if="dnd"
    >
      <li
        class="group/item list-item"
        v-for="(item, index) in dnd.itemsList"
        :key="index"
      >
        <DraggableItem
          :index="index"
          :dnd="dnd"
          :disabled="false"
        >
          <div class="py-[1px] flex">
            <EditableText
              placeholder="Enter text"
              :value="item.value"
              :editable="props.editable && !!props.onOptionUpdate"
              :icons="false"
              :on-change="(val) => onOptionChange(index, val)"
              :draggable="false"
            />
            <div
              v-if="props.editable"
              class="close-icon invisible group-hover/item:visible"
              @click="() => onOptionDelete(index)"
            >
              <Icon
                :src="RiCloseLine"
                class="h-5 w-5"
              />
            </div>
          </div>
        </DraggableItem>
      </li>
      <li v-if="props.onOptionAdd && props.editable">
        <div
          class="border-[1px] text-black hover:text-green-500 border-black w-1/2 
                flex rounded-lg cursor-pointer py-1 active:ring-1 active:ring-gray-500 transition-all"
          @click="onAddOption"
        >
          <div class="my-auto mx-auto">
            <Icon
              :src="LaPlusSolid"
              class="h-5 w-5"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.close-icon {
  @apply my-auto hover:text-red-500 cursor-pointer active:text-red-700 select-none
}
</style>