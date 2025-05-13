<template>
  <q-page padding>
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-weight-medium">Navigation Builder</div>
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Create and manage your custom navigation structure
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Navigation Form -->
      <div class="col-12 col-md-12">
        <q-card class="builder-card">
          <q-card-section class="bg-primary text-white builder-header">
            <div class="text-h6">Create New Navigation Link</div>
            <div class="text-caption">Design your site's navigation structure</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="addNavigationLink" ref="navForm">
              <!-- Link Type Selection -->
              <div class="form-section q-mb-md">
                <div class="section-label">Link Type</div>
                <br>
                <div class="q-gutter-sm link-type-selector">
                  <q-radio
                    v-model="linkType"
                    val="main"
                    label="Main Navigation Link"
                    color="primary"
                  >
                    <q-tooltip>Top-level navigation item</q-tooltip>
                  </q-radio>
                  <q-radio
                    v-model="linkType"
                    val="sub"
                    label="Sublink / Child Page"
                    color="secondary"
                    :disable="!parentLinkOptions.length"
                  >
                    <q-tooltip>
                      {{ parentLinkOptions.length ? 'Child page under a main link' : 'Create a main link first' }}
                    </q-tooltip>
                  </q-radio>
                </div>
              </div>

              <!-- Main Form Fields -->
              <div class="form-fields q-mt-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      v-model="formData.title"
                      label="Link Title *"
                      outlined
                      bg-color="white"
                      :rules="[
                        val => !!val || 'Title is required',
                        val => !titleExists(val) || 'A link with this title already exists'
                      ]"
                      lazy-rules="ondemand"
                      class="q-mb-md"
                    >
                      <template v-slot:prepend>
                        <q-icon name="title" color="primary" />
                      </template>
                      <template v-slot:hint>
                        The text displayed in navigation menus
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12">
                    <q-input
                      v-model="formData.path"
                      label="Route Path *"
                      outlined
                      bg-color="white"
                      :rules="[
                        val => !!val || 'Path is required',
                        val => /^[a-z0-9-_]+$/i.test(val) || 'Only alphanumeric characters, hyphens, and underscores allowed',
                        validatePathUniqueness
                      ]"
                      lazy-rules="ondemand"
                      class="q-mb-md"
                    >
                      <template v-slot:prepend>
                        <q-icon name="link" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-chip v-if="formData.path" dense color="grey-3" text-color="grey-8">
                          /{{ linkType === 'sub' && selectedParentPath ? selectedParentPath + '/' : '' }}{{ formData.path }}
                        </q-chip>
                      </template>
                      <template v-slot:hint>
                        URL path (letters, numbers, hyphens, underscores)
                      </template>
                    </q-input>
                  </div>

                  <!-- Icon Selector - New Addition -->
                  <div class="col-12">
  <q-select
    v-model="formData.icon"
    :options="iconOptions"
    label="Menu Icon *"
    outlined
    bg-color="white"
    :rules="[val => !!val || 'Icon is required']"
    emit-value
    map-options
    lazy-rules="ondemand"
    class="q-mb-md"
    menu-anchor="bottom left"
    menu-self="top left"
  >
    <template v-slot:prepend>
      <q-icon name="style" color="primary" />
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="scope.opt.value" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:hint>
      Icon to display next to the link in the navigation menu
    </template>
  </q-select>
