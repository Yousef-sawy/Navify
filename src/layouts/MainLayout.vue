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

        <!-- Language Selector with Translate Icon -->
        <q-btn-dropdown
          flat
          round
          dense
          icon="translate"
          class="language-selector"
        >
          <q-list padding style="min-width: 150px">
            <q-item-label header class="text-center">
              {{ $t('select_language') || 'Select Language' }}
            </q-item-label>

            <q-separator spaced />

            <q-item
              clickable
              v-close-popup
              @click="switchLanguage('en-US')"
              :active="locale === 'en-US'"
              active-class="active-language"
            >
              <q-item-section avatar>
                <q-avatar size="24px">
                  <img src="https://flagcdn.com/w40/us.png" alt="USA Flag">
                </q-avatar>
              </q-item-section>
              <q-item-section>English</q-item-section>
              <q-item-section side v-if="locale === 'en-US'">
                <q-icon name="check" color="primary" size="xs" />
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="switchLanguage('ar')"
              :active="locale === 'ar'"
              active-class="active-language"
            >
              <q-item-section avatar>
                <q-avatar size="24px">
                  <img src="https://flagcdn.com/w40/sa.png" alt="Saudi Arabia Flag">
                </q-avatar>
              </q-item-section>
              <q-item-section>العربية</q-item-section>
              <q-item-section side v-if="locale === 'ar'">
                <q-icon name="check" color="primary" size="xs" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Small indicator showing current language -->
        <div class="current-lang-indicator q-ml-xs">
          <q-avatar size="18px">
            <img :src="locale === 'ar' ? 'https://flagcdn.com/w40/sa.png' : 'https://flagcdn.com/w40/us.png'">
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer - fixed on the left -->
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :behavior="'desktop'"
      class="fixed-drawer"
    >
      <!-- Navigation header -->
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

    <!-- Page container - will respect RTL/LTR -->
    <q-page-container>
      <div :class="{'rtl-container': isRtl}">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useNavigation } from '../Functionality/useNavigation'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isRtl = computed(() => {
  return locale.value === 'ar'
})

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const { navigationLinks, loadNavigation } = useNavigation()

const dropdownState = reactive({})

const toggleDropdown = (linkId) => {
  dropdownState[linkId] = !dropdownState[linkId]
}

const switchLanguage = (lang) => {
  locale.value = lang

  localStorage.setItem('selectedLanguage', lang)

  // document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  console.log('Language switched to:', lang)
}

onMounted(() => {
  loadNavigation()
  navigationLinks.value.forEach(link => {
    dropdownState[link.id] = false
  })

  const savedLang = localStorage.getItem('selectedLanguage')
  if (savedLang) {
    locale.value = savedLang
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

.language-selector {
  position: relative;
  margin-right: 8px;
}

.language-selector .q-btn__content i {
  font-size: 20px;
}

.current-lang-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.active-language {
  background-color: rgba(25, 118, 210, 0.1);
}

.q-item.active-language .q-item__section--avatar .q-avatar {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px #1976d2;
}

.fixed-drawer {
  left: 0 !important;
  right: auto !important;
  transform: translateX(0) !important;
}

.rtl-container {
  direction: rtl;
  text-align: right;
}
</style>
