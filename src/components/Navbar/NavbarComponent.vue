<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Icon } from 'src/components/Common';
import { MdAccountcircleRound } from 'oh-vue-icons/icons';
import {default as CartLink} from './CartLink.vue';
</script>

<template>
  <div class="NavContainer">
    <div class="NavLink">
      <RouterLink to="/">
        Shop Vue
      </RouterLink>
    </div>
    <div class="NavLink">
      <RouterLink to="/addItem">
        Add item
      </RouterLink>
    </div>
    <div class="ml-auto my-auto flex">
      <div class="NavLink hidden">
        <RouterLink to="/account">
          <Icon
            :src="MdAccountcircleRound"
            class="h-[30px] w-[30px]"
          />
        </RouterLink>
      </div>
      <div class="NavLink text-2xl w-full">
        <CartLink />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .NavContainer {
    @apply bg-black w-full h-[4rem]  text-white flex px-4 mb-4
  }
  .NavLink {
    @apply my-auto text-lg mx-4 text-[#DCDCDC] hover:text-white
  }
</style>