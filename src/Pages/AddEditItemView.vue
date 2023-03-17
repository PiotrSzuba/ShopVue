<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { 
	EditableText,
	EditableList, 
	EditableNumber, 
	EditableTextArea, 
	EditableSinglePicker
} from 'src/components/EditableFields';
import { Icon, NumberPicker } from 'src/components/Common';
import { ImageCarousel } from 'src/components/ImageCarousel';
import { DetailType, IItem, IItemDetailsSection } from 'src/Types';
import { LaTrashAltSolid } from 'oh-vue-icons/icons';
import { DnDList, DraggableItem } from 'src/components/Draggable';
import { itemService } from 'src/Services';
import { useCartStore } from 'src/Stores';

const props = withDefaults(defineProps<{
  editMode?: boolean,
  item?: IItem,
}>(), {
	editMode: true,
	item: undefined,
});

const editMode = ref(true);
const isAdmin = true;

const dnd = ref<DnDList<IItemDetailsSection>>();
const newSectionType = ref<DetailType | undefined>(undefined);
const sectionTypes = [DetailType[0].toString(), DetailType[1].toString(), DetailType[2].toString()];
const count = ref(1);

const item = ref<IItem>({id: '', name: '', price: 0, previewImage: '', details: [], typeName: '', types: [], images: []});

const itemTypePresent = ref(true);
const type = ref('');
const store = useCartStore();
const { addToBasket } = store;

const onSectionOrderChange = (sourceIndex: number, targetIndex: number) => {
	if (!item.value.details) return;
  
	const temp = item.value.details[sourceIndex];
	item.value.details[sourceIndex] = item.value.details[targetIndex];
	item.value.details[targetIndex] = temp;
};

const onChangeSection = (value: string) => {
	newSectionType.value = DetailType[value as keyof typeof DetailType];
};

const addSection = () => {
	if (newSectionType.value === undefined || !item.value.details || !dnd.value) return;
  
	const newVal: IItemDetailsSection = { title: '', type: newSectionType.value, values: [{ order: 0, value: '' }] };
	item.value.details.push(newVal);
	dnd.value.addItem(newVal);
};

const deleteSection = (index: number) => {
	if (!item.value.details || !item.value.details.length || !dnd.value) return;

	dnd.value.itemsList[index].deleting = true;

	setTimeout(() => {
		if (!dnd.value || !item.value.details ) return;
		dnd.value.deleteItem(index);
		item.value.details.splice(index, 1);
	}, 150);
};

const listOptionAdd = (listIndex: number) => {
	if (!item.value.details) return;

	const newOrder = item.value.details[listIndex].values.length;

	item.value.details[listIndex].values.push({order: newOrder, value: ''});
};

const listOptionDelete = (listIndex: number, optionIndex: number) => {
	if (!item.value.details 
      || !item.value.details[listIndex] 
      || item.value.details[listIndex].values.length <= optionIndex
	) return;

	item.value.details[listIndex].values.splice(optionIndex, 1);
};

const listOptionUpdate = (listIndex: number, optionIndex: number, value: string) => {
	if (!item.value.details 
      || !item.value.details[listIndex] 
      || item.value.details[listIndex].values.length <= optionIndex
	) return;

	item.value.details[listIndex].values[optionIndex].value = value;
};

const listTitleChange = (listIndex: number, value: string) => {
	if (!item.value.details 
      || !item.value.details[listIndex] 
	) return;

	item.value.details[listIndex].title = value;
};

const listOptionOrderChange = (listIndex: number, sourceIndex: number, targetIndex: number) => {
	if (!item.value.details 
      || !item.value.details[listIndex] 
	) return;

	const temp = item.value.details[listIndex].values[sourceIndex];
	item.value.details[listIndex].values[sourceIndex] = item.value.details[listIndex].values[targetIndex];
	item.value.details[listIndex].values[targetIndex] = temp;
};

