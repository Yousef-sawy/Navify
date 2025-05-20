<template>
  <div class="q-pa-md">
    <h1 class="text-h4 q-mb-md">PDF Export Component Test</h1>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Complete English Example</div>
            <div class="text-subtitle2">All content in English</div>
          </q-card-section>
          <q-card-section>
            <PDFExport
              title="Tets"
              subtitle="Q3 2023 Sales Performance"
              tableTitle="Monthly Sales Breakdown"
              :tableData="testData"
              buttonColor="primary"
              buttonIcon="cloud_download"
              buttonLabel="Generate Report"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Complete Arabic Example</div>
            <div class="text-subtitle2">All content in Arabic</div>
          </q-card-section>
          <q-card-section>
            <PDFExport
              title="تقرير المبيعات"
              subtitle="نظرة عامة على مبيعات الربع الثالث 2023"
              tableTitle="تفصيل المبيعات الشهرية"
              :tableData="arabicSalesData"
              :columns="arabicColumns"
              :summaryData="arabicSummaryData"
              summaryTitle="ملخص الأداء"
              notesTitle="ملاحظات التحليل"
              :notes_data="arabicNotes"
              buttonColor="info"
              buttonLabel="تصدير كملف PDF"
              buttonIcon="description"
              :rtl="true"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PDFExport from '../components/PrintReport.vue';

// Sample sales data - English
const salesData = ref([
  { id: 1, month: 'January', revenue: 45000, growth: 5.2, product: 'Product A', units: 1200, cost: 32000, profit: 13000, status: 'Completed', notes: 'Strong start to the year' },
  { id: 2, month: 'February', revenue: 48500, growth: 7.8, product: 'Product B', units: 1350, cost: 34500, profit: 14000, status: 'Completed', notes: 'Valentine\'s Day promotion successful' },
  { id: 3, month: 'March', revenue: 52000, growth: 7.2, product: 'Product A', units: 1400, cost: 36000, profit: 16000, status: 'Completed', notes: 'End of quarter push' },
  { id: 4, month: 'April', revenue: 49000, growth: -5.8, product: 'Product C', units: 1300, cost: 35000, profit: 14000, status: 'Completed', notes: 'Slight decline from March' },
  { id: 5, month: 'May', revenue: 51500, growth: 5.1, product: 'Product B', units: 1375, cost: 36500, profit: 15000, status: 'Completed', notes: 'Mother\'s Day boost' },
  { id: 6, month: 'June', revenue: 54000, growth: 4.9, product: 'Product A', units: 1450, cost: 38000, profit: 16000, status: 'Completed', notes: 'Strong end to Q2' },
  { id: 7, month: 'July', revenue: 52500, growth: -2.8, product: 'Product C', units: 1400, cost: 37500, profit: 15000, status: 'Completed', notes: 'Summer slowdown' },
  { id: 8, month: 'August', revenue: 53000, growth: 1.0, product: 'Product B', units: 1425, cost: 38000, profit: 15000, status: 'Completed', notes: 'Back to school promotion' },
  { id: 9, month: 'September', revenue: 55000, growth: 3.8, product: 'Product A', units: 1475, cost: 39000, profit: 16000, status: 'Completed', notes: 'Fall collection launch' },
]);

// English columns
const salesColumns = ref([
  { name: 'month', label: 'Month', field: 'month', sortable: true },
  { name: 'revenue', label: 'Revenue ($)', field: 'revenue', sortable: true, format: val => `$${val.toLocaleString()}` },
  { name: 'growth', label: 'Growth (%)', field: 'growth', sortable: true, format: val => `${val > 0 ? '+' : ''}${val}%` },
  { name: 'product', label: 'Product', field: 'product', sortable: true },
  { name: 'units', label: 'Units Sold', field: 'units', sortable: true, format: val => val.toLocaleString() },
  { name: 'profit', label: 'Profit ($)', field: 'profit', sortable: true, format: val => `$${val.toLocaleString()}` },
  { name: 'notes', label: 'Notes', field: 'notes' }
]);