</div>

                  <!-- Parent Selection (for sublinks) -->
                  <div class="col-12" v-if="linkType === 'sub'">
                    <q-select
                      v-model="formData.parentId"
                      :options="parentLinkOptions"
                      label="Parent Link *"
                      outlined
                      bg-color="white"
                      :rules="[val => !!val || 'Parent link is required']"
                      :disable="!parentLinkOptions.length"
                      emit-value
                      map-options
                      lazy-rules="ondemand"
                      use-input
                      fill-input
                      hide-selected
                      input-debounce="0"
                      class="q-mb-md"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_tree" color="primary" />
                      </template>
                      <template v-slot:hint>
                        The main navigation link this sublink belongs to
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <!-- No main links warning -->
                <q-banner v-if="linkType === 'sub' && !parentLinkOptions.length" class="bg-orange-1 q-pa-md q-mb-md rounded-borders">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="orange" />
                  </template>
                  Please create a main link first before adding sublinks.
                </q-banner>
              </div>

              <!-- Submit Button -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  outline
                  label="Reset"
                  color="grey-7"
                  @click="resetForm"
                  :disable="!formNotEmpty"
                />
                <q-btn
                  unelevated
                  label="Add Navigation Link"
                  type="submit"
                  color="primary"
                  icon="add_link"
                  :disable="linkType === 'sub' && !parentLinkOptions.length"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Preview Card -->
      <div class="col-12 col-md-12">
        <q-card class="preview-card">
          <q-card-section class="bg-secondary text-white preview-header">
            <div class="text-h6">Navigation Preview</div>
            <div class="text-caption">Visualize your navigation structure</div>
          </q-card-section>

          <q-card-section>
            <div v-if="!navigationLinks.length" class="empty-state q-pa-lg text-center">
              <q-icon name="account_tree" size="4rem" color="grey-4" />
              <p class="text-grey-8 q-mt-md">
                No navigation links created yet. Use the form to build your navigation structure.
              </p>
            </div>

            <q-list v-else bordered separator class="rounded-borders">
              <template v-for="link in navigationLinks" :key="link.id">
                <!-- Main link -->
                <q-expansion-item
                  :label="link.title"
                  :caption="`/${link.path}`"
                  :default-opened="link.children.length > 0"
                  expandable-icon="keyboard_arrow_down"
                  header-class="main-link-header"
                  :class="{'invisible-link': !link.visible}"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <div class="row items-center">
                        <!-- Updated to show icon from the link data -->
                        <q-icon :name="link.icon || 'link'" color="primary" size="xs" class="q-mr-sm" />
                        <q-item-label>{{ link.title }}</q-item-label>
                      </div>
                      <q-item-label caption class="q-mt-xs">
                        <q-chip dense size="sm" color="grey-3" text-color="grey-8">
                          /{{ link.path }}
                        </q-chip>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="row q-gutter-xs">
                        <q-btn
                          dense flat round
                          :icon="link.visible ? 'visibility' : 'visibility_off'"
                          @click.stop="toggleLinkVisibility(link.id)"
                          :color="link.visible ? 'primary' : 'grey'"
                        >
                          <q-tooltip>{{ link.visible ? 'Hide Link' : 'Show Link' }}</q-tooltip>
                        </q-btn>
                        <q-btn
                          dense flat round
                          icon="delete"
                          color="negative"
                          @click.stop="deleteLink(link.id)"
                        >
                          <q-tooltip>Delete Link</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </template>

                  <!-- Sublinks if any -->
                  <q-list padding>
                    <div v-if="!link.children.length" class="text-grey-7 text-center q-pa-sm">
                      <q-icon name="info" size="xs" class="q-mr-xs" />
                      No sublinks yet. Add some using the form.
                    </div>
                    <q-item
                      v-for="sublink in link.children"
                      :key="sublink.id"
                      class="sublink-item q-ml-md"
                      :class="{'invisible-link': !sublink.visible}"
                    >
                      <q-item-section>
                        <div class="row items-center">
                          <!-- Updated to show icon from the sublink data -->
                          <q-icon :name="sublink.icon || 'subdirectory_arrow_right'" color="secondary" size="xs" class="q-mr-sm" />
                          <q-item-label>{{ sublink.title }}</q-item-label>
                        </div>
                        <q-item-label caption class="q-mt-xs">
                          <q-chip dense size="sm" color="grey-3" text-color="grey-8">
                            /{{ link.path }}/{{ sublink.path }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <div class="row q-gutter-xs">
                          <q-btn
                            dense flat round
                            :icon="sublink.visible ? 'visibility' : 'visibility_off'"
                            @click="toggleLinkVisibility(sublink.id)"
                            :color="sublink.visible ? 'primary' : 'grey'"
                          >
                            <q-tooltip>{{ sublink.visible ? 'Hide Link' : 'Show Link' }}</q-tooltip>
                          </q-btn>
                          <q-btn
                            dense flat round
                            icon="delete"
                            color="negative"
                            @click="deleteLink(sublink.id)"
                          >
                            <q-tooltip>Delete Link</q-tooltip>
                          </q-btn>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </template>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useNavigation, iconOptions } from '../Functionality/useNavigation'

