<script setup lang="ts">
import { Icon } from 'src/components/Common';
import { ViFileTypeVue } from 'oh-vue-icons/icons';

</script>

<template>
  <div class="footer">
    <div className="footerContainer">
      <div className="footerTitle">
        Vue Example
      </div>
      <div className="footerRightSide">
        <div className="my-auto">
          Powered by: 
        </div>
        <div class="footerIcon">
          <Icon
            :src="ViFileTypeVue"
            class="h-[20px] w-[20px]"
          />
        </div>
      </div>         
    </div>
  </div>
</template>

<style scoped>
  .footer{
    @apply bg-black py-8
  }

  .footerContainer {
    @apply flex flex-row w-2/3 mx-auto my-auto text-white
  }

  .footerTitle {
    @apply text-2xl font-medium
  }

  .footerRightSide {
    @apply flex flex-row ml-auto 
  }

  .footerIcon {
    @apply my-auto mx-2
  }
</style>