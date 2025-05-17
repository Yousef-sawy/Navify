<template>
  <div>
    <!-- Export Button -->
    <q-btn
      :color="buttonColor || 'primary'"
      :icon="buttonIcon || 'picture_as_pdf'"
      :label="buttonLabel || 'Export PDF'"
      :flat="buttonFlat"
      :outline="buttonOutline"
      :round="buttonRound"
      :size="buttonSize || 'md'"
      @click="openPrintDialog"
    />

    <!-- Preview Dialog -->
    <q-dialog v-model="printDialog" persistent>
      <q-card class="print-dialog" style="width: 85vw; max-width: 1000px; max-height: 90vh;">
        <q-bar class="bg-primary text-white">
          <div class="text-h6">{{ title || 'PDF Preview' }}</div>
          <q-space />
          <q-btn dense flat icon="close" @click="printDialog = false">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="scroll" style="max-height: calc(90vh - 120px)">
          <div id="print-content" class="print-content q-pa-md">
            <!-- Header section -->
            <div class="print-header q-mb-lg">
              <div class="text-h5 text-center">{{ title || 'Report' }}</div>
              <div v-if="subtitle" class="text-subtitle1 text-center text-grey-7">
                {{ subtitle }}
              </div>
              <div class="text-caption text-right q-mt-sm">
                Generated on: {{ formatDate(new Date(), true) }}
              </div>
            </div>

            <!-- Summary section -->
            <div v-if="summaryData && Object.keys(summaryData).length" class="summary-section q-mb-md">
              <div class="text-subtitle1 q-mb-xs">{{ summaryTitle || 'Summary' }}</div>
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="(value, key) in summaryData"
                      :key="key"
                      class="col-12 col-sm-4 col-md-3"
                    >
                      <div class="text-caption text-grey">{{ formatLabel(key) }}</div>
                      <div class="text-body2">{{ value }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Table Data Section -->
            <div v-if="tableData && tableData.length" class="table-section">
              <div class="text-subtitle1 q-mb-xs">{{ tableTitle || 'Data' }}</div>
              <!-- Scrollable table container -->
              <div class="print-table-container q-pa-none">
                <table class="print-table">
                  <thead>
                    <tr>
                      <th
                        v-for="col in effectiveColumns"
                        :key="col.name"
                        :style="col.style || ''"
                      >
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in tableData" :key="getRowKey(row, rowIndex)">
                      <td
                        v-for="col in effectiveColumns"
                        :key="col.name"
                        :style="col.style || ''"
                      >
                        <div v-if="formatters && formatters[col.name]">
                          <!-- Format with custom formatter -->
                          <div v-if="formatters[col.name].wrapText"
                               :class="{'wrap-text': formatters[col.name].wrapText}"
                               :style="formatters[col.name].maxLines ?
                                      `max-height: ${formatters[col.name].maxLines * 1.5}em;
                                       overflow: hidden; text-overflow: ellipsis;` : ''">
                            {{ formatters[col.name].formatter(row[col.name], row) }}
                          </div>
                          <component
                            v-else
                            :is="formatters[col.name].component || 'div'"
                            v-bind="getFormatterProps(formatters[col.name].props, row[col.name], row)"
                          >
                            {{ formatters[col.name].formatter(row[col.name], row) }}
                          </component>
                        </div>
                        <div v-else-if="col.format">
                          {{ col.format(row[col.name], row) }}
                        </div>
                        <div v-else>
                          {{ row[col.name] }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Additional Content -->
            <slot name="additional-content"></slot>

            <div v-if="notes_data" class="notes-section q-mt-md">
              <div class="text-caption">{{ notesTitle }}</div>
              <div class="text-caption text-grey-8">{{ notes_data }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-white q-py-sm print-actions">
          <q-btn
            outline
            color="grey-7"
            icon="cancel"
            label="Cancel"
            dense
            @click="printDialog = false"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            color="primary"
            icon="picture_as_pdf"
            label="Export as PDF"
            dense
            @click="exportAsPDF"
            :loading="exporting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import amiriRegular from '../fonts/Amiri-Regular.ttf'

const $q = useQuasar()

// Props for component configuration
const props = defineProps({
  // Content props
  title: String,
  subtitle: String,
  tableTitle: String,
  tableData: Array,
  columns: Array,
  summaryData: Object,
  summaryTitle: String,
  notesTitle: String,
  notes_data: String,

  // Button appearance
  buttonColor: String,
  buttonIcon: String,
  buttonLabel: String,
  buttonFlat: Boolean,
  buttonOutline: Boolean,
  buttonRound: Boolean,
  buttonSize: String,

  // Custom formatters for table data
  formatters: Object,

  // PDF options
  pdfFilename: String,
  pdfOptions: Object,

  // Exclusion settings
  excludeFields: {
    type: Array,
    default: () => ['actions', '_id', '__v']
  },

  // Row key field (for unique identification)
  rowKey: {
    type: String,
    default: 'id'
  },

  // Language options
  rtl: {
    type: Boolean,
    default: false
  }
})

// State
const printDialog = ref(false)
const exporting = ref(false)

// Load Amiri font on mount to ensure it's available for the preview
onMounted(() => {
  // Load the Amiri font to ensure it's available for Arabic text
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = amiriRegular;
  document.head.appendChild(fontLink);
});

// Helper method to get a unique key for each row
const getRowKey = (row, fallbackIndex) => {
  // Try to use the specified rowKey field
  if (props.rowKey && row[props.rowKey] !== undefined) {
    return row[props.rowKey]
  }

  // If that fails, try common ID fields
  for (const key of ['id', '_id', 'key', 'uid']) {
    if (row[key] !== undefined) return row[key]
  }

  // Last resort: use the array index
  return fallbackIndex
}

// Dynamically generate columns based on the actual data
const effectiveColumns = computed(() => {
  // If columns are explicitly provided, use them
  if (props.columns && props.columns.length > 0) {
    return props.columns
  }

  // Otherwise, dynamically generate columns from the data
  if (props.tableData && props.tableData.length > 0) {
    // Gather all unique keys from all data items
    const allFields = new Set()

    props.tableData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!props.excludeFields.includes(key)) {
          allFields.add(key)
        }
      })
    })

    // Convert to array and sort alphabetically (no assumptions about field order)
    const sortedFields = [...allFields].sort((a, b) => a.localeCompare(b))

    // Generate columns with equal widths by default
    const columnWidth = `${Math.floor(100 / Math.min(sortedFields.length, 10))}%`

    return sortedFields.map(field => {
      return {
        name: field,
        label: formatLabel(field),
        field: field,
        align: props.rtl ? 'right' : 'left',
        style: `width: ${columnWidth}`
      }
    })
  }

  return []
})

