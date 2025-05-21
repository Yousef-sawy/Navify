<template>
  <div class="q-pa-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ t('print.sections.reportInfo.title') }}</div>
        <p class="text-caption q-mb-md">{{ t('print.sections.reportInfo.description') }}</p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="reportTitle"
              :label="t('print.inputs.reportTitle.label')"
              :rules="[val => !!val || t('print.inputs.reportTitle.rules.required')]"
              outlined
              dense
              class="q-mb-md"
              :hint="t('print.inputs.reportTitle.hint')"
              :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="reportSubtitle"
              :label="t('print.inputs.reportSubtitle.label')"
              outlined
              dense
              class="q-mb-md"
              :hint="t('print.inputs.reportSubtitle.hint')"
              :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="tableTitle"
              :label="t('print.inputs.tableTitle.label')"
              :placeholder="t('print.inputs.tableTitle.placeholder')"
              outlined
              dense
              class="q-mb-md"
              :hint="t('print.inputs.tableTitle.hint')"
              :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
            />
          </div>
        </div>

        <!-- Notes section integrated into the top card -->
        <q-separator class="q-my-md" />

        <div class="row items-center">
          <div class="text-subtitle1 q-mb-sm">{{ t('print.sections.notes.title') }}</div>
          <q-space />
          <q-toggle v-model="includeNotes" :label="t('print.inputs.notesToggle.label')" />
        </div>

        <div v-if="includeNotes">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="notesTitle"
                :label="t('print.inputs.notesTitle.label')"
                outlined
                dense
                class="q-mb-md"
                :hint="t('print.inputs.notesTitle.hint')"
                :rules="[val => !!val || t('print.inputs.notesTitle.rules.required')]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="notesData"
                type="textarea"
                :label="t('print.inputs.notesContent.label')"
                outlined
                class="scrollable-textarea q-mb-md"
                :hint="t('print.inputs.notesContent.hint')"
                :rules="[val => !!val || t('print.inputs.notesContent.rules.required')]"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ t('print.sections.tableData.title') }}</div>
        <p class="text-caption q-mb-md">{{ t('print.sections.tableData.description') }}</p>

        <!-- JSON Input Method with automatic validation -->
        <q-input
          v-model="jsonData"
          type="textarea"
          filled
          class="scrollable-textarea q-mb-md"
          :label="t('print.inputs.jsonData.label')"
          :hint="t('print.inputs.jsonData.hint')"
          :rules="[
            val => !!val || t('print.inputs.jsonData.rules.required'),
            val => validateJson(val) || t('print.inputs.jsonData.rules.invalid')
          ]"
          :class="['subject-input', { 'rtl-input': $i18n.locale === 'ar' }]"
        />
        <div class="q-mb-md">
          <q-badge v-if="isJsonValid === true" color="positive" :label="t('print.badges.validJson')" />
          <q-badge v-else-if="isJsonValid === false" color="negative" :label="t('print.badges.invalidJson')" />
        </div>
        <div v-if="jsonValidationError" class="text-negative q-mb-md">
          {{ jsonValidationError }}
        </div>
        <q-card flat bordered class="q-mt-md bg-grey-1">
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2">JSON Format Requirements</div>
            <ul class="q-mb-none">
              <li v-for="(requirement, index) in jsonRequirements" :key="index" v-html="requirement"></li>
            </ul>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>

    <!-- Export button section with validation messages -->
    <div class="row justify-between items-center q-mt-md">
      <div class="validation-messages" v-if="!isFormValid">
        <div v-if="!reportTitle" class="text-negative q-mb-xs">
          <q-icon name="error_outline" size="xs" class="q-mr-xs" />
          {{ t('print.notifications.missingTitle') }}
        </div>
        <div v-if="isJsonValid === false || finalData.length === 0" class="text-negative q-mb-xs">
          <q-icon name="error_outline" size="xs" class="q-mr-xs" />
          {{ t('print.notifications.invalidData') }}
        </div>
        <div v-if="includeNotes && (!notesTitle || !notesData)" class="text-negative q-mb-xs">
          <q-icon name="error_outline" size="xs" class="q-mr-xs" />
          {{ t('print.notifications.incompleteNotes') }}
        </div>
      </div>

      <q-space />

      <div>
        <div v-if="isFormValid">
          <PDFExport
            :title="reportTitle"
            :subtitle="reportSubtitle"
            :tableTitle="effectiveTableTitle"
            :tableData="finalData"
            :columns="finalColumns"
            :notesTitle="includeNotes ? notesTitle : ''"
            :notes_data="includeNotes ? notesData : ''"
            :rtl="$i18n.locale === 'ar'"
            :excelFilename="reportTitle ? `${reportTitle.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.xlsx` : null"
          />
        </div>
        <q-btn
          v-else
          color="primary"
          :label="t('print.buttons.exportPdf')"
          icon="file_upload"
          disabled
          class="q-mr-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import PDFExport from '../components/PrintReport.vue';

const $q = useQuasar();
const { t } = useI18n();

const reportTitle = ref('');
const reportSubtitle = ref('');
const tableTitle = ref('');
const jsonData = ref('');
const includeNotes = ref(false);
const notesTitle = ref('');
const notesData = ref('');

