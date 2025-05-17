<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-lg text-right">{{ t('test.title') }}</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-right">{{ t('test.summary') }}</div>
            </q-card-section>
            <q-card-section>
              <p class="text-right">{{ t('test.description') }}</p>
            </q-card-section>
            <q-card-actions>
              <print-report
                :title="t('test.report.title')"
                :subtitle="t('test.report.subtitle')"
                :tableTitle="t('test.report.tableTitle')"
                :table-data="arabicTickets"
                :columns="printColumns"
                :summary-data="ticketSummary"
                :summaryTitle="t('test.report.summaryTitle')"
                :button-label="t('test.report.print')"
                button-icon="print"
                button-outline
                button-color="primary"
                :notesTitle="t('test.report.notesTitle')"
                :notes_data="t('test.report.notesData')"
                pdf-filename="arabic-test-report.pdf"
                :rtl="true"
              />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-8">
          <q-table
            :rows="arabicTickets"
            :columns="tableColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading"
            binary-state-sort
            flat
            bordered
            class="rtl-table"
          >
            <template v-slot:top>
              <div class="text-h6 text-right full-width q-pb-md">{{ t('test.table.title') }}</div>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PrintReport from '../components/PrintReport.vue';

const { t } = useI18n();
const loading = ref(false);

// Sample data for Arabic tickets
const arabicTickets = ref([
  {
    id: 1,
    title: 'تحسين واجهة المستخدم',
    status: 'مفتوح',
    priority: 'عالية',
    category: 'الواجهة',
    created: '2023-06-15',
    assignee: 'محمد أحمد',
    description: 'نحتاج إلى تحسين واجهة المستخدم لتكون أكثر سهولة واستجابة للمستخدمين العرب.'
  },
  {
    id: 2,
    title: 'مشكلة في تسجيل الدخول',
    status: 'قيد التنفيذ',
    priority: 'قصوى',
    category: 'الأمان',
    created: '2023-06-16',
    assignee: 'فاطمة علي',
    description: 'بعض المستخدمين يواجهون مشكلة في تسجيل الدخول عند استخدام متصفح سفاري.'
  },
  {
    id: 3,
    title: 'إضافة خاصية البحث المتقدم',
    status: 'جديد',
    priority: 'متوسطة',
    category: 'الميزات',
    created: '2023-06-17',
    assignee: 'أحمد محمود',
    description: 'المستخدمون يطلبون خاصية البحث المتقدم للعثور على المنتجات بشكل أسرع.'
  },
  {
    id: 4,
    title: 'تحسين أداء التطبيق',
    status: 'مغلق',
    priority: 'منخفضة',
    category: 'الأداء',
    created: '2023-06-18',
    assignee: 'عمر خالد',
    description: 'التطبيق بطيء جدًا عند تحميل قائمة المنتجات الكبيرة.'
  },
  {
    id: 5,
    title: 'إصلاح الأخطاء في الترجمة',
    status: 'مفتوح',
    priority: 'عالية',
    category: 'الترجمة',
    created: '2023-06-19',
    assignee: 'سارة محمد',
    description: 'هناك بعض الأخطاء في ترجمة بعض النصوص في التطبيق.'
  },
  {
    id: 6,
    title: 'تحديث قاعدة البيانات',
    status: 'تم التحقق',
    priority: 'متوسطة',
    category: 'البنية التحتية',
    created: '2023-06-20',
    assignee: 'حسن علي',
    description: 'نحتاج إلى تحديث قاعدة البيانات لتحسين الأداء وإضافة حقول جديدة.'
  },
]);

// Define columns for the table
const tableColumns = [
  { name: 'id', label: t('test.table.id'), field: 'id', sortable: true, align: 'right' },
  { name: 'title', label: t('test.table.title'), field: 'title', sortable: true, align: 'right' },
  { name: 'status', label: t('test.table.status'), field: 'status', sortable: true, align: 'right' },
  { name: 'priority', label: t('test.table.priority'), field: 'priority', sortable: true, align: 'right' },
  { name: 'assignee', label: t('test.table.assignee'), field: 'assignee', sortable: true, align: 'right' },
  { name: 'created', label: t('test.table.created'), field: 'created', sortable: true, align: 'right' },
];

// Columns for the print report
const printColumns = [
  { name: 'id', label: t('test.table.id'), field: 'id', align: 'right' },
  { name: 'title', label: t('test.table.title'), field: 'title', align: 'right' },
  { name: 'status', label: t('test.table.status'), field: 'status', align: 'right' },
  { name: 'priority', label: t('test.table.priority'), field: 'priority', align: 'right' },
  { name: 'category', label: t('test.table.category'), field: 'category', align: 'right' },
  { name: 'assignee', label: t('test.table.assignee'), field: 'assignee', align: 'right' },
  { name: 'created', label: t('test.table.created'), field: 'created', align: 'right' },
  { name: 'description', label: t('test.table.description'), field: 'description', align: 'right' },
];

// Summary data for the print report
const ticketSummary = {
  'إجمالي التذاكر': arabicTickets.value.length,
  'التذاكر المفتوحة': arabicTickets.value.filter(t => t.status === 'مفتوح').length,
  'التذاكر قيد التنفيذ': arabicTickets.value.filter(t => t.status === 'قيد التنفيذ').length,
  'التذاكر المغلقة': arabicTickets.value.filter(t => t.status === 'مغلق').length,
  'أولوية عالية': arabicTickets.value.filter(t => t.priority === 'عالية').length,
  'أولوية متوسطة': arabicTickets.value.filter(t => t.priority === 'متوسطة').length,
  'أولوية منخفضة': arabicTickets.value.filter(t => t.priority === 'منخفضة').length,
};

// Formatters for the print report
// const ticketFormatters = {
//   status: {
//     formatter: (value) => value,
//     component: 'div',
//     props: (value) => {
//       let color = 'grey';
//       if (value === 'مفتوح') color = 'blue';
//       if (value === 'قيد التنفيذ') color = 'orange';
//       if (value === 'مغلق') color = 'green';
//       if (value === 'جديد') color = 'purple';

//       return {
//         class: `text-${color} text-right`
//       };
//     }
//   },
//   priority: {
//     formatter: (value) => value,
//     component: 'div',
//     props: (value) => {
//       let color = 'grey';
//       if (value === 'عالية') color = 'negative';
//       if (value === 'متوسطة') color = 'warning';
//       if (value === 'منخفضة') color = 'positive';
//       if (value === 'قصوى') color = 'deep-orange';

//       return {
//         class: `text-${color} text-right`
//       };
//     }
//   },
//   created: {
//     formatter: (value) => {
//       if (!value) return '';
//       const date = new Date(value);
//       return new Intl.DateTimeFormat('ar-EG', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       }).format(date);
//     }
//   },
//   description: {
//     formatter: (value) => value,
//     wrapText: true,
//     maxLines: 2
//   }
// };
</script>

<style scoped>
.rtl-table {
  direction: rtl;
}
</style>