const onImageUpload = (file: string) => {
	item.value.images.push({file});
};

const onImagesOrderChange = (sourceIndex: number, targetIndex: number) => {
	const temp = item.value.images[sourceIndex];
	item.value.images[sourceIndex] = item.value.images[targetIndex];
	item.value.images[targetIndex] = temp;
};

const onImageDelete = (index: number) => {
	item.value.images.splice(index, 1);
};

const onTypeOptionAdd = () => {
	item.value.types.push({id: '', name: '', isInStock: false, discountValue: 0});
};

const onTypeOptionUpdate = (index: number, value: string) => {
	item.value.types[index].name = value;
};

const onTypeOptionDelete = (index: number) => {
	item.value.types.splice(index, 1);
};

const onTypeOptionsOrderChange = (sourceIndex: number, targetIndex: number) => {
	const temp = item.value.types[sourceIndex];
	item.value.types[sourceIndex] = item.value.types[targetIndex];
	item.value.types[targetIndex] = temp;
};

const onDeleteItemType = () => {
	itemTypePresent.value = false;
};

const onSave = () => {
	console.log(item.value);
	itemService.createItem(item.value);
};

onBeforeMount(() => {
	editMode.value = props.editMode;

	if (props.item){
		item.value = props.item;
		itemTypePresent.value = !!item.value.typeName;
	}

	if (!item.value.details) return;
	dnd.value = new DnDList<IItemDetailsSection>(item.value.details, !editMode.value, onSectionOrderChange);
});
</script>

