<script setup lang="ts">
import { onBeforeMount} from 'vue';
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import IconType from 'oh-vue-icons';

const props = defineProps<{src: IconType.CustomizeIconType, class: string}>();

onBeforeMount(() => addIcons(props.src));
</script>

<template>
  <component
    :is="OhVueIcon"
    :name="src.name"
    :class="props.class"
  />
</template>