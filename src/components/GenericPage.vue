<!-- src/components/GenericPage.vue -->
<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ $route.meta.title }}</div>
        <div class="text-caption">Route: {{ $route.path }}</div>
      </q-card-section>

      <q-card-section>
        <p>This is a dynamically generated page component.</p>
        <p class="text-grey-8">
          In a real application, you could load different components
          or content based on the route parameters.
        </p>
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" icon="arrow_back" label="Go Back" @click="$router.back()" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>

</script>
