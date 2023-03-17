<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useHomePageStore } from 'src/Stores';
import { AddEditPage } from 'src/Pages';
import { CircleSpinner } from 'src/components/Common';

window.scroll(0, 0);

const homeStore = useHomePageStore();
const { getItemWithId } = homeStore;

const route = useRoute();
const id = route.params.id;

const item = getItemWithId(id as string);
</script>

<template>
  <AddEditPage
    v-if="item"
    :edit-mode="false"
    :item="item"
  />
  <div
    v-else
    class="h-[100vh] flex"
  > 
    <div class="h-[5rem] w-[5rem] mx-auto mt-[15%]">
      <CircleSpinner />
    </div>
  </div>
</template>
