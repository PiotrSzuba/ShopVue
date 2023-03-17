<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from 'src/components/Common';
import { LaAngleUpSolid } from 'oh-vue-icons/icons';
import { LaAngleDownSolid } from 'oh-vue-icons/icons';

const props = defineProps<{defaultValue: string, options: string[], onChange: (option: string) => void}>();

const active = ref(false);
const chosenOption = ref('');
const options = ref<string[]>([]);

const onPick = (option: string) => {
	active.value = false;
	chosenOption.value = option;
	props.onChange(option === props.defaultValue ? '' : option);
};

onMounted(() => {
	chosenOption.value = props.defaultValue;
	options.value.push(props.defaultValue);
	props.options.forEach((opt) => options.value.push(opt));
});

</script>

<template>
  <div class="w-[13rem] mx-4 select-none">
    <div
      class="flex border-[1px] p-3 text-base font-light cursor-pointer"
      @click="(active=!active)"
    >
      <div>
        {{ chosenOption }}
      </div>
      <div class="flex flex-col my-auto ml-auto">
        <Icon
          v-if="active"
          :src="LaAngleDownSolid"
          class="w-5 h-5"
        />
        <Icon
          v-else
          :src="LaAngleUpSolid"
          class="w-5 h-5"
        />
      </div>
    </div>
    <div
      v-if="active"
      class="absolute z-10 border-[1px] w-[13rem] mt-2 bg-white drop-shadow-2xl text-base font-light"
    >
      <div
        v-for="option in options"
        :key="option"
        @click="() => onPick(option)"
        :style="{'background-color': option === chosenOption ? '#D8DBDD' : ''}"
        class="cursor-pointer py-1 hover:bg-[#D8DBDD] px-3"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>