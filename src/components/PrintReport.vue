<template>
  <div>
    <!-- Export Button -->
    <q-btn
      :color="buttonColor || 'primary'"
      :icon="buttonIcon || 'picture_as_pdf'"
      :label="buttonLabel || 'Export PDF'"
      :flat="buttonFlat"
      :outline="buttonOutline"

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
          color="green"
          icon="table_view"
          label="Export as Excel"
          dense
          @click="exportAsExcel"
          :loading="exportingExcel"
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
import * as XLSX from 'xlsx'  // Add this import
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
    buttonColor: {
    type: String,
    default: 'primary'
  },
  buttonIcon: {
    type: String,
    default: 'file_upload'
  },
  buttonLabel: {
    type: String,
    default: 'Export  Report'
  },
  buttonFlat: Boolean,
  buttonOutline: Boolean,
  buttonSize: {
    type: String,
    default: 'md'
  },

  excelFilename: String,
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

const printDialog = ref(false)
const exporting = ref(false)
const exportingExcel = ref(false)  // Add this new re

onMounted(() => {
  // Load the Amiri font to ensure it's available for Arabic text
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = amiriRegular;
  document.head.appendChild(fontLink);
});

const getRowKey = (row, fallbackIndex) => {
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

const effectiveColumns = computed(() => {
  // This is will work lma el user provides columns
  if (props.columns && props.columns.length > 0) {
    return props.columns
  }

  // when the user wont provide el specifc columns aw right values
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


const formatDateArabic = (date) => {
  if (!date) return '-'
  const d = new Date(date)

  // Arabic locale with Gregorian calendar
  return d.toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory'
  })
}

const formatDateTimeArabic = (date) => {
  if (!date) return '-'
  const d = new Date(date)

  // Arabic locale with Gregorian calendar for date and time
  return d.toLocaleString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    calendar: 'gregory'
  })
}

const formatNumberArabic = (num) => {
  if (num === null || num === undefined) return ''

  // Convert to Arabic numerals and format with thousands separator
  return Number(num).toLocaleString('ar')
}