// English summary data
const summaryData = ref({
  totalRevenue: '$458,500',
  averageGrowth: '+2.9%',
  bestMonth: 'September ($55,000)',
  worstMonth: 'January ($45,000)',
  totalProfit: '$134,000',
  totalUnits: '12,375'
});

// Custom formatters
const formatters = ref({
  growth: {
    formatter: (value) => `${value > 0 ? '+' : ''}${value}%`,
    props: (value) => ({
      color: value > 0 ? 'positive' : 'negative',
      bold: value > 5 || value < -5
    }),
    component: 'span'
  },
  revenue: {
    formatter: (value) => `$${value.toLocaleString()}`
  },
  profit: {
    formatter: (value) => `$${value.toLocaleString()}`
  }
});

// English notes text
const notesText = ref(`This report summarizes the sales performance for the first three quarters of 2023. We've seen consistent growth overall, with particularly strong performance in March, June, and September, which coincide with end-of-quarter promotional activities. Product A continues to be our strongest performer. The slight decline in July is attributed to seasonal patterns and is consistent with previous years. We recommend continuing with the quarterly promotional strategy and possibly expanding the Product A line.`);

// Arabic sales data
const arabicSalesData = ref([
  { id: 1, month: 'يناير', revenue: 45000, growth: 5.2, product: 'المنتج أ', units: 1200, profit: 13000, notes: 'بداية قوية للعام' },
  { id: 2, month: 'فبراير', revenue: 48500, growth: 7.8, product: 'المنتج ب', units: 1350, profit: 14000, notes: 'حملة عيد الحب ناجحة' },
  { id: 3, month: 'مارس', revenue: 52000, growth: 7.2, product: 'المنتج أ', units: 1400, profit: 16000, notes: 'دفعة نهاية الربع' },
  { id: 4, month: 'أبريل', revenue: 49000, growth: -5.8, product: 'المنتج ج', units: 1300, profit: 14000, notes: 'انخفاض طفيف من مارس' },
  { id: 5, month: 'مايو', revenue: 51500, growth: 5.1, product: 'المنتج ب', units: 1375, profit: 15000, notes: 'ارتفاع عيد الأم' }
]);

// Arabic columns
const arabicColumns = ref([
  { name: 'month', label: 'الشهر', field: 'month', sortable: true },
  { name: 'revenue', label: 'الإيرادات ($)', field: 'revenue', sortable: true, format: val => `$${val.toLocaleString()}` },
  { name: 'growth', label: 'النمو (%)', field: 'growth', sortable: true, format: val => `${val > 0 ? '+' : ''}${val}%` },
  { name: 'product', label: 'المنتج', field: 'product', sortable: true },
  { name: 'units', label: 'الوحدات المباعة', field: 'units', sortable: true, format: val => val.toLocaleString() },
  { name: 'profit', label: 'الربح ($)', field: 'profit', sortable: true, format: val => `$${val.toLocaleString()}` },
  { name: 'notes', label: 'ملاحظات', field: 'notes' }
]);


