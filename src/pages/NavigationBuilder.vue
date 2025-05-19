<template>
  <q-page padding>
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-weight-medium">{{ $t('navigationPage.header.title') }}</div>
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        {{ $t('navigationPage.header.subtitle') }}
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Navigation Form -->
      <div class="col-12 col-md-12">
        <q-card class="builder-card">
          <q-card-section class="bg-primary text-white builder-header">
            <div class="text-h6">{{ $t('navigationPage.builderCard.title') }}</div>
            <div class="text-caption">{{ $t('navigationPage.builderCard.subtitle') }}</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="addNavigationLink" ref="navForm">
              <!-- Link Type Selection -->
              <div class="form-section q-mb-md">
                <div class="section-label">{{ $t('navigationPage.builderCard.linkType.label') }}</div>
                <br>
                <div class="q-gutter-sm link-type-selector">
                  <q-radio
                    v-model="linkType"
                    val="main"
                    :label="$t('navigationPage.builderCard.linkType.main')"
                    color="primary"
                  >
                    <q-tooltip>{{ $t('navigationPage.builderCard.linkType.mainTooltip') }}</q-tooltip>
                  </q-radio>
                  <q-radio
                    v-model="linkType"
                    val="sub"
                    :label="$t('navigationPage.builderCard.linkType.sub')"
                    color="secondary"
                    :disable="!parentLinkOptions.length"
                  >
                    <q-tooltip>
                      {{ parentLinkOptions.length
                        ? $t('navigationPage.builderCard.linkType.subTooltip')
                        : $t('navigationPage.builderCard.linkType.noMainTooltip') }}
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
                      :label="$t('navigationPage.builderCard.formFields.title.label')"
                      outlined
                      bg-color="white"
                      :rules="[
                        val => !!val || $t('navigationPage.builderCard.formFields.title.required'),
                        val => !titleExists(val) || $t('navigationPage.builderCard.formFields.title.exists')
                      ]"
                      lazy-rules="ondemand"
                      class="q-mb-md"
                      :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="title" color="primary" />
                      </template>
                      <template v-slot:hint>
                        {{ $t('navigationPage.builderCard.formFields.title.hint') }}
                      </template>
                    </q-input>
                  </div>

                  <div class="col-12">
                    <q-input
                      v-model="formData.path"
                      :label="$t('navigationPage.builderCard.formFields.path.label')"
                      outlined
                      bg-color="white"
                      :rules="[
                        val => !!val || $t('navigationPage.builderCard.formFields.path.required'),
                        val => /^[a-z0-9-_]+$/i.test(val) || $t('navigationPage.builderCard.formFields.path.invalid'),
                        validatePathUniqueness
                      ]"
                      lazy-rules="ondemand"
                      class="q-mb-md"
                      :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
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
                        {{ $t('navigationPage.builderCard.formFields.path.hint') }}
                      </template>
                    </q-input>
                  </div>

                  <!-- Icon Selector - New Addition -->
                  <div class="col-12">
                    <q-select
                      v-model="formData.icon"
                      :options="iconOptions"
                      :label="$t('navigationPage.builderCard.formFields.icon.label')"
                      outlined
                      bg-color="white"
                      :rules="[val => !!val || $t('navigationPage.builderCard.formFields.icon.required')]"
                      emit-value
                      map-options
                      lazy-rules="ondemand"
                      class="q-mb-md"
                      menu-anchor="bottom left"
                      menu-self="top left"
                      :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
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
                        {{ $t('navigationPage.builderCard.formFields.icon.hint') }}
                      </template>
                    </q-select>
                  </div>

                  <!-- Parent Selection (for sublinks) -->
                  <div class="col-12" v-if="linkType === 'sub'">
                    <q-select
                      v-model="formData.parentId"
                      :options="filteredParentOptions"
                      :label="$t('navigationPage.builderCard.formFields.parent.label')"
                      outlined
                      bg-color="white"
                      :rules="[
                        val => !!val || $t('navigationPage.builderCard.formFields.parent.required'),
                        val => validateParentSelection(val)
                      ]"
                      :disable="!parentLinkOptions.length"
                      emit-value
                      map-options
                      lazy-rules="ondemand"
                      use-input
                      fill-input
                      hide-selected
                      input-debounce="300"
                      @filter="filterParents"
                      class="q-mb-md"
                      :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_tree" color="primary" />
                      </template>
                      <template v-slot:hint>
                        {{ $t('navigationPage.builderCard.formFields.parent.hint') }}
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{ $t('navigationPage.builderCard.formFields.parent.noResults') }}
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
                  {{ $t('navigationPage.builderCard.createMainFirst') }}
                </q-banner>
              </div>

              <!-- Submit Button -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  outline
                  :label="$t('navigationPage.builderCard.buttons.reset')"
                  color="grey-7"
                  @click="resetForm"
                  :disable="!formNotEmpty"
                />
                <q-btn
                  unelevated
                  :label="$t('navigationPage.builderCard.buttons.add')"
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
            <div class="text-h6">{{ $t('navigationPage.previewCard.title') }}</div>
            <div class="text-caption">{{ $t('navigationPage.previewCard.subtitle') }}</div>
          </q-card-section>

          <q-card-section>
            <div v-if="!navigationLinks.length" class="empty-state q-pa-lg text-center">
              <q-icon name="account_tree" size="4rem" color="grey-4" />
              <p class="text-grey-8 q-mt-md">
                {{ $t('navigationPage.previewCard.emptyState') }}
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
                          <q-tooltip>{{ link.visible
                            ? $t('navigationPage.previewCard.tooltips.hide')
                            : $t('navigationPage.previewCard.tooltips.show') }}</q-tooltip>
                        </q-btn>
                        <q-btn
                          dense flat round
                          icon="delete"
                          color="negative"
                          @click.stop="handleDeleteLink(link.id)"
                        >
                          <q-tooltip>{{ $t('navigationPage.previewCard.tooltips.delete') }}</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </template>

                  <!-- Sublinks if any -->
                  <q-list padding>
                    <div v-if="!link.children.length" class="text-grey-7 text-center q-pa-sm">
                      <q-icon name="info" size="xs" class="q-mr-xs" />
                      {{ $t('navigationPage.previewCard.noSublinks') }}
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
                            <q-tooltip>{{ sublink.visible
                              ? $t('navigationPage.previewCard.tooltips.hide')
                              : $t('navigationPage.previewCard.tooltips.show') }}</q-tooltip>
                          </q-btn>
                          <q-btn
                            dense flat round
                            icon="delete"
                            color="negative"
                            @click="handleDeleteLink(sublink.id)"
                          >
                            <q-tooltip>{{ $t('navigationPage.previewCard.tooltips.delete') }}</q-tooltip>
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
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const navForm = ref(null)
const { t } = useI18n()
const {
  navigationLinks,
  addLink,
  deleteLink,
  toggleLinkVisibility,
  loadNavigation,
  titleExists,
  pathExists,
  findLinkById
} = useNavigation()