const formatCurrencyArabic = (amount, currency = 'SAR') => {
  if (amount === null || amount === undefined) return ''

  // Format currency in Arabic style
  return Number(amount).toLocaleString('ar', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatPercentageArabic = (value) => {
  if (value === null || value === undefined) return ''

  // Convert decimal to percentage and format in Arabic
  const percentage = Number(value) * 100
  return percentage.toLocaleString('ar') + '%'
}

// Main function to format data in Arabic based on type
const formatDataArabic = (value, type) => {
  if (value === null || value === undefined) return ''

  switch (type) {
    case 'date':
      return formatDateArabic(value)
    case 'datetime':
      return formatDateTimeArabic(value)
    case 'number':
      return formatNumberArabic(value)
    case 'currency':
      return formatCurrencyArabic(value)
    case 'percentage':
      return formatPercentageArabic(value)
    case 'boolean':
      return value ? 'نعم' : 'لا'
    default:
      return value
  }
}

// Detect data type from column name
const detectDataType = (columnName) => {
  const name = columnName.toLowerCase()

  if (name.includes('date') && (name.includes('time') || name.includes('at'))) {
    return 'datetime'
  } else if (name.includes('date')) {
    return 'date'
  } else if (name.includes('price') || name.includes('cost') ||
            name.includes('amount') || name.includes('revenue') ||
            name.includes('salary') || name.includes('budget')) {
    return 'currency'
  } else if (name.includes('percent') || name.includes('rate') || name.includes('growth')) {
    return 'percentage'
  } else if (name === 'active' || name === 'status' || name.includes('is_')) {
    return 'boolean'
  } else {
    return 'text'
  }
}

//Checks if a string contains any Arabic/RTL characters.
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
    });

    doc.addFileToVFS('Amiri-Regular.ttf', arabicFontData);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'bold');

    doc.setFont('Amiri');

    // Global page margins
    const margin = {
      left: 15,
      right: 15,
      top: 15,
      bottom: 15
    };

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - margin.left - margin.right;

    const isRTL = props.rtl === true;
    const useArabicFormat = isRTL || hasArabic(props.title || '');

    // Helper function to render text with appropriate alignment based on language
    const renderText = (text, x, y, options = {}) => {
      const textIsRTL = isRTL || hasArabic(text);

      // Set default alignment based on text direction
      const defaultAlign = textIsRTL ? 'right' : 'left';

      let xPos = x;
      if (textIsRTL) {
        xPos = pageWidth - margin.right;
      } else {
        xPos = margin.left;
      }

      const textOptions = {
        align: defaultAlign,
        ...options
      };

      if (typeof text === 'string' && !x) {
        text = doc.splitTextToSize(text, contentWidth);
      }

      doc.text(text, xPos, y, textOptions);
    };

    const addPageHeaderAndFooter = () => {
  // Header with title
  doc.setFontSize(12);
  renderText(props.title || 'Report', null, 10);

  // Footer with page numbers and date
  doc.setFontSize(10);

  // Format page number in Arabic if using Arabic format
  const pageNumberText = useArabicFormat
    ? `صفحة ${formatNumberArabic(doc.internal.getNumberOfPages())}`
    : `Page ${doc.internal.getNumberOfPages()}`;

  // Add page number in the center
  doc.text(
    pageNumberText,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Add date in the right corner of footer
  const footerDate = useArabicFormat
    ? formatDateArabic(new Date())
    : formatDate(new Date());

  doc.text(
    footerDate,
    pageWidth - margin.right,
    pageHeight - 10,
    { align: 'right' }
  );
};

    // Set title on first page
    doc.setFontSize(20);
    doc.text(props.title || 'Report', pageWidth / 2, margin.top + 5, {
      align: 'center'
    });

    if (props.subtitle) {
      doc.setFontSize(16);
      doc.text(props.subtitle, pageWidth / 2, margin.top + 15, {
        align: 'center'
      });
    }

    doc.setFontSize(11);
    const dateText = useArabicFormat
      ? `تم إنشاؤه في: ${formatDateTimeArabic(new Date())}`
      : `Generated on: ${formatDate(new Date(), true)}`;
    doc.text(dateText, pageWidth - margin.right, margin.top + 25, {
      align: 'right'
    });

    let yPosition = margin.top + 35;

    // --- Summary Section ---
    if (props.summaryData && Object.keys(props.summaryData).length > 0) {
      // Title for summary with proper alignment
      doc.setFontSize(14);
      renderText(props.summaryTitle || (useArabicFormat ? 'ملخص' : 'Summary'), null, yPosition);
      yPosition += 8;

      const summaryRows = [];
      const keys = Object.keys(props.summaryData);

      for (let i = 0; i < keys.length; i += 2) {
        const row = [];
        const key1 = keys[i];
        let value1 = props.summaryData[key1];

        // Format value based on key name if in Arabic mode
        if (useArabicFormat) {
          const dataType = detectDataType(key1);
          value1 = formatDataArabic(value1, dataType);
        }

        row.push(formatLabel(key1));
        row.push(value1);

        if (i + 1 < keys.length) {
          const key2 = keys[i + 1];
          let value2 = props.summaryData[key2];

          // Format second value if in Arabic mode
          if (useArabicFormat) {
            const dataType = detectDataType(key2);
            value2 = formatDataArabic(value2, dataType);
          }

          row.push(formatLabel(key2));
          row.push(value2);
        } else {
          row.push('');
          row.push('');
        }

        summaryRows.push(row);
      }

      // Draw summary table
      autoTable(doc, {
        startY: yPosition,
        head: [['Field', 'Value', 'Field', 'Value']],
        body: summaryRows,
        theme: 'grid',
        styles: {
          fontSize: 12,
          cellPadding: 5,
          font: 'Amiri',
          lineWidth: 0.1,
          lineColor: [80, 80, 80],
          halign: isRTL ? 'right' : 'left'
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          font: 'Amiri',
          halign: isRTL ? 'right' : 'left'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: contentWidth * 0.2 },
          1: { cellWidth: contentWidth * 0.3 },
          2: { fontStyle: 'bold', cellWidth: contentWidth * 0.2 },
          3: { cellWidth: contentWidth * 0.3 }
        },
        margin: margin,
        didDrawPage: addPageHeaderAndFooter,
        didParseCell: function(data) {
          data.cell.styles.font = 'Amiri';
        }
      });

      yPosition = doc.lastAutoTable.finalY + 18;
    }

    // --- Main Data Table Section ---
    if (props.tableData && props.tableData.length > 0) {
      // If there's not enough space for table header + at least 3 rows, start a new page
      const estimatedRowHeight = 12;
      const minTableSpace = 45 + (Math.min(3, props.tableData.length) * estimatedRowHeight);

      if (yPosition + minTableSpace > pageHeight - margin.bottom) {
        doc.addPage();
        addPageHeaderAndFooter();
        yPosition = margin.top + 15;
      }

      // Title for table section with proper alignment
      doc.setFontSize(18);
      renderText(props.tableTitle || (useArabicFormat ? 'البيانات' : 'Data'), null, yPosition);
      yPosition += 8;

      // Pre-process headers to apply fonts properly for Arabic
      const headerObjects = effectiveColumns.value.map(col => {
        const isArabicHeader = hasArabic(col.label);

        // Create a custom header object
        return {
          content: col.label,
          styles: {
            font: 'Amiri',
            fontStyle: 'bold',
            fontSize: 12,
            halign: (isArabicHeader || isRTL) ? 'right' : 'left'
          }
        };
      });

      // Format table data with Arabic formatting when needed
      const data = props.tableData.map(row => {
        return effectiveColumns.value.map(col => {
          let value = row[col.name];

          if (props.formatters && props.formatters[col.name]) {
            // Use custom formatter if provided
            value = props.formatters[col.name].formatter(value, row);
          } else if (col.format) {
            // Use column format function if provided
            value = col.format(value, row);
          } else if (useArabicFormat) {
            // Apply Arabic formatting based on column name
            const dataType = detectDataType(col.name);
            value = formatDataArabic(value, dataType);
          }

          return value !== undefined && value !== null ? String(value) : '';
        });
      });

      // Calculate optimal column widths based on content
      const columnWidths = {};
      const totalColumns = effectiveColumns.value.length;
      const defaultColumnWidth = contentWidth / totalColumns;

      effectiveColumns.value.forEach((col, index) => {
        const colName = col.name.toLowerCase();

        if (colName.includes('notes') || colName.includes('description') || colName.includes('comment')) {
          // Give more space to text fields
          columnWidths[index] = { cellWidth: defaultColumnWidth * 1.8 };
        } else if (colName.includes('id') && colName.length < 5) {
          // ID columns are usually narrow
          columnWidths[index] = { cellWidth: defaultColumnWidth * 0.6 };
        } else if (colName.includes('date') || colName.includes('time')) {
          // Date fields
          columnWidths[index] = { cellWidth: defaultColumnWidth * 1.2 };
        } else if (colName === 'month' || colName.includes('status') || colName.includes('type')) {
          // Medium-sized fields
          columnWidths[index] = { cellWidth: defaultColumnWidth * 0.8 };
        } else if (colName.includes('growth') || colName.includes('percentage')) {
          // Percentage fields
          columnWidths[index] = { cellWidth: defaultColumnWidth * 0.7 };
        } else {
          columnWidths[index] = { cellWidth: defaultColumnWidth };
        }
      });

      // Generate the table with autoTable using custom headers
      autoTable(doc, {
        startY: yPosition,
        head: [headerObjects],
        body: data,
        theme: 'grid',
        styles: {
          fontSize: 11,
          overflow: 'linebreak',
          cellPadding: 4,
          valign: 'middle',
          font: 'Amiri',
          lineWidth: 0.1,
          lineColor: [80, 80, 80],
          halign: isRTL ? 'right' : 'left'
        },
        columnStyles: columnWidths,
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          font: 'Amiri',
          fontSize: 12,
          halign: isRTL ? 'right' : 'left'
        },
        didParseCell: function(data) {
          data.cell.styles.font = 'Amiri';

          if (data.section === 'head') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fontSize = 12;

            if (typeof data.cell.raw === 'string' && hasArabic(data.cell.raw)) {
              data.cell.styles.halign = 'right';
            } else if (isRTL) {
              data.cell.styles.halign = 'right';
            }
          }
        },
        willDrawCell: function(data) {
          data.cell.styles.font = 'Amiri';

          // Set content alignment based on text direction
          if (typeof data.cell.raw === 'string' && hasArabic(data.cell.raw)) {
            data.cell.styles.halign = 'right';
          } else if (isRTL) {
            data.cell.styles.halign = 'right';
          } else {
            data.cell.styles.halign = 'left';
          }
        },
        margin: margin,
        didDrawPage: addPageHeaderAndFooter,
        rowPageBreak: 'avoid'
      });

      yPosition = doc.lastAutoTable.finalY + 18;
    }

    // --- Notes Section ---
    if (props.notes_data && props.notes_data.trim().length > 0) {
      const notesText = props.notes_data;

      const textLines = doc.splitTextToSize(notesText, contentWidth);
      const estimatedNotesHeight = 20 + (textLines.length * 5);

      // Start a new page if not enough space
      if (yPosition + estimatedNotesHeight > pageHeight - margin.bottom) {
        doc.addPage();
        addPageHeaderAndFooter();
        yPosition = margin.top + 15;
      }

      // Add notes title with proper alignment
      doc.setFontSize(14);
      renderText(props.notesTitle || (useArabicFormat ? 'ملاحظات:' : 'Notes:'), null, yPosition);
      yPosition += 8;

      // Add notes content with proper alignment - Use renderText helper for consistency
      doc.setFontSize(11);
      renderText(notesText, null, yPosition);
    }

    doc.save(props.pdfFilename || `${props.title || 'report'}-${Date.now()}.pdf`);

    exporting.value = false;
    $q.notify({
      color: 'positive',
      message: useArabicFormat ? 'تم تصدير ملف PDF بنجاح' : 'PDF exported successfully',
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('PDF export error:', error);
    exporting.value = false;
    $q.notify({
      color: 'negative',
      message: useArabicFormat
        ? 'فشل تصدير ملف PDF: ' + error.message
        : 'Failed to export PDF: ' + error.message,
      icon: 'error'
    });
  }
}