const testData = ref(
  [
  {
    "id": 1,
    "date": "2025-05-20",
    "customerName": "Angela Mcbride",
    "product": "Smartphone",
    "category": "Electronics",
    "region": "South",
    "salesRep": "John Doe",
    "unitsSold": 9,
    "unitPrice": 800,
    "totalRevenue": 6480,
    "discount": 10,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.3
  },
  {
    "id": 2,
    "date": "2025-05-12",
    "customerName": "Joseph Garcia",
    "product": "Tablet",
    "category": "Electronics",
    "region": "East",
    "salesRep": "Jane Smith",
    "unitsSold": 6,
    "unitPrice": 600,
    "totalRevenue": 3240,
    "discount": 5,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.0
  },
  {
    "id": 3,
    "date": "2025-05-15",
    "customerName": "Michael Harris",
    "product": "Coffee Machine",
    "category": "Appliances",
    "region": "West",
    "salesRep": "John Doe",
    "unitsSold": 3,
    "unitPrice": 250,
    "totalRevenue": 750,
    "discount": 15,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Pending",
    "feedbackScore": 3.8
  },
  {
    "id": 4,
    "date": "2025-05-17",
    "customerName": "Emily Lee",
    "product": "Backpack",
    "category": "Accessories",
    "region": "North",
    "salesRep": "Lisa Green",
    "unitsSold": 4,
    "unitPrice": 80,
    "totalRevenue": 320,
    "discount": 0,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.7
  },
  {
    "id": 5,
    "date": "2025-05-21",
    "customerName": "William Clark",
    "product": "Headphones",
    "category": "Electronics",
    "region": "South",
    "salesRep": "Eve White",
    "unitsSold": 2,
    "unitPrice": 100,
    "totalRevenue": 200,
    "discount": 0,
    "paymentMethod": "Cash",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.9
  },
  {
    "id": 6,
    "date": "2025-05-09",
    "customerName": "Samantha Young",
    "product": "Monitor",
    "category": "Electronics",
    "region": "East",
    "salesRep": "Eve White",
    "unitsSold": 5,
    "unitPrice": 300,
    "totalRevenue": 1500,
    "discount": 5,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Cancelled",
    "feedbackScore": 3.6
  },
  {
    "id": 7,
    "date": "2025-05-03",
    "customerName": "Ryan Walker",
    "product": "Printer",
    "category": "Electronics",
    "region": "North",
    "salesRep": "Jane Smith",
    "unitsSold": 1,
    "unitPrice": 200,
    "totalRevenue": 200,
    "discount": 10,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.1
  },
  {
    "id": 8,
    "date": "2025-05-14",
    "customerName": "Daniel King",
    "product": "Desk Chair",
    "category": "Furniture",
    "region": "West",
    "salesRep": "Lisa Green",
    "unitsSold": 3,
    "unitPrice": 150,
    "totalRevenue": 450,
    "discount": 0,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.0
  },
  {
    "id": 9,
    "date": "2025-05-06",
    "customerName": "Rachel Adams",
    "product": "Smartphone",
    "category": "Electronics",
    "region": "South",
    "salesRep": "John Doe",
    "unitsSold": 8,
    "unitPrice": 800,
    "totalRevenue": 6400,
    "discount": 5,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.8
  },
  {
    "id": 10,
    "date": "2025-05-18",
    "customerName": "Christopher Perez",
    "product": "Laptop",
    "category": "Electronics",
    "region": "East",
    "salesRep": "Jane Smith",
    "unitsSold": 5,
    "unitPrice": 1200,
    "totalRevenue": 5400,
    "discount": 15,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Pending",
    "feedbackScore": 4.4
  },
  {
    "id": 11,
    "date": "2025-05-22",
    "customerName": "Sophia Scott",
    "product": "Office Desk",
    "category": "Furniture",
    "region": "West",
    "salesRep": "Eve White",
    "unitsSold": 2,
    "unitPrice": 500,
    "totalRevenue": 1000,
    "discount": 0,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Shipped",
    "feedbackScore": 3.9
  },
  {
    "id": 12,
    "date": "2025-05-23",
    "customerName": "Benjamin Mitchell",
    "product": "Headphones",
    "category": "Electronics",
    "region": "South",
    "salesRep": "John Doe",
    "unitsSold": 3,
    "unitPrice": 100,
    "totalRevenue": 300,
    "discount": 10,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.2
  },
  {
    "id": 13,
    "date": "2025-05-19",
    "customerName": "Madison Carter",
    "product": "Smartphone",
    "category": "Electronics",
    "region": "East",
    "salesRep": "Eve White",
    "unitsSold": 4,
    "unitPrice": 800,
    "totalRevenue": 3200,
    "discount": 0,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.6
  },
  {
    "id": 14,
    "date": "2025-05-10",
    "customerName": "David Allen",
    "product": "Tablet",
    "category": "Electronics",
    "region": "West",
    "salesRep": "John Doe",
    "unitsSold": 5,
    "unitPrice": 600,
    "totalRevenue": 3000,
    "discount": 15,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.0
  },
  {
    "id": 15,
    "date": "2025-05-05",
    "customerName": "Liam Wright",
    "product": "Coffee Machine",
    "category": "Appliances",
    "region": "North",
    "salesRep": "Lisa Green",
    "unitsSold": 2,
    "unitPrice": 250,
    "totalRevenue": 500,
    "discount": 0,
    "paymentMethod": "Cash",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.5
  },
  {
    "id": 16,
    "date": "2025-05-13",
    "customerName": "Ava Perez",
    "product": "Monitor",
    "category": "Electronics",
    "region": "East",
    "salesRep": "Eve White",
    "unitsSold": 7,
    "unitPrice": 300,
    "totalRevenue": 2100,
    "discount": 5,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Shipped",
    "feedbackScore": 4.4
  },
  {
    "id": 17,
    "date": "2025-05-08",
    "customerName": "Isabella Martinez",
    "product": "Printer",
    "category": "Electronics",
    "region": "South",
    "salesRep": "John Doe",
    "unitsSold": 3,
    "unitPrice": 200,
    "totalRevenue": 600,
    "discount": 10,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Pending",
    "feedbackScore": 3.9
  },
  {
    "id": 18,
    "date": "2025-05-24",
    "customerName": "Charlotte Rodriguez",
    "product": "Smartphone",
    "category": "Electronics",
    "region": "North",
    "salesRep": "Eve White",
    "unitsSold": 10,
    "unitPrice": 800,
    "totalRevenue": 8000,
    "discount": 5,
    "paymentMethod": "Credit Card",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.7
  },
  {
    "id": 19,
    "date": "2025-05-04",
    "customerName": "Amelia Evans",
    "product": "Tablet",
    "category": "Electronics",
    "region": "West",
    "salesRep": "Lisa Green",
    "unitsSold": 1,
    "unitPrice": 600,
    "totalRevenue": 600,
    "discount": 15,
    "paymentMethod": "PayPal",
    "deliveryStatus": "Delivered",
    "feedbackScore": 4.1
  },
  {
    "id": 20,
    "date": "2025-05-16",
    "customerName": "Oliver Thomas",
    "product": "Headphones",
    "category": "Electronics",
    "region": "East",
    "salesRep": "John Doe",
    "unitsSold": 2,
    "unitPrice": 100,
    "totalRevenue": 200,
    "discount": 0,
    "paymentMethod": "Bank Transfer",
    "deliveryStatus": "Pending",
    "feedbackScore": 4.3
  }


]);
// Arabic summary data
const arabicSummaryData = ref({
  totalRevenue: '$246,000',
  averageGrowth: '+3.9%',
  bestMonth: 'مارس ($52,000)',
  worstMonth: 'يناير ($45,000)',
  totalProfit: '$72,000',
  totalUnits: '6,625'
});

// Arabic notes
const arabicNotes = ref(`يلخص هذا التقرير أداء المبيعات للأرباع الثلاثة الأولى من عام 2023. شهدنا نموًا مستمرًا بشكل عام، مع أداء قوي بشكل خاص في مارس ويونيو وسبتمبر، والتي تتزامن مع أنشطة الترويج في نهاية الربع. لا يزال المنتج أ الأقوى أداءً. يُنسب الانخفاض الطفيف في يوليو إلى الأنماط الموسمية ويتفق مع السنوات السابقة. نوصي بمواصلة استراتيجية الترويج الربعية واحتمال توسيع خط المنتج أ.`);
</script>

<style scoped>
.card-actions {
  display: flex;
  justify-content: center;
}
</style>
