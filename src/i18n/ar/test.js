export default {
  test: {
    title: 'صفحة اختبار الطباعة',
    summary: 'ملخص التذاكر',
    description: 'هذه الصفحة مخصصة لاختبار ميزة طباعة التقارير باللغة العربية.',
    table: {
      title: 'قائمة التذاكر',
      id: 'الرقم',
      title: 'العنوان',
      status: 'الحالة',
      priority: 'الأولوية',
      category: 'الفئة',
      assignee: 'المسؤول',
      created: 'تاريخ الإنشاء',
      description: 'الوصف'
    },
    report: {
      title: 'تقرير التذاكر',
      subtitle: 'ملخص حالة التذاكر ومعلوماتها',
      tableTitle: 'قائمة التذاكر',
      print: 'طباعة التقرير',
      notesTitle: 'ملاحظات',
      notesData: 'هذا التقرير يعرض حالة التذاكر في النظام. يرجى ملاحظة أن البيانات قد تتغير مع مرور الوقت وهذا التقرير يعكس الحالة في وقت إنشائه فقط. للحصول على معلومات محدثة، يرجى إنشاء تقرير جديد.'
    },
    status: {
      open: 'مفتوح',
      inProgress: 'قيد التنفيذ',
      closed: 'مغلق',
      new: 'جديد',
      verified: 'تم التحقق'
    },
    priority: {
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة',
      urgent: 'قصوى'
    },
    category: {
      ui: 'الواجهة',
      security: 'الأمان',
      features: 'الميزات',
      performance: 'الأداء',
      translation: 'الترجمة',
      infrastructure: 'البنية التحتية'
    },
    summaryItems: {
      totalTickets: 'إجمالي التذاكر',
      openTickets: 'التذاكر المفتوحة',
      inProgressTickets: 'التذاكر قيد التنفيذ',
      closedTickets: 'التذاكر المغلقة',
      highPriority: 'أولوية عالية',
      mediumPriority: 'أولوية متوسطة',
      lowPriority: 'أولوية منخفضة'
    }
  },
  general: {
    close: 'إغلاق',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    dateGenerated: 'تاريخ الإنشاء',
    page: 'صفحة'
  }
}
