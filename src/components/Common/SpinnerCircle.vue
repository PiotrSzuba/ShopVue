<script setup lang="ts">
import { withDefaults } from 'vue';
withDefaults(defineProps<{color?: string}>(), {color: '#000'});
</script>

<template>
  <div 
    :style="{ 'border-color': color }"
    style="border-right-color: transparent;"
    class="animate-spin h-full w-full border-4 rounded-full"
  >
    <span class="hidden">Loading...</span>
  </div>
</template>