const isJsonValid = ref(null);
const jsonValidationError = ref('');

const finalData = ref([]);
const finalColumns = ref([]);
const uniqueParents = ref([]);

// Hardcoded requirements
const jsonRequirements = [
  'Property names must be in double quotes: <code>"name": "value"</code>',
  'Strings must use double quotes: <code>"John"</code> not <code>\'John\'</code>',
  'No trailing commas: <code>[1, 2]</code> not <code>[1, 2,]</code>',
  'IDs must be unique within the dataset',
  'Missing fields in objects will display as "undefined" in the table'
];

const effectiveTableTitle = computed(() => {
  return tableTitle.value || t('print.inputs.tableTitle.default');
});

const isFormValid = computed(() => {
  const basicInfoValid = !!reportTitle.value;
  const dataValid = isJsonValid.value === true && finalData.value.length > 0;
  const notesValid = !includeNotes.value || (includeNotes.value && !!notesTitle.value && !!notesData.value);

  return basicInfoValid && dataValid && notesValid;
});

// Basic JSON validation function
const validateJson = (jsonString) => {
  try {
    if (!jsonString) return false;
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    // Return false for invalid JSON
    return false;
  }
};

// Check for duplicate IDs in data
const hasDuplicateIds = (data) => {
  if (!Array.isArray(data) || data.length <= 1) return false;

  const ids = new Set();

  for (const item of data) {
    if (item.id !== undefined) {
      if (ids.has(item.id)) {
        return true;
      }
      ids.add(item.id);
    }
  }

  return false;
};

// Validate basic JSON data only check for duplicates
const validateJsonConsistency = (parsedData) => {
  const data = Array.isArray(parsedData) ? parsedData : [parsedData];

  if (hasDuplicateIds(data)) {
    return { valid: false, error: t('print.errors.duplicateIds') };
  }

  return { valid: true };
};

// collect all possible fields across all objects
const buildTableStructure = (dataArray) => {
  const allFields = new Set();
  dataArray.forEach(item => {
    Object.keys(item).forEach(key => {
      allFields.add(key);
    });
  });

  // Create headers for all discovered fields
  const headers = Array.from(allFields).map(field => ({
    name: field,
    label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
    field: field,
    sortable: true
  }));

  // Process data to ensure all objects have all fields (with "undefined" for missing fields)
  const processedData = dataArray.map(item => {
    const newItem = { ...item };

    // Add "undefined" for any missing fields
    allFields.forEach(field => {
      if (!newItem.hasOwnProperty(field)) {
        newItem[field] = "undefined";
      } else if (newItem[field] === null || newItem[field] === "") {
        newItem[field] = "undefined";
      }
    });

    return newItem;
  });

  return { headers, processedData };
};

// Validate and process JSON data
const validateAndPreviewJson = () => {
  if (!jsonData.value.trim()) {
    isJsonValid.value = null;
    jsonValidationError.value = '';
    finalData.value = [];
    finalColumns.value = [];
    return;
  }

  try {
    let jsonToValidate = jsonData.value;

    try {
      JSON.parse(jsonToValidate);
    } catch (e) {
      isJsonValid.value = false;
      jsonValidationError.value = t('print.errors.jsonSyntax');
      finalData.value = [];
      finalColumns.value = [];
      return;
    }

    const parsed = JSON.parse(jsonToValidate);
    const dataArray = Array.isArray(parsed) ? parsed : [parsed];
    const consistencyCheck = validateJsonConsistency(parsed);

    if (consistencyCheck.valid) {
      isJsonValid.value = true;
      jsonValidationError.value = '';

      // Create table structure with headers, processed data, and unique parents
      const { headers, processedData } = buildTableStructure(dataArray);
      finalColumns.value = headers;
      finalData.value = processedData;
    } else {
      isJsonValid.value = false;
      jsonValidationError.value = consistencyCheck.error;
      finalData.value = [];
      finalColumns.value = [];
    }
  } catch (error) {
    isJsonValid.value = false;
    jsonValidationError.value = t('print.errors.jsonGeneral');
    finalData.value = [];
    finalColumns.value = [];
  }
};

// Add a watcher to automatically validate JSON when it changes
watch(jsonData, () => {
  // Add a small delay to avoid validating during typing
  const debounceTimeout = setTimeout(() => {
    validateAndPreviewJson();
  },);

  return () => clearTimeout(debounceTimeout);
}, { deep: true });

// Watch notes fields to update form validity
watch([includeNotes, notesTitle, notesData, reportTitle], () => {
});

const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('selectedLanguage', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
</script>

<style scoped>
.scrollable-textarea {
  max-height: 200px;
}

.scrollable-textarea :deep(.q-field__native) {
  resize: vertical;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto !important;
}

.scrollable-textarea :deep(textarea) {
  resize: none !important;
  overflow-y: auto !important;
}

.q-card {
  border-radius: 8px;
}

.code-example {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
}

.validation-messages {
  font-size: 0.95rem;
  max-width: 70%;

}

.validation-messages .text-negative {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
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