<template>
  <div class="subPage flex mt-[3rem] mb-32 w-full">
    <div class="flex flex-col w-[40%] pr-[5%]">
      <div class="w-[100%] mx-auto">
        <ImageCarousel
          :editable="editMode"
          :images="item.images.map((i) => i.file)"
          :on-image-upload="onImageUpload"
          :on-order-change="onImagesOrderChange"
          :on-image-delete="onImageDelete"
        />
      </div>
    </div>
    <div
      class="flex flex-col w-[60%] ml-auto pl-[5%]"
      v-if="dnd"
    >
      <div class="text-3xl font-semibold text-slate-700">
        <EditableText
          v-model:value="item.name"
          :editable="editMode"
          placeholder="Name"
        />
      </div>
      <div class="text-2xl text-black mt-2">
        <EditableNumber
          v-model:value="item.price"
          :editable="editMode"
          :floating="true"
          :min="0"
          suffix="zł"
          placeholder="Price"
        />
      </div>
      <div
        class="group w-full"
        v-for="(section, index) in dnd.itemsList"
        :key="index"
      >
        <DraggableItem
          :index="index"
          :dnd="dnd"
          :disabled="false"
        >
          <div class="flex w-full mt-4">
            <EditableText
              v-if="section.value.type === DetailType.KeyValue"
              v-model:value="section.value.values[0].value"
              :editable="editMode"
              placeholder="Enter text"
            />
            <EditableTextArea
              v-if="section.value.type === DetailType.Textarea"
              v-model:value="section.value.values[0].value"
              v-model:title="section.value.title"
              :editable="editMode"
              placeholder="Enter text"
            />
            <EditableList
              v-if="section.value.type === DetailType.List"
              :values="section.value.values.map((v) => v.value)"
              :title="section.value.title"
              :editable="editMode"
              :on-title-change="(value) => listTitleChange(index, value)"
              :on-option-add="() => listOptionAdd(index)"
              :on-option-delete="(optionIndex) => listOptionDelete(index, optionIndex)"
              :on-option-update="(value, optionIndex) => listOptionUpdate(index, optionIndex, value)"
              :on-order-change="(sourceIndex, targetIndex) => listOptionOrderChange(index, sourceIndex, targetIndex)"
            />
            <div
              v-if="props.editMode"
              class="my-auto ml-2 hover:text-red-500 cursor-pointer invisible group-hover:visible"
              @click="() => deleteSection(index)"
            >
              <Icon
                :src="LaTrashAltSolid"
                class="h-[20px]"
              />
            </div>
          </div>
        </DraggableItem>
      </div>
      <div
        class="flex w-full mt-4 select-none"
        v-if="editMode"
      >
        <EditableSinglePicker
          default-value="Pick option"
          :options="sectionTypes"
          :default-value-disabled="true"
          :on-change="(value) => onChangeSection(value)"
        />
        <div
          class="flex w-full bg-black ml-auto text-white px-2 rounded-r-full py-2"
          :class="{'bg-neutral-400 hover:text-neutral-300 text-neutral-300 cursor-not-allowed': newSectionType === undefined,
                   'hover:text-green-500 cursor-pointer active:ring-1 active:ring-neutral-800': newSectionType !== undefined}"
          @click="addSection"
        >
          <div class="w-full text-center my-auto">
            Add
          </div>
        </div>
      </div>
      <div
        class="flex group mt-8 w-[13rem]"
        v-if="itemTypePresent"
      >
        <EditableSinglePicker
          :default-value="item.typeName"
          :editable="editMode"
          :options="item.types.map((t) => t.name)"
          :default-value-disabled="true"
          :on-change-default-option="() => {}"
          :on-add-option="onTypeOptionAdd"
          :on-change-option="onTypeOptionUpdate"
          :on-delete-option="onTypeOptionDelete"
          :on-order-change="onTypeOptionsOrderChange"
        />
        <div
          class="my-auto ml-2 hover:text-red-500 cursor-pointer invisible group-hover:visible"
          @click="onDeleteItemType"
        >
          <Icon
            :src="LaTrashAltSolid"
            class="h-[20px]"
          />
        </div>
      </div>
      <div
        v-else-if="editMode"
        class="flex w-[13rem] mt-8 btn-base hover:text-green-500"
        @click="(itemTypePresent = true)"
      >
        Add item types
      </div>
      <div
        class="flex mt-8"
        v-if="!editMode"
      >
        <NumberPicker v-model:modelValue="count" />
        <div
          class="basket-btn-shape basket-btn-text basket-btn-effects transition-all ml-8"
          :style="{ 'background-color': itemTypePresent && !type ? '#cdcdcd': '#000'}"
          @click="() => addToBasket(item, 1, type)"
        >
          <div class="my-auto md:text-lg lg:text-xl mx-auto">
            ADD TO BASKET
          </div>
        </div>
      </div>
      <div
        v-if="editMode && isAdmin"
        class="sticky bottom-[1%] mt-16 flex w-full select-none transition-all"
      >
        <div
          class="btn-form rounded-[2rem] hover:text-green-500"
          @click="onSave"
        >
          Save
        </div>
        <div
          class="mx-4"
        />
        <div
          class="btn-form rounded-[2rem] hover:text-red-500"
          @click="(editMode = false)"
        >
          Cancel
        </div>
      </div>
      <div
        v-if="isAdmin && !editMode"
        class="sticky bottom-[1%] mt-16 select-none transition-all"
      >
        <div 
          class="btn-form rounded-[2rem] hover:text-green-500 text-xl flex justify-center"
          @click="(editMode = true)"
        >
          Edit this item
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .btn-base {
    @apply bg-black text-white px-2 rounded-full py-2 justify-center select-none cursor-pointer active:ring-2 ring-gray-500 
  }

  .basket-btn-text {
      @apply text-2xl text-gray-200 text-center font-semibold cursor-pointer
  }

  .basket-btn-shape {
      @apply bg-black w-full px-12 py-3 rounded-[2rem] flex
  }

  .basket-btn-effects {
      @apply active:drop-shadow-xl active:ring-2 ring-gray-500 select-none hover:text-white
  }

  .btn-form {
    @apply text-neutral-200 bg-neutral-900 px-12 py-3 cursor-pointer transition-all w-full text-center
  }
</style>