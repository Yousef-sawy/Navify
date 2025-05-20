<template>
  <div class="q-pa-md">
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Report Information</div>
        <p class="text-caption q-mb-md">Enter the basic information for your report header and title.</p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="reportTitle"
              label="Report Title *"
              :rules="[val => !!val || 'Title is required']"
              outlined
              dense
              class="q-mb-md"
              hint="The main title that appears at the top of the report"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="reportSubtitle"
              label="Report Subtitle"
              outlined
              dense
              class="q-mb-md"
              hint="Optional secondary title below the main title"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="tableTitle"
              label="Table Title"
              placeholder="Data Table"
              outlined
              dense
              class="q-mb-md"
              hint="Heading that appears directly above the data table"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Table Data</div>
        <p class="text-caption q-mb-md">Enter your data in JSON format. The system will automatically detect all fields across your entries.</p>

        <!-- JSON Input Method -->
        <q-input
          v-model="jsonData"
          type="textarea"
          filled
          class="scrollable-textarea q-mb-md"
          label="Enter your data in JSON format"
          hint='Single object or array of objects. Example: [{ "id": 1, "name": "John" }]'
          :rules="[
            val => !!val || 'JSON data is required',
            val => validateJson(val) || 'Invalid JSON format'
          ]"
        />
        <div class="q-mb-md">
          <q-btn
            color="primary"
            label="Validate JSON"
            @click="validateAndPreviewJson"
            class="q-mr-sm"
          />
          <q-badge v-if="isJsonValid === true" color="positive" label="Valid JSON" />
          <q-badge v-else-if="isJsonValid === false" color="negative" label="Invalid JSON" />
        </div>
        <div v-if="jsonValidationError" class="text-negative q-mb-md">
          {{ jsonValidationError }}
        </div>
        <q-card flat bordered class="q-mt-md bg-grey-1">
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2">JSON Format Requirements:</div>
            <ul class="q-mb-none">
              <li>Property names must be in double quotes: <code>"name": "value"</code></li>
              <li>Strings must use double quotes: <code>"John"</code> not <code>'John'</code></li>
              <li>No trailing commas: <code>[1, 2]</code> not <code>[1, 2,]</code></li>
              <li>IDs must be unique within the dataset</li>
              <li>Missing fields in objects will display as "undefined" in the table</li>
            </ul>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="text-h6">Notes Section</div>
          <q-space />
          <q-toggle v-model="includeNotes" label="Include Notes" />
        </div>

        <p class="text-caption q-mb-md" v-if="includeNotes">Add optional notes or explanations to appear at the bottom of the report.</p>

        <div v-if="includeNotes" class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="notesTitle"
              label="Notes Title"
              outlined
              dense
              class="q-mb-md"
              hint="The heading for your notes section"
              :rules="[val => !!val || 'Notes title is required when notes are enabled']"
            />
          </div>
          <div class="col-12 col-md-8">
            <q-input
              v-model="notesData"
              type="textarea"
              label="Notes Content"
              outlined
              class="scrollable-textarea q-mb-md"
              hint="Text content for your notes (supports multiple paragraphs)"
              :rules="[val => !!val || 'Notes content is required when notes are enabled']"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Export button section -->
    <div class="row justify-end q-mt-md">
      <div v-if="isFormValid">
        <PDFExport
          :title="reportTitle"
          :subtitle="reportSubtitle"
          :tableTitle="effectiveTableTitle"
          :tableData="finalData"
          :columns="finalColumns"
          :notesTitle="includeNotes ? notesTitle : ''"
          :notes_data="includeNotes ? notesData : ''"
          :rtl="true"
        />
      </div>
      <q-btn
        v-else
        color="primary"
        label="Export PDF Report"
        icon="picture_as_pdf"
        disabled
        class="q-mr-sm"
        @click="validateAll"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import PDFExport from '../components/PrintReport.vue';

const $q = useQuasar();

// Form data
const reportTitle = ref('');
const reportSubtitle = ref('');
const tableTitle = ref('');
const jsonData = ref('');
const includeNotes = ref(false);
const notesTitle = ref('');
const notesData = ref('');

// Validation states
const isJsonValid = ref(null);
const jsonValidationError = ref('');

// Final processed data
const finalData = ref([]);
const finalColumns = ref([]);
const uniqueParents = ref([]);

// Computed property for effective table title (with default value)
const effectiveTableTitle = computed(() => {
  return tableTitle.value || 'Data Table';
});

