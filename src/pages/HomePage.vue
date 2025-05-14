<template>
  <q-page padding>
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-weight-medium">{{ $t('homePage.header.title') }}</div>
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        {{ $t('homePage.header.subtitle') }}
      </div>
    </div>

    <div class="q-mb-md">
      <q-banner v-if="!visibleNavigationLinks.length" class="bg-blue-1 text-grey-9 q-pa-lg text-center" rounded>
        <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
        {{ $t('homePage.banner.noLinks') }}
        <template v-slot:action>
          <q-btn to="/link" color="primary" :label="$t('homePage.banner.goToBuilder')" flat no-caps />
        </template>
      </q-banner>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Navigation Links Cards -->
      <template v-for="link in visibleNavigationLinks" :key="link.id">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="nav-card">
            <!-- Card Header -->
            <q-card-section class="card-header bg-primary text-white">
              <div class="text-subtitle1 text-weight-medium ellipsis">
                {{ link.title }}
              </div>
              <q-badge color="white" text-color="primary" class="q-ml-sm">
                /{{ link.path }}
              </q-badge>
            </q-card-section>

            <!-- Card Content -->
            <q-card-section class="q-pt-md">
              <div class="row items-center q-mb-md">
                <q-icon name="link" color="primary" size="sm" class="q-mr-sm" />
                <div class="text-caption text-grey-8">{{ $t('homePage.card.mainNavLink') }}</div>
              </div>

              <div class="sublinks-info q-mb-md">
                <div class="row items-center">
                  <q-icon name="subdirectory_arrow_right" color="grey-7" size="sm" class="q-mr-sm" />
                  <div class="text-caption text-grey-8">
                    {{ visibleSublinks(link).length
                        ? $t('homePage.card.sublinksCount', visibleSublinks(link).length, {count: visibleSublinks(link).length})
                        : $t('homePage.card.noSublinks') }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <!-- Card Actions -->
            <q-card-actions align="between" class="q-px-md q-pb-md card-actions">
              <q-btn
                :to="`/${link.path}`"
                color="primary"
                unelevated
                class="visit-btn"
                icon="open_in_new"
                :label="$t('homePage.card.visitPage')"
                size="sm"
              />

              <div class="actions-right-container">
                <!-- Sublinks Dropdown Button or Placeholder -->
                <q-btn-dropdown
                  v-if="visibleSublinks(link).length"
                  color="grey-7"
                  flat
                  :label="$t('homePage.card.viewSublinks')"
                  size="md"
                  auto-close
                  class="sublinks-dropdown"
                >
                  <q-list class="sublinks-list">
                    <q-item
                      v-for="sublink in visibleSublinks(link)"
                      :key="sublink.id"
                      :to="`/${link.path}/${sublink.path}`"
                      clickable
                      v-close-popup
                      class="sublink-item"
                    >
                      <q-item-section>
                        <div class="row items-center">
                          <div class="col ellipsis">{{ sublink.title }}</div>
                          <q-badge color="grey-3" text-color="grey-7" class="q-ml-sm">
                            /{{ sublink.path }}
                          </q-badge>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <!-- Empty placeholder with same height when no sublinks -->
                <div v-else class="sublinks-placeholder"></div>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNavigation } from '../Functionality/useNavigation'
import { useI18n } from 'vue-i18n'  // Add this import

// Add useI18n hook
const { t } = useI18n()

const { navigationLinks, loadNavigation } = useNavigation()

// Filter only visible navigation links
const visibleNavigationLinks = computed(() => {
  return navigationLinks.value.filter(link => link.visible)
})

// Helper function to get visible sublinks for a parent link
const visibleSublinks = (parentLink) => {
  return parentLink.children.filter(sublink => sublink.visible)
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

.nav-card {
  height: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  min-width: 220px; /* Set a minimum width to prevent cramping */
}


.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.visit-btn {
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 105px; /* Ensure minimum button width */
}
.visit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.sublinks-dropdown {
  min-width: auto;
  white-space: nowrap;
}
.sublinks-list {
  min-width: 200px;
}

.sublink-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sublinks-info {
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

/* New styles for card height consistency */
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  flex-wrap: nowrap; /* Prevent wrapping */
  min-height: 60px; /* Give more height if needed */
}
.actions-right-container {
  display: flex;
  justify-content: flex-end;
  width: 130px; /* Fixed width for the right-side container */
  height: 36px; /* Fixed height to match button */
}

.sublinks-placeholder {
  display: block;
  width: 100%;
  height: 36px; /* Match button height */
}
</style>
