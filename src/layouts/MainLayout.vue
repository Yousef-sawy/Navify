<template>
  <q-layout view="hHh lpR lFf">
   <q-header elevated class="bg-primary text-white">
  <q-toolbar>
    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
      </q-avatar>
      Navify
    </q-toolbar-title>

    <!-- testttt -->
        <div class="q-pa-md">
          {{ $t('hello') }}
        </div>
    <!-- Language Buttons -->
    <q-btn flat label="English" @click="switchLanguage('en-US')" />
    <q-btn flat label="العربية" @click="switchLanguage('ar')" />
  </q-toolbar>
</q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!--  Navigation  header-->
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header>Navigation Menu</q-item-label>

          <!-- Home link -->
          <q-item to="/" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item to="/link" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="build" />
            </q-item-section>
            <q-item-section>
              Dynamic Navigation Builder
            </q-item-section>
          </q-item>

          <q-item to="/feedback" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="feedback" />
            </q-item-section>
            <q-item-section>
              Feedback & Support
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <!-- Dynamic links generated from user input -->
          <template v-if="navigationLinks.length">
            <template v-for="link in navigationLinks" :key="link.id">
              <div v-if="link.visible">
                <!-- Main link with dropdown if there are children -->
                <div class="row no-wrap items-center">
                  <!-- Main link part -->
                  <q-item
                    class="col main-link"
                    :to="`/${link.path}`"
                    clickable
                    v-ripple
                    style="padding-right: 0"
                  >
                    <q-item-section avatar>
                      <!-- Updated to use dynamic icon from link data -->
                      <q-icon :name="link.icon || 'link'" />
                    </q-item-section>
                    <q-item-section>
                      {{ link.title }}
                    </q-item-section>
                  </q-item>

                  <!-- Dropdown toggle part (only if there are children) -->
                  <q-btn
                    v-if="link.children && link.children.length > 0"
                    :icon="dropdownState[link.id] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                    flat
                    round
                    dense
                    @click="toggleDropdown(link.id)"
                    class="dropdown-toggle"
                  />
                </div>

                <!-- Sublinks container -->
                <q-slide-transition>
                  <div v-show="link.children.length > 0 && dropdownState[link.id]">
                    <q-list class="sublinks-container q-ml-lg">
                      <q-item
                        v-for="sublink in link.children"
                        :key="sublink.id"
                        v-show="sublink.visible"
                        :to="`/${link.path}/${sublink.path}`"
                        clickable
                        v-ripple
                        dense
                      >
                        <q-item-section avatar>
                          <!-- Updated to use dynamic icon from sublink data -->
                          <q-icon :name="sublink.icon || 'subdirectory_arrow_right'" size="xs" />
                        </q-item-section>
                        <q-item-section>
                          {{ sublink.title }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-slide-transition>
              </div>
            </template>
          </template>

          <!-- Empty state -->
          <q-item v-else>
            <q-item-section class="text-grey text-center">
              No navigation links yet.<br>
              Create some on the home page.
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useNavigation } from '../Functionality/useNavigation'
import { useI18n } from 'vue-i18n'

// Get i18n instance
const { locale } = useI18n()

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const { navigationLinks, loadNavigation } = useNavigation()

const dropdownState = reactive({})

const toggleDropdown = (linkId) => {
  dropdownState[linkId] = !dropdownState[linkId]
}

// Switch language function
const switchLanguage = (lang) => {
  // Update the locale
  locale.value = lang

  // Save to localStorage for persistence
  localStorage.setItem('selectedLanguage', lang)

  // Set RTL direction for Arabic
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'

  // Optional: Add a console log to verify the change
  console.log('Language switched to:', lang)
}

onMounted(() => {
  loadNavigation()
  navigationLinks.value.forEach(link => {
    dropdownState[link.id] = false
  })

  // Load saved language preference if available
  const savedLang = localStorage.getItem('selectedLanguage')
  if (savedLang) {
    locale.value = savedLang
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
  }
})
</script>
<style>
.hidden-link {
  opacity: 0.5;
}

.main-link {
  border-radius: 4px;
}

.dropdown-toggle {
  margin-right: 8px;
}

.sublinks-container {
  padding-left: 8px;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  margin-left: 24px;
}
</style>