// Computed property to check if form is valid
const isFormValid = computed(() => {
  const basicInfoValid = !!reportTitle.value; // Only report title is required
  const dataValid = isJsonValid.value === true;
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
        return true; // Found duplicate ID
      }
      ids.add(item.id);
    }
  }

  return false;
};

// Validate basic JSON data (only check for duplicates)
const validateJsonConsistency = (parsedData) => {
  // Convert single object to array for consistent processing
  const data = Array.isArray(parsedData) ? parsedData : [parsedData];

  // if (data.length === 0) {
  //   return { valid: false, error: 'Data cannot be empty' };
  // }

  // Check for duplicate IDs
  if (hasDuplicateIds(data)) {
    return { valid: false, error: 'Data contains duplicate ID values' };
  }

  // No more strict field validation - allowing objects with different fields
  return { valid: true };
};

// Process data and normalize fields across all objects
const buildTableStructure = (dataArray) => {
  // First pass: collect all possible fields across all objects
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

  // Collect unique parent values if parent field exists
  const parentValues = [];
  dataArray.forEach(item => {
    if (item.parent !== undefined && item.parent !== null && item.parent !== "") {
      if (!parentValues.includes(item.parent)) {
        parentValues.push(item.parent);
      }
    }
  });

  // Process data to ensure all objects have all fields (with "undefined" for missing fields)
  const processedData = dataArray.map(item => {
    const newItem = { ...item };

    // Add "undefined" for any missing fields
    allFields.forEach(field => {
      if (!newItem.hasOwnProperty(field)) {
        newItem[field] = "undefined";
      } else if (newItem[field] === null || newItem[field] === "") {
        // Also replace null or empty values with "undefined" text
        newItem[field] = "undefined";
      }
    });

    return newItem;
  });

  return { headers, processedData, parentValues };
};

// Validate and process JSON data
const validateAndPreviewJson = () => {
  try {
    let jsonToValidate = jsonData.value;

    try {
      // Try to parse the JSON
      JSON.parse(jsonToValidate);
    } catch (e) {
      // If parsing fails, show the error
      isJsonValid.value = false;
      jsonValidationError.value = 'Invalid JSON format. Please check for proper syntax including quotes and commas.';
      return;
    }

    const parsed = JSON.parse(jsonToValidate);
    const dataArray = Array.isArray(parsed) ? parsed : [parsed];
    const consistencyCheck = validateJsonConsistency(parsed);

    if (consistencyCheck.valid) {
      isJsonValid.value = true;
      jsonValidationError.value = '';

      // Create table structure with headers, processed data, and unique parents
      const { headers, processedData, parentValues } = buildTableStructure(dataArray);
      finalColumns.value = headers;
      finalData.value = processedData;
      uniqueParents.value = parentValues;

      console.log("Unique parents:", uniqueParents.value);
      console.log("Columns:", headers);
      console.log("Sample data:", processedData[0]);
    } else {
      isJsonValid.value = false;
      jsonValidationError.value = consistencyCheck.error;
    }
  } catch (error) {
    isJsonValid.value = false;
    jsonValidationError.value = 'Error in JSON code. Please check syntax.';
  }
};

// Validate all form data when disabled button is clicked
const validateAll = () => {
  // Check if JSON validation needs to be run
  if (!isJsonValid.value) {
    validateAndPreviewJson();
  }

  // Show a notification about what's missing
  if (!reportTitle.value) {
    $q.notify({
      color: 'negative',
      message: 'Please fill in the required Report Title field',
      icon: 'error'
    });
  } else if (!isJsonValid.value) {
    $q.notify({
      color: 'negative',
      message: 'Please validate your data before generating a report',
      icon: 'error'
    });
  } else if (includeNotes.value && (!notesTitle.value || !notesData.value)) {
    $q.notify({
      color: 'negative',
      message: 'Please complete the notes section or disable it',
      icon: 'error'
    });
  }
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}

.scrollable-textarea {
  max-height: 200px;
}

/* Make textareas scrollable with fixed height */
.scrollable-textarea :deep(.q-field__native) {
  max-height: 200px;
  overflow-y: auto !important;
}

/* Ensure the textarea doesn't grow beyond the container */
.scrollable-textarea :deep(textarea) {
  resize: none !important;
  overflow-y: auto !important;
}

/* Code example styling */
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
</style>
