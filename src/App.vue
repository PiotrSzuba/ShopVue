<script setup lang="ts">
import { Navbar, Footer } from 'src/components';
import { Popups } from 'src/components/Popups';
import { RouterView } from 'vue-router';
</script>

<template>
  <Popups />
  <Navbar />
  <RouterView />
  <Footer />
</template>
