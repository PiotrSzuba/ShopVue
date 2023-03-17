<script setup lang="ts">
import { ref, onMounted, onBeforeMount, withDefaults } from 'vue';
import { Icon } from 'src/components/Common';
import { LaAngleUpSolid, LaAngleDownSolid, LaPlusSolid, LaTrashAltSolid } from 'oh-vue-icons/icons';
import { EditableText } from 'src/components/EditableFields';
import { DnDList, DraggableItem } from 'src/components/Draggable';


const props = withDefaults(defineProps<{
  defaultValue: string;
  defaultValueDisabled?: boolean;
  editable?: boolean;
  options: string[];
  onChange?: (option: string) => void;
  onChangeDefaultOption?: (value: string) => void;
  onChangeOption?: (index: number, value: string) => void;
  onAddOption?: () => void;
  onDeleteOption?: (index: number) => void;
  onOrderChange?: (sourceIndex: number, targetIndex: number) => void,
}>(), {
	defaultValueDisabled: false,
	editable: false,
	onChange: undefined,
	onChangeDefaultOption: undefined,
	onChangeOption: undefined,
	onAddOption: undefined,
	onDeleteOption: undefined,
	onOrderChange: undefined,
});

const dnd = ref<DnDList<string>>();
const active = ref(false);
const chosenOption = ref('');
const options = ref<string[]>([]);

const onPick = (option: string) => {
	if (props.editable) return;
	active.value = false;
	chosenOption.value = option;

	if (props.onChange)
		props.onChange(option === props.defaultValue ? '' : option);
};

const onDefaultOptionChange = (value: string) => {
	if (!props.onChangeDefaultOption) return;

	props.onChangeDefaultOption(value);
};

const onOptionChange = (index: number, value: string) => {
	if (!props.onChangeOption || !dnd.value) return;

	props.onChangeOption(index, value);
	dnd.value.changeItem(value, index);
};

const onAddOption = () => {
	if (!props.onAddOption || !dnd.value) return;

	props.onAddOption();
	dnd.value.addItem('');
};

const onDeleteOption = (index: number) => {
	if (!props.onDeleteOption || !dnd.value) return;
  
	props.onDeleteOption(index);
	dnd.value.deleteItem(index);
};

const onActive = (force?: boolean) => {
	if (props.editable && !props.onAddOption) return;

	if (force && props.editable) {
		active.value =! active.value;
		return;
	}
	if (props.editable || force) return;

	active.value =! active.value;
};

const onBlur = () => {
	if (props.editable) return;
	active.value = false;
};

const onEnterClick = () => {
	if (props.editable) return;
	active.value =! active.value;
};

onBeforeMount(() => {
	dnd.value = new DnDList<string>(props.options, !props.editable, props.onOrderChange);
});

onMounted(() => {
	chosenOption.value = props.defaultValue;
	if (!props.options.find((o) => o === props.defaultValue) && !props.defaultValueDisabled) {
		options.value.push(props.defaultValue);
	}
	props.options.forEach((opt) => options.value.push(opt));
});
</script>

<template>
  <div
    tabindex="0"
    class="relative w-full select-none"
    @blur="onBlur"
    @keyup.enter="() => onEnterClick()"
  >
    <div
      class="flex border-[1px] px-3 py-1 text-base font-light cursor-pointer"
      :class="{'ring-black ring-1': active}"
      @click="() => onActive()"
    >
      <EditableText
        placeholder="Default option"
        :value="props.editable ? defaultValue : chosenOption"
        :editable="props.editable"
        :icons="false"
        :on-change="(value) => onDefaultOptionChange(value)"
      />
      <div
        class="flex flex-col my-auto ml-auto pl-2"
        @click="() => onActive(true)"
      >
        <Icon
          v-if="active"
          :src="LaAngleUpSolid"
          class="h-[20px]"
        />
        <Icon
          v-else
          :src="LaAngleDownSolid"
          class="h-[20px]"
        />
      </div>
    </div>
    <div
      v-if="active && dnd"
      class="absolute z-10 border-[1px] w-full mt-2 bg-white drop-shadow-2xl text-base font-light"
    >
      <div
        v-for="(option, index) in props.options"
        :key="index"
        :style="{'background-color': chosenOption && option === chosenOption ? '#D8DBDD' : ''}"
        class="group/inside option"
        @click="() => onPick(option)"
      >
        <DraggableItem
          :index="index"
          :dnd="dnd"
          :disabled="false"
        >
          <div class="flex w-full px-3">
            <div class="py-[1px] z-10 w-full">
              <EditableText
                placeholder="option"
                :value="props.options[index]"
                :editable="props.editable && !!props.onChangeOption"
                :icons="false"
                :on-change="(value) => onOptionChange(index, value)"
              />
            </div>
            <div
              v-if="props.editable"
              class="my-auto invisible hover:text-red-500 group-hover/inside:visible ml-auto"
              @click="() => onDeleteOption(index)"
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
        v-if="props.editable && props.onAddOption"
        class="flex justify-center text-black py-1"
      >
        <Icon
          :src="LaPlusSolid"
          class="h-[20px] hover:text-green-500 cursor-pointer"
          @click="onAddOption"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.option {
  @apply cursor-pointer hover:bg-[#D8DBDD]
}
</style>