<script setup>
  import NavbarMenu from '@/components/NavbarMenu.vue'
</script>

<template>
  <div class="basic-layout">

    <navbar-menu />

    <main class="container mx-auto">
      <slot />
    </main>

  </div>
</template>