const exportAsExcel = () => {
  exportingExcel.value = true

  try {
    const wb = XLSX.utils.book_new()

    if (props.tableData && props.tableData.length > 0) {
      // Convert table data to worksheet
      const tableWorksheetData = [
        // Header row
        effectiveColumns.value.map(col => col.label)
      ]

      // Add data rows
      props.tableData.forEach(row => {
        const dataRow = effectiveColumns.value.map(col => {
          let value = row[col.name]

          // Apply formatters if available
          if (props.formatters && props.formatters[col.name]) {
            value = props.formatters[col.name].formatter(value, row)
          } else if (col.format) {
            value = col.format(value, row)
          }

          return value !== undefined ? value : ""
        })

        tableWorksheetData.push(dataRow)
      })

      const ws = XLSX.utils.aoa_to_sheet(tableWorksheetData)

      // Add this worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, props.tableTitle || 'Data')
    }

    // If summary data exists, create a summary sheet
    if (props.summaryData && Object.keys(props.summaryData).length > 0) {
      const summaryWorksheetData = [
        ['Field', 'Value']
      ]

      Object.keys(props.summaryData).forEach(key => {
        summaryWorksheetData.push([
          formatLabel(key),
          props.summaryData[key]
        ])
      })

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryWorksheetData)
      XLSX.utils.book_append_sheet(wb, summaryWs, props.summaryTitle || 'Summary')
    }

    // Add notes if they exist
    if (props.notes_data && props.notes_data.trim().length > 0) {
      const notesWorksheetData = [
        [props.notesTitle || 'Notes:'],
        [props.notes_data]
      ]

      const notesWs = XLSX.utils.aoa_to_sheet(notesWorksheetData)
      XLSX.utils.book_append_sheet(wb, notesWs, 'Notes')
    }

    // Generate the Excel file
    const useArabicFormat = props.rtl === true || hasArabic(props.title || '')
    const filename = props.excelFilename ||
      (props.pdfFilename || `${props.title || 'report'}-${Date.now()}`).replace('.pdf', '.xlsx')

    XLSX.writeFile(wb, filename)

    exportingExcel.value = false
    $q.notify({
      color: 'positive',
      message: useArabicFormat ? 'تم تصدير ملف Excel بنجاح' : 'Excel exported successfully',
      icon: 'check_circle'
    })
  } catch (error) {
    console.error('Excel export error:', error)
    exportingExcel.value = false
    $q.notify({
      color: 'negative',
      message: props.rtl
        ? 'فشل تصدير ملف Excel: ' + error.message
        : 'Failed to export Excel: ' + error.message,
      icon: 'error'
    })
  }
}
////
/////
//
///
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