const $q = useQuasar()
const navForm = ref(null)

const {
  navigationLinks,
  addLink,
  deleteLink,
  toggleLinkVisibility,
  loadNavigation,
  titleExists,
  pathExists
} = useNavigation()

const linkType = ref('main')
const formData = ref({
  title: '',
  path: '',
  icon: 'link', // Default icon
  parentId: null
})

// Check if form has any data entered
const formNotEmpty = computed(() => {
  return formData.value.title !== '' ||
    formData.value.path !== '' ||
    formData.value.icon !== 'link' ||
    formData.value.parentId !== null
})

// Options for parent link dropdown
const parentLinkOptions = computed(() => {
  return navigationLinks.value.map(link => ({
    label: link.title,
    value: link.id
  }))
})

// Get selected parent path for display in UI
const selectedParentPath = computed(() => {
  if (formData.value.parentId) {
    const parentLink = navigationLinks.value.find(link => link.id === formData.value.parentId)
    return parentLink ? parentLink.path : ''
  }
  return ''
})

// Helper function to get icon label from value
const getIconLabel = (iconValue) => {
  const icon = iconOptions.find(opt => opt.value === iconValue);
  return icon ? icon.label : iconValue;
};

const addNavigationLink = () => {
  navForm.value.validate().then(success => {
    if (success) {
      try {
        const isSublink = linkType.value === 'sub'
        addLink(formData.value, isSublink)

        $q.notify({
          type: 'positive',
          message: `${isSublink ? 'Sublink' : 'Main link'} created successfully!`,
          position: 'top',
          icon: 'check_circle'
        })

        resetForm()
      } catch (error) {
        console.error('Error adding link:', error)
        $q.notify({
          type: 'negative',
          message: error.message || 'Failed to add navigation link',
          position: 'top',
          icon: 'error'
        })
      }
    } else {
      $q.notify({
        type: 'warning',
        message: 'Please fix the form errors before submitting',
        position: 'top',
        icon: 'warning'
      })
    }
  })
}

// Add this function to your script section
const validatePathUniqueness = (val) => {
  if (!val) return true // Empty validation is handled by another rule

  const parentId = linkType.value === 'sub' ? formData.value.parentId : null

  // Use your existing pathExists function with the correct parameters
  // The third parameter (excludeId) is null since we're creating a new link
  if (pathExists(val, parentId, null)) {
    if (linkType.value === 'sub') {
      return 'A sublink with this path already exists under this parent'
    } else {
      return 'A main link with this path already exists'
    }
  }

  return true
}

const resetForm = () => {
  formData.value = {
    title: '',
    path: '',
    icon: 'link', // Reset icon to default
    parentId: null
  }

  if (navigationLinks.value.length === 0) {
    linkType.value = 'main'
  }

  if (navForm.value) {
    navForm.value.resetValidation()
  }
}

onMounted(() => {
  loadNavigation()
})
</script>

<style scoped>
.page-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.builder-card, .preview-card {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.builder-card:hover, .preview-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.builder-header, .preview-header {
  padding: 16px;
}

.section-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.link-type-selector {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.main-link-header {
  background-color: rgba(0, 0, 0, 0.02);
}

.sublink-item {
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.01);
  transition: all 0.2s ease;
}

.sublink-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.invisible-link {
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.02);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.builder-card, .preview-card {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* Icon preview styles */
.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  margin-top: 8px;
}

.icon-preview-label {
  margin-left: 8px;
  font-size: 0.9rem;
  color: #555;
}
/* testettst */

</style>
