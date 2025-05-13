<!-- src/pages/TemplatePage.vue -->
<template>
  <q-page padding class="flex flex-center">
    <div class="container">
      <q-card class="template-card">
        <q-card-section>
          <h3 class="text-h3 q-mb-md">Card Title</h3>
          <p class="text-body1">
            This is a template page with a centered card. You can put any content here.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl
            eget ultricies ultrices, nunc nisl aliquam nunc, vitae aliquam nisl nunc
            vitae nisl. Nullam euismod, nisl eget ultricies ultrices, nunc nisl aliquam
            nunc, vitae aliquam nisl nunc vitae nisl.
          </p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
// You can add any page-specific script logic here
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  padding: 0 16px;
}

.template-card {
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
