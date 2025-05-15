<template>
  <div class="q-pa-md content-wrapper">
    <div class="centered-container">
      <!-- Page Header -->
      <div class="page-header q-mb-lg">
        <div class="text-h4 text-weight-medium">{{ t('feedback.title') }}</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          {{ t('feedback.subtitle') }}
        </div>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <!-- Feedback Form Card -->
        <div class="col-10 q-mb-md">
          <q-card class="form-card">
            <q-card-section class="form-header bg-primary text-white">
              <div class="text-h6">{{ editMode ? t('feedback.form.updateTitle', {id: editId}) : t('feedback.form.title') }}</div>
              <div class="text-caption">{{ editMode ? t('feedback.form.updateSubtitle') : t('feedback.form.subtitle') }}</div>
            </q-card-section>

            <q-card-section class="q-pa-md">
              <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <!-- Ticket Type Selector -->
                <div class="form-section">
                  <div class="section-label">{{ t('feedback.form.typeQuestion') }}</div>
                  <div class="q-gutter-md">
                    <q-radio v-model="form.type" val="Issue" :label="t('feedback.form.typeIssue')" color="negative" />
                    <q-radio v-model="form.type" val="Feedback" :label="t('feedback.form.typeFeedback')" color="info" />
                    <q-radio v-model="form.type" val="Feature Request" :label="t('feedback.form.typeFeatureRequest')" color="purple" />
                    <q-radio v-model="form.type" val="Other" :label="t('feedback.form.typeOther')" color="grey-8" />
                  </div>
                </div>

                <!-- Priority Selector (Only for Issues) -->
                <q-slide-transition>
                  <div v-if="form.type === 'Issue'" class="priority-section q-my-sm">
                    <div class="section-label">{{ t('feedback.form.priorityQuestion') }}</div>
                    <div class="priority-buttons">
                      <q-btn-toggle
                        v-model="form.priority"
                        spread
                        unelevated
                        toggle-color="primary"
                        :options="[
                          {
                            label: t('feedback.form.priorityLow'),
                            value: 'Low',
                            color: 'green',
                            icon: form.priority === 'Low' ? 'check_circle' : undefined
                          },
                          {
                            label: t('feedback.form.priorityMedium'),
                            value: 'Medium',
                            color: 'orange',
                            icon: form.priority === 'Medium' ? 'check_circle' : undefined
                          },
                          {
                            label: t('feedback.form.priorityHigh'),
                            value: 'High',
                            color: 'deep-orange',
                            icon: form.priority === 'High' ? 'check_circle' : undefined
                          },
                          {
                            label: t('feedback.form.priorityCritical'),
                            value: 'Critical',
                            color: 'negative',
                            icon: form.priority === 'Critical' ? 'check_circle' : undefined
                          }
                        ]"
                        class="full-width"
                      />
                    </div>
                    <div class="priority-description text-caption q-mt-xs">
                      <span v-if="form.priority === 'Low'">
                        <q-icon name="info" color="green" /> {{ t('feedback.form.priorityLowDesc') }}
                      </span>
                      <span v-else-if="form.priority === 'Medium'">
                        <q-icon name="warning" color="orange" /> {{ t('feedback.form.priorityMediumDesc') }}
                      </span>
                      <span v-else-if="form.priority === 'High'">
                        <q-icon name="priority_high" color="deep-orange" /> {{ t('feedback.form.priorityHighDesc') }}
                      </span>
                      <span v-else-if="form.priority === 'Critical'">
                        <q-icon name="report_problem" color="negative" /> {{ t('feedback.form.priorityCriticalDesc') }}
                      </span>
                    </div>
                  </div>
                </q-slide-transition>

                <!-- Subject Field -->
                <div class="form-field">
                  <q-input
                    v-model="form.subject"
                    outlined
                    :label="t('feedback.form.subject') + ' *'"
                    :placeholder="t('feedback.form.subjectPlaceholder')"
                    lazy-rules
                    bg-color="white"
                    class="subject-input"
                    :rules="[
                      val => !!val || t('Subject is required'),
                      val => val.length <= 100 || t('Subject must be less than 100 characters')
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="title" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Description Field -->
                <div class="form-field">
                  <q-input
                    v-model="form.description"
                    type="textarea"
                    outlined
                    :label="t('feedback.form.description') + ' *'"
                    :placeholder="t('feedback.form.descriptionPlaceholder')"
                    lazy-rules
                    bg-color="white"
                    rows="5"
                    :rules="[val => !!val || t('Please provide a description')]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="description" color="primary" />
                    </template>
                  </q-input>
                </div>

                <!-- Contact Information Section -->
                <div class="contact-section q-pa-sm q-mt-md">
                  <div class="section-label text-primary q-mb-sm">{{ t('feedback.form.contactInfo') }}</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.name"
                        outlined
                        :label="t('feedback.form.name') + ' *'"
                        :placeholder="t('feedback.form.namePlaceholder')"
                        lazy-rules
                        bg-color="white"
                        :rules="[val => !!val || t('Name is required')]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="person" color="primary" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="form.email"
                        outlined
                        :label="t('feedback.form.email') + ' *'"
                        :placeholder="t('feedback.form.emailPlaceholder')"
                        type="email"
                        lazy-rules
                        bg-color="white"
                        :rules="[
                          val => !!val || t('Email is required'),
                          val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || t('Please enter a valid email')
                        ]"
                      >
                        <template v-slot:prepend>
                          <q-icon name="email" color="primary" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>

                <!-- Form Buttons -->
                <div class="row justify-end q-gutter-sm q-mt-lg">
                  <q-btn
                    outline
                    :label="t('feedback.form.cancel')"
                    type="reset"
                    color="grey-7"
                    v-if="editMode"
                    class="q-px-md"
                  />
                  <q-btn
                    outline
                    :label="t('feedback.form.reset')"
                    type="reset"
                    color="warning"
                    v-else-if="formNotEmpty"
                    class="q-px-md"
                  />
                  <q-btn
                    unelevated
                    :label="editMode ? t('feedback.form.update') : t('feedback.form.submit')"
                    type="submit"
                    color="primary"
                    class="q-px-md"
                    :loading="submitting"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- Tickets Table Card -->
        <div class="col-10 justify-center">
          <q-card class="table-card">
            <q-card-section class="table-header bg-secondary text-white">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6">{{ t('feedback.table.title') }}</div>
                  <div class="text-caption">{{ t('feedback.table.subtitle') }}</div>
                </div>

                <!--  Print Button -->
                <print-report
                  :title="t('feedback.report.title')"
                  :subtitle="t('feedback.report.subtitle')"
                  :tableTitle="t('feedback.report.tableTitle')"
                  :table-data="tickets"
                  :columns="printColumns"
                  :summary-data="ticketSummary"
                  :formatters="ticketFormatters"
                  :button-label="t('feedback.report.print')"
                  button-icon="print"
                  button-outline
                  button-color="white"
                  :notes="t('feedback.report.notes')"
                  pdf-filename="support-tickets-report.pdf"
                />
              </div>
            </q-card-section>

            <q-card-section class="q-pa-md">
              <div class="search-bar q-mb-md">
                <q-input
                  v-model="filter"
                  dense
                  outlined
                  :placeholder="t('feedback.table.search')"
                  class="full-width"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="filter"
                      name="clear"
                      class="cursor-pointer"
                      @click="filter = ''"
                    />
                  </template>
                </q-input>
              </div>

              <q-table
                :rows="tickets"
                :columns="columns"
                row-key="id"
                :filter="filter"
                :loading="loading"
                :pagination.sync="pagination"
                bordered
                flat
                :rows-per-page-options="[5, 10, 20, 0]"
                class="tickets-table"
              >
                <template v-slot:loading>
                  <q-inner-loading showing color="primary">
                    <q-spinner size="50px" color="primary" />
                  </q-inner-loading>
                </template>

                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      class="table-header-cell"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props" :class="{'bg-blue-1': props.row.id === editId}">
                    <q-td key="id" :props="props" auto-width>
                      <div class="text-weight-medium">#{{ props.row.id }}</div>
                    </q-td>
                    <q-td key="type" :props="props">
                      <q-chip
                        :color="getTypeColor(props.row.type)"
                        text-color="white"
                        size="md"
                        dense
                      >
                        {{ props.row.type }}
                      </q-chip>
                    </q-td>
                    <q-td key="subject" :props="props">
                      <div class="ellipsis" style="max-width: 180px">
                        {{ props.row.subject }}
                      </div>
                    </q-td>
                    <q-td key="priority" :props="props">
                      <q-chip
                        v-if="props.row.priority"
                        :color="getPriorityColor(props.row.priority)"
                        text-color="white"
                        size="md"
                        dense
                      >
                        {{ props.row.priority }}
                      </q-chip>
                      <span v-else class="text-grey">--</span>
                    </q-td>
                    <q-td key="status" :props="props">
                      <q-select
                        v-model="props.row.status"
                        :options="[
                          { value: 'New', label: t('feedback.table.status.new'), color: 'blue' },
                          { value: 'In Progress', label: t('feedback.table.status.inProgress'), color: 'orange' },
                          { value: 'Resolved', label: t('feedback.table.status.resolved'), color: 'green' },
                          { value: 'Closed', label: t('feedback.table.status.closed'), color: 'grey' }
                        ]"
                        dense
                        options-dense
                        emit-value
                        map-options
                        popup-content-class="status-popup"
                        style="min-width: 140px"
                        @update:model-value="updateStatus(props.row)"
                      >
                        <template v-slot:selected>
                          <q-badge :color="getStatusColor(props.row.status)">
                            {{ props.row.status }}
                          </q-badge>
                        </template>
                      </q-select>
                    </q-td>
                    <q-td key="actions" :props="props" auto-width>
                      <div class="row no-wrap q-gutter-xs">
                        <q-btn
                          flat
                          round
                          dense
                          color="info"
                          icon="visibility"
                          @click="viewTicket(props.row)"
                        >
                          <q-tooltip>{{ t('feedback.table.actions.view') }}</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          color="warning"
                          icon="edit"
                          @click="editTicket(props.row)"
                        >
                          <q-tooltip>{{ t('feedback.table.actions.edit') }}</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          color="negative"
                          icon="delete"
                          @click="confirmDelete(props.row)"
                        >
                          <q-tooltip>{{ t('feedback.table.actions.delete') }}</q-tooltip>
                        </q-btn>
                      </div>
                    </q-td>
                  </q-tr>
                </template>

                <template v-slot:no-data>
                  <div class="full-width text-center q-pa-lg text-grey-8">
                    <q-icon name="inbox" size="2em" class="q-mb-sm" />
                    <div>{{ t('feedback.table.noData') }}</div>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Ticket Detail Dialog -->
    <q-dialog v-model="detailDialog" persistent>
      <q-card class="detail-dialog" style="width: 700px; max-width: 90vw">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6">{{ t('feedback.details.title') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedTicket" class="q-pt-md">
          <div class="text-h5 q-mb-md">{{ selectedTicket.subject }}</div>

          <!-- Horizontal ticket info row -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6 col-sm-3">
              <q-card flat bordered class="ticket-info-card">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey">{{ t('feedback.details.ticketId') }}</div>
                  <div class="text-weight-medium">#{{ selectedTicket.id }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-sm-3">
              <q-card flat bordered class="ticket-info-card">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey">{{ t('feedback.details.type') }}</div>
                  <div class="q-mt-xs">
                    <q-chip :color="getTypeColor(selectedTicket.type)" text-color="white" size="md" dense>
                      {{ selectedTicket.type }}
                    </q-chip>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-sm-3">
              <q-card flat bordered class="ticket-info-card">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey">{{ t('feedback.details.priority') }}</div>
                  <div class="q-mt-xs">
                    <q-chip v-if="selectedTicket.priority" :color="getPriorityColor(selectedTicket.priority)" text-color="white" size="md" dense>
                      {{ selectedTicket.priority }}
                    </q-chip>
                    <span v-else class="text-grey">{{ t('feedback.details.na') }}</span>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6 col-sm-3">
              <q-card flat bordered class="ticket-info-card">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption text-grey">{{ t('feedback.details.status') }}</div>
                  <div class="q-mt-xs">
                    <q-chip :color="getStatusColor(selectedTicket.status)" text-color="white" size="md" dense>
                      {{ selectedTicket.status }}
                    </q-chip>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-separator class="q-mb-md" />

          <div class="scroll" style="max-height: 50vh">
            <div class="row q-col-gutter-md">
              <!-- Submitted info section -->
              <div class="col-12">
                <q-list bordered separator class="rounded-borders">
                                    <q-item>
                    <q-item-section avatar>
                      <q-icon name="person" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>{{ t('feedback.details.submittedBy') }}</q-item-label>
                      <q-item-label>{{ selectedTicket.name }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="email" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>{{ t('feedback.details.contactEmail') }}</q-item-label>
                      <q-item-label>
                        <a :href="`mailto:${selectedTicket.email}`">{{ selectedTicket.email }}</a>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="event" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>{{ t('feedback.details.submittedOn') }}</q-item-label>
                      <q-item-label>{{ formatDate(selectedTicket.createdAt, true) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!-- Description section -->
              <div class="col-12 q-mt-md">
                <div class="text-subtitle1 q-mb-sm">
                  <q-icon name="description" color="primary" /> {{ t('feedback.details.description') }}
                </div>
                <q-card flat bordered class="bg-grey-1">
                  <q-card-section class="q-pa-sm" style="white-space: pre-line">
                    {{ selectedTicket.description }}
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat :label="t('feedback.details.edit')" color="warning" @click="editFromDetail" v-close-popup />
          <q-btn flat :label="t('feedback.details.close')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center bg-negative text-white">
          <q-avatar icon="warning" text-color="white" />
          <span class="q-ml-sm text-subtitle1">{{ t('feedback.delete.title') }}</span>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          {{ t('feedback.delete.message', { id: selectedTicket?.id }) }}
          <div class="text-caption text-grey q-mt-sm">{{ t('feedback.delete.warning') }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="t('feedback.delete.cancel')" color="primary" v-close-popup />
          <q-btn flat :label="t('feedback.delete.confirm')" color="negative" @click="deleteTicket" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { saveToLocalStorage, loadFromLocalStorage } from '../Functionality/FeedBack'
import PrintReport from '../components/PrintReport.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const $q = useQuasar()

const initialForm = {
  type: 'Feedback',
  priority: 'Medium',
  subject: '',
  description: '',
  email: '',
  name: ''
}

const form = reactive({ ...initialForm })
const editMode = ref(false)
const editId = ref(null)
const submitting = ref(false)

const formNotEmpty = computed(() => {
  return form.subject !== '' ||
         form.description !== '' ||
         form.email !== '' ||
         form.name !== '' ||
         form.type !== initialForm.type ||
         (form.type === 'Issue' && form.priority !== initialForm.priority)
})

const tickets = ref([])
const loading = ref(false)
const filter = ref('')
const pagination = ref({
  rowsPerPage: 10
})

const detailDialog = ref(false)
const deleteDialog = ref(false)
const selectedTicket = ref(null)


const columns = [
  { name: 'id', label: t('feedback.table.columns.id'), field: 'id', sortable: true, align: 'left' },
  { name: 'type', label: t('feedback.table.columns.type'), field: 'type', sortable: true, align: 'left' },
  { name: 'subject', label: t('feedback.table.columns.subject'), field: 'subject', sortable: true, align: 'left' },
  { name: 'priority', label: t('feedback.table.columns.priority'), field: 'priority', sortable: true, align: 'left' },
  { name: 'status', label: t('feedback.table.columns.status'), field: 'status', sortable: true, align: 'left' },
  { name: 'actions', label: t('feedback.table.columns.actions'), field: 'actions', align: 'center' }
]

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

const printColumns = computed(() => {
  if (!tickets.value || tickets.value.length === 0) return []

  const allFields = new Set()

  tickets.value.forEach(ticket => {
    Object.keys(ticket).forEach(key => {
      if (!['actions', '__v', '_id'].includes(key)) {
        allFields.add(key)
      }
    })
  })

  const preferredOrder = ['id', 'name','type', 'subject', 'description', 'priority', 'status', 'email', 'createdAt']


  const sortedFields = [...allFields].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a)
    const bIndex = preferredOrder.indexOf(b)


    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex

    if (aIndex >= 0) return -1
    if (bIndex >= 0) return 1

    // Otherwise, sort alphabetically
    return a.localeCompare(b)
  })

  return sortedFields.map(key => {
    let columnWidth = '10%'
    if (key === 'id') columnWidth = '5%'
    else if (key === 'subject') columnWidth = '25%'
    else if (key === 'description') columnWidth = '30%'
    else if (key === 'createdAt') columnWidth = '15%'


    return {
      name: key,
      label: formatLabel(key),
      field: key,
      align: 'left',
      style: `width: ${columnWidth}`,
      format: key === 'createdAt' ? (val => formatDate(val, true)) : undefined
    }
  })
})

const ticketFormatters = computed(() => {
  const formatters = {
    type: {
      formatter: (value) => value,
      component: 'q-chip',
      props: {
        color: (_, row) => getTypeColor(row.type),
        textColor: 'white',
        dense: true,
        size: 'sm'
      }
    },
    priority: {
      formatter: (value) => value || 'N/A',
      component: 'q-chip',
      props: {
        color: (value) => value ? getPriorityColor(value) : 'grey-5',
        textColor: 'white',
        dense: true,
        size: 'sm'
      }
    },
    status: {
      formatter: (value) => value,
      component: 'q-chip',
      props: {
        color: (_, row) => getStatusColor(row.status),
        textColor: 'white',
        dense: true,
        size: 'sm'
      }
    },
    createdAt: {
      formatter: (value) => formatDate(value, true)
    },
    subject: {
      formatter: (value) => value,
      wrapText: true
    },
    description: {
      formatter: (value) => value,
      wrapText: true,
      maxLines: 5
    },
    email: {
      formatter: (value) => value,
      component: 'a',
      props: {
        href: (value) => `mailto:${value}`,
        style: 'color: #1976d2; text-decoration: none;'
      }
    }
  }

  if (tickets.value && tickets.value.length > 0) {
    const sampleTicket = tickets.value[0]

    Object.entries(sampleTicket).forEach(([key, value]) => {
      if (formatters[key] || ['actions', '__v', '_id'].includes(key)) {
        return
      }

      if (value instanceof Date) {
        formatters[key] = {
          formatter: (value) => formatDate(value, true)
        }
      } else if (typeof value === 'string' && value.includes('@')) {
        formatters[key] = {
          formatter: (value) => value,
          component: 'a',
          props: {
            href: (value) => `mailto:${value}`,
            style: 'color: #1976d2; text-decoration: none;'
          }
        }
      } else if (typeof value === 'boolean') {
        formatters[key] = {
          formatter: (value) => value ? 'Yes' : 'No',
          component: 'q-badge',
          props: {
            color: (value) => value ? 'positive' : 'grey-6',
            textColor: 'white',
            label: (value) => value ? 'Yes' : 'No'
          }
        }
      } else if (typeof value === 'string' && value.length > 50) {
        // Long text field
        formatters[key] = {
          formatter: (value) => value,
          wrapText: true,
          maxLines: 2
        }
      } else if (typeof value === 'number') {
        formatters[key] = {
          formatter: (value) => value.toLocaleString()
        }
      } else {
        // Default formatter
        formatters[key] = {
          formatter: (value) => value
        }
      }
    })
  }

  return formatters
})

const ticketSummary = computed(() => {
  const typeCounts = {}
  const statusCounts = {}
  let issueCount = 0

  tickets.value.forEach(ticket => {
    typeCounts[ticket.type] = (typeCounts[ticket.type] || 0) + 1

    // Count by status
    statusCounts[ticket.status] = (statusCounts[ticket.status] || 0) + 1

    // Count issues
    if (ticket.type === 'Issue') {
      issueCount++
    }
  })

  return {
    totalTickets: tickets.value.length,
    openTickets: statusCounts['New'] || 0,
    inProgressTickets: statusCounts['In Progress'] || 0,
    resolvedTickets: statusCounts['Resolved'] || 0,
    closedTickets: statusCounts['Closed'] || 0,
    issueCount: issueCount,
    feedbackCount: typeCounts['Feedback'] || 0,
    featureRequests: typeCounts['Feature Request'] || 0,
    otherTickets: typeCounts['Other'] || 0,
    dateRange: `${formatDate(getOldestTicketDate())} - ${formatDate(new Date())}`
  }
})

const onSubmit = () => {
  submitting.value = true

  setTimeout(() => {
    if (editMode.value) {
      const index = tickets.value.findIndex(t => t.id === editId.value)
      if (index !== -1) {
        const updatedTicket = {
          ...tickets.value[index],
          type: form.type,
          priority: form.type === 'Issue' ? form.priority : null,
          subject: form.subject,
          description: form.description,
          email: form.email,
          name: form.name
        }
        tickets.value.splice(index, 1, updatedTicket)

        saveToLocalStorage(tickets.value)

        $q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'update',
          message: `Ticket #${editId.value} updated successfully`,
          position: 'top'
        })
      }
    } else {
      const newId = tickets.value.length > 0
        ? Math.max(...tickets.value.map(t => t.id)) + 1
        : 1

      tickets.value.push({
        id: newId,
        type: form.type,
        priority: form.type === 'Issue' ? form.priority : null,
        subject: form.subject,
        description: form.description,
        email: form.email,
        name: form.name,
        status: 'New',
        createdAt: new Date()
      })

      saveToLocalStorage(tickets.value)

      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        message: 'Ticket submitted successfully',
        position: 'top'
      })
    }

    submitting.value = false
    onReset()
  }, 600)
}