// Methods
const openPrintDialog = () => {
  printDialog.value = true
}

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

const getFormatterProps = (propsConfig, value, row) => {
  if (typeof propsConfig === 'function') {
    return propsConfig(value, row)
  } else if (typeof propsConfig === 'object') {
    const result = {}

    Object.keys(propsConfig).forEach(key => {
      if (typeof propsConfig[key] === 'function') {
        result[key] = propsConfig[key](value, row)
      } else {
        result[key] = propsConfig[key]
      }
    })

    return result
  }

  return propsConfig || {}
}

const formatDate = (date, includeTime = false) => {
  if (!date) return '-'
  const d = new Date(date)

  if (includeTime) {
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const hasArabic = (text) => {
  if (!text || typeof text !== 'string') return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

// Convert fonts to base64 string
const getBase64Font = async (fontPath) => {
  try {
    const response = await fetch(fontPath);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load font:', error);
    return null;
  }
}

const exportAsPDF = async () => {
  exporting.value = true

  try {
    // Load the font data
    const arabicFontData = await getBase64Font(amiriRegular);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    doc.addFileToVFS('Amiri-Regular.ttf', arabicFontData);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    // Set Amiri as the default font for the entire document
    doc.setFont('Amiri');
    doc.setFontSize(21);

    // Title
    doc.text(props.title || 'Report', doc.internal.pageSize.width / 2, 15, {
      align: 'center'
    });

    if (props.subtitle) {
      doc.setFontSize(15);
      doc.text(props.subtitle, doc.internal.pageSize.width / 2, 24, {
        align: 'center'
      });
    }

    doc.setFontSize(10);
    const dateText = `Generated on: ${formatDate(new Date(), true)}`;
    doc.text(dateText, doc.internal.pageSize.width - 15, 30, { align: 'right' });

    let yPosition = 35;

    if (props.summaryData && Object.keys(props.summaryData).length) {
      doc.setFontSize(12);
      // Use the provided summaryTitle instead of hardcoded 'Summary'
      doc.text(props.summaryTitle || 'Summary', 15, yPosition);

      yPosition += 5;

      const summaryRows = [];
      const keys = Object.keys(props.summaryData);

            for (let i = 0; i < keys.length; i += 2) {
        const row = [];
        row.push(formatLabel(keys[i]));
        row.push(props.summaryData[keys[i]]);

        if (i + 1 < keys.length) {
          row.push(formatLabel(keys[i + 1]));
          row.push(props.summaryData[keys[i + 1]]);
        } else {
          row.push('');
          row.push('');
        }

        summaryRows.push(row);
      }

      autoTable(doc, {
        startY: yPosition + 2,
        head: [['Field', 'Value', 'Field', 'Value']],
        body: summaryRows,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: 'Amiri',
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          font: 'Amiri',
        },
        margin: { left: 15, right: 15 }
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    }

    if (props.tableData && props.tableData.length) {
      doc.setFontSize(20);
      doc.text(props.tableTitle || 'Data', 15, yPosition);

      yPosition += 5;

      const headers = effectiveColumns.value.map(col => col.label);

      const data = props.tableData.map(row => {
        return effectiveColumns.value.map(col => {
          let value = row[col.name];

          if (props.formatters && props.formatters[col.name]) {
            value = props.formatters[col.name].formatter(value, row);
          } else if (col.format) {
            value = col.format(value, row);
          }

          return value !== undefined && value !== null ? String(value) : '';
        });
      });

      const columnWidths = {};
      effectiveColumns.value.forEach((col, index) => {
        const colName = col.name.toLowerCase();

        if (colName.includes('id') && colName.length < 5) {
          columnWidths[index] = { cellWidth: 15 };
        } else if (colName.includes('description') || colName.includes('text') || colName.includes('message') || colName.includes('comment')) {
          // Text fields get more space
          columnWidths[index] = { cellWidth: 55 };
        } else if (colName.includes('date') || colName.includes('time') || colName.includes('created') || colName.includes('updated')) {
          // Date fields get medium space
          columnWidths[index] = { cellWidth: 25 };
        } else if (colName.includes('email')) {
          // Email fields get medium space
          columnWidths[index] = { cellWidth: 40 };
        } else if (colName.includes('status') || colName.includes('priority') || colName.includes('type')) {
          // Status fields are usually short
          columnWidths[index] = { cellWidth: 20 };
        }
      });

      // Generate the table with autoTable
      autoTable(doc, {
        startY: yPosition + 2,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: {
          fontSize: 9,
          overflow: 'linebreak',
          cellWidth: 'auto',
          cellPadding: 3,
          valign: 'middle',
          font: 'Amiri',
        },
        columnStyles: columnWidths,
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          font: 'Amiri',
        },
        willDrawCell: function(data) {
          // Ensure all cells use Amiri font for Arabic support
          data.cell.styles.font = 'Amiri';

          // Apply right alignment for RTL if needed
          if (props.rtl) {
            data.cell.styles.halign = 'right';
          }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          // Add header to each page
          doc.setFontSize(12);
          doc.setFont('Amiri');
          doc.text(props.title || 'Report', 15, 10);

          // Add page number at the bottom
          doc.setFontSize(8);
          doc.text(
            `Page ${doc.internal.getNumberOfPages()}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      // Add notes if available
      if (props.notes_data) {
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(17);

        // Use the provided notesTitle
        doc.text(props.notesTitle || 'Notes:', 15, finalY);

        doc.setFontSize(10);

        if (hasArabic(props.notes_data)) {
          const splitNotes = doc.splitTextToSize(
            props.notes_data,
            doc.internal.pageSize.width - 30
          );

          // For Arabic notes, align to the right side of the page
          doc.text(splitNotes, doc.internal.pageSize.width - 15, finalY + 5, {
            align: 'right'
          });
        } else {
          const splitNotes = doc.splitTextToSize(
            props.notes_data,
            doc.internal.pageSize.width - 30
          );
          doc.text(splitNotes, 15, finalY + 5);
        }
      }
    }

    doc.save(props.pdfFilename || `${props.title || 'report'}-${Date.now()}.pdf`);

    exporting.value = false;
    $q.notify({
      color: 'positive',
      message: 'PDF exported successfully',
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('PDF export error:', error);
    exporting.value = false;
    $q.notify({
      color: 'negative',
      message: 'Failed to export PDF: ' + error.message,
      icon: 'error'
    });
  }
}
</script>

<style scoped>
.print-dialog {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.print-content {
  background: white;
}

.print-table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.print-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.print-table th,
.print-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.print-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.wrap-text {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* RTL support for tables */
:deep(.q-table--grid) {
  direction: rtl;
}

/* Add Amiri font for better Arabic rendering in the preview */
@font-face {
  font-family: 'Amiri';
  src: url('../fonts/Amiri-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* Apply Amiri font to Arabic text */
.print-table th,
.print-table td {
  font-family: 'Amiri', Arial, sans-serif;
}

/* Print styles - not visible in preview but will apply when printing */
@media print {
  body * {
    visibility: hidden;
  }
  .print-content,
  .print-content * {
    visibility: visible;
  }
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .print-actions {
    display: none;
  }
}
</style>