const linkType = ref('main')
const formData = ref({
  title: '',
  path: '',
  icon: 'link',
  parentId: null
})


const formNotEmpty = computed(() => {
  return formData.value.title !== '' ||
    formData.value.path !== '' ||
    formData.value.icon !== 'link' ||
    formData.value.parentId !== null
})


const parentLinkOptions = computed(() => {
  return navigationLinks.value.map(link => ({
    label: link.title,
    value: link.id
  }))
})


const selectedParentPath = computed(() => {
  if (formData.value.parentId) {
    const parentLink = navigationLinks.value.find(link => link.id === formData.value.parentId)
    return parentLink ? parentLink.path : ''
  }
  return ''
})


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
          message: isSublink
            ? t('navigationPage.notifications.sublinkSuccess')
            : t('navigationPage.notifications.mainLinkSuccess'),
          position: 'top',
          icon: 'check_circle'
        })

        resetForm()
      } catch (error) {
        console.error('Error adding link:', error)
        $q.notify({
          type: 'negative',
          message: error.message || t('navigationPage.notifications.error'),
          position: 'top',
          icon: 'error'
        })
      }
    } else {
      $q.notify({
        type: 'warning',
        message: t('navigationPage.notifications.formErrors'),
        position: 'top',
        icon: 'warning'
      })
    }
  })
}


const validatePathUniqueness = (val) => {
  if (!val) return true

  const parentId = linkType.value === 'sub' ? formData.value.parentId : null


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


const handleDeleteLink = (id) => {

  const link = findLinkById(id)
  const isMainLink = navigationLinks.value.some(l => l.id === id)


  const success = deleteLink(id)

  if (success) {
    $q.notify({
      type: 'positive',
      message: isMainLink
        ? t('navigationPage.notifications.mainLinkDeleted', { title: link?.title })
        : t('navigationPage.notifications.sublinkDeleted', { title: link?.title }),
      position: 'top',
      icon: 'check_circle'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: t('navigationPage.notifications.deleteFailed', { error: t('navigationPage.notifications.unknownError') }),
      position: 'top',
      icon: 'error'
    })
  }
}

// Add these to your script
const parentFilter = ref('')
const filteredParentOptions = ref([])

const filterParents = (val, update) => {
  if (val === '') {
    update(() => {
      filteredParentOptions.value = parentLinkOptions.value
    })
    return
  }

  const needle = val.toLowerCase()
  update(() => {
    filteredParentOptions.value = parentLinkOptions.value.filter(
      v => v.label.toLowerCase().indexOf(needle) > -1
    )
  })
}

const validateParentSelection = (val) => {
  if (!val) return true // This case is handled by the first rule

  // Check if the selected value exists in the available parent options
  const validParent = parentLinkOptions.value.some(option => option.value === val)
  return validParent || t('navigationPage.builderCard.formFields.parent.invalid')
}
onMounted(() => {
  loadNavigation()
})

const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('selectedLanguage', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

}
</script>
<style>

/* RTL input styling */
.rtl-input.q-field--outlined .q-field__control {
  direction: rtl;
}

.rtl-input .q-field__native,
.rtl-input .q-field__prefix,
.rtl-input .q-field__suffix,
.rtl-input .q-field__input {
  direction: rtl;
  text-align: right;
}

.rtl-input .q-field__label {
  right: unset;
  left: unset;
  transform-origin: right top;
  direction: rtl;
  text-align: right;
}

/* Fix for label position in outlined mode */
.rtl-input.q-field--outlined.q-field--float .q-field__label {
  transform: translateY(-50%) scale(0.75);
  right: 8px;
}

/* When the field is not floating (empty) */
.rtl-input.q-field--outlined:not(.q-field--float) .q-field__label {
  right: 10px;
}

/* Icon positioning */
.rtl-input .q-field__prepend {
  padding-right: 0;
  padding-left: 16px;
}



</style>
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