const onReset = () => {
  Object.assign(form, initialForm)
  editMode.value = false
  editId.value = null
}

const viewTicket = (ticket) => {
  selectedTicket.value = ticket
  detailDialog.value = true
}

const editTicket = (ticket) => {
  editMode.value = true
  editId.value = ticket.id

  Object.assign(form, {
    type: ticket.type,
    priority: ticket.priority || 'Medium',
    subject: ticket.subject,
    description: ticket.description,
    email: ticket.email,
    name: ticket.name
  })

  const element = document.querySelector('.form-card')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const editFromDetail = () => {
  if (selectedTicket.value) {
    editTicket(selectedTicket.value)
  }
}

const confirmDelete = (ticket) => {
  selectedTicket.value = ticket
  deleteDialog.value = true
}

const deleteTicket = () => {
  const index = tickets.value.findIndex(t => t.id === selectedTicket.value.id)
  if (index !== -1) {
    tickets.value.splice(index, 1)

    saveToLocalStorage(tickets.value)

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'delete',
      message: `Ticket #${selectedTicket.value.id} deleted`,
      position: 'top'
    })
  }
}

const updateStatus = (ticket) => {
  saveToLocalStorage(tickets.value)

  $q.notify({
    color: 'info',
    textColor: 'white',
    icon: 'update',
    message: `Ticket #${ticket.id} status updated to ${ticket.status}`,
    position: 'top'
  })
}

