<template>
  <div>
    <pdf-exporter
      title="تذاكر الدعم"
      subtitle="جميع تذاكر الدعم والتعليقات المرسلة"
      :table-data="ticketsData"
      :summary-data="summaryData"
      notes="هذا التقرير يعرض كافة تذاكر الدعم المرسلة خلال الفترة المحددة."
      button-label="تصدير PDF"
    />
  </div>
</template>

<script setup>
import PdfExporter from '../components/PrintReport.vue'
import { ref } from 'vue'

const ticketsData = ref([
  { id: 1, title: 'مشكلة في تسجيل الدخول', status: 'مفتوح', date: '2023-05-15' },
  { id: 2, title: 'خطأ في الفاتورة', status: 'مغلق', date: '2023-05-10' }
])

const summaryData = ref({
  totalTickets: '45',
  openTickets: '12',
  resolvedTickets: '33'
})
</script>