const formatDate = (date, includeTime = false) => {
  if (!date) return '-'
  const d = new Date(date)

  if (includeTime) {
    return d.toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  } else {
    return d.toLocaleDateString('en-US', {
      dateStyle: 'short'
    })
  }
}


const getTypeColor = (type) => {
  const colors = {
    'Issue': 'negative',
    'Feedback': 'info',
    'Feature Request': 'purple',
    'Other': 'grey-8'
  }
  return colors[type] || 'grey-8'
}

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'green',
    'Medium': 'orange',
    'High': 'deep-orange',
    'Critical': 'negative'
  }
  return colors[priority] || 'grey-8'
}

const getStatusColor = (status) => {
  const colors = {
    'New': 'blue',
    'In Progress': 'orange',
    'Resolved': 'green',
    'Closed': 'grey'
  }
  return colors[status] || 'grey-8'
}


const getOldestTicketDate = () => {
  if (tickets.value.length === 0) return new Date()

  return new Date(Math.min(...tickets.value.map(ticket =>
    new Date(ticket.createdAt).getTime())
  ))
}

onMounted(() => {
  loading.value = true

  setTimeout(() => {
    const storedTickets = loadFromLocalStorage()

    if (storedTickets.length > 0) {
      tickets.value = storedTickets
    } else {
      tickets.value = [
        {
          id: 1,
          type: 'Issue',
          priority: 'High',
          subject: 'Website is not loading correctly on mobile devices',
          description: 'When accessing the website from my iPhone, the navigation menu does not work properly. Menu items appear off-screen and I cannot click on them.',
          email: 'john.doe@example.com',
          name: 'John Doe',
          status: 'New',
          createdAt: new Date(2023, 10, 15, 9, 30)
        },
        {
          id: 2,
          type: 'Feedback',
          priority: null,
          subject: 'Love the new dashboard design',
          description: 'The recent update to the dashboard looks amazing. Much more intuitive and easier to navigate. Great job on the UI improvements!',
          email: 'sarah.smith@example.com',
          name: 'Sarah Smith',
          status: 'Closed',
          createdAt: new Date(2023, 10, 14, 14, 45)
        },
        {
          id: 3,
          type: 'Feature Request',
          priority: null,
          subject: 'Add dark mode to the application',
          description: 'It would be great if you could add a dark mode option for better night-time viewing. Many users work late and the bright interface can be straining on the eyes.',
          email: 'tech.guy@example.com',
          name: 'Alex Johnson',
          status: 'In Progress',
          createdAt: new Date(2023, 10, 10, 11, 20)
        }
      ]

      saveToLocalStorage(tickets.value)
    }

    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.page-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.form-card, .table-card {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.form-card:hover, .table-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.form-header, .table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.form-section {
  margin-bottom: 18px;
}

.section-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.contact-section {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.priority-section {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.priority-description {
  margin-top: 8px;
  color: #666;
}

.detail-dialog {
  border-radius: 8px;
}

.table-header-cell {
  font-weight: 500;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-popup {
  min-width: 150px;
}

.ticket-info-card {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.02);
}

.ticket-info-card .q-card-section {
  padding: 8px 12px;
}
</style>
