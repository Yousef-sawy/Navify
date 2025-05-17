// src/i18n/feedback-ar.js

export default {
  feedback: {
    // Page headers
    title: "التعليقات والدعم",
    subtitle: "إنشاء وإدارة التذاكر الخاصة بك",

    // Form sections
    form: {
      title: "إرسال تذكرة جديدة",
      updateTitle: "تحديث التذكرة #{id}",
      subtitle: "أخبرنا عن تجربتك أو مشكلتك أو اقتراحك",
      updateSubtitle: "تعديل تفاصيل التذكرة أدناه",

      // Type selection
      typeQuestion: "ماذا تريد أن ترسل؟",
      typeIssue: "الإبلاغ عن مشكلة",
      typeFeedback: "مشاركة التعليقات",
      typeFeatureRequest: "طلب ميزة",
      typeOther: "شيء آخر",

      // Priority section
      priorityQuestion: "ما مدى إلحاح هذه المشكلة؟",
      priorityLow: "منخفضة",
      priorityMedium: "متوسطة",
      priorityHigh: "عالية",
      priorityCritical: "حرجة",

      // Priority descriptions
      priorityLowDesc: "مشكلة بسيطة لا تؤثر بشكل كبير على الاستخدام",
      priorityMediumDesc: "مشكلة مهمة يجب معالجتها قريبًا",
      priorityHighDesc: "مشكلة خطيرة تؤثر على الوظائف الأساسية",
      priorityCriticalDesc: "مشكلة عاجلة تتطلب اهتمامًا فوريًا",

      // Form fields
      subject: "الموضوع",
      subjectPlaceholder: "عنوان موجز للتعليق أو المشكلة",
      description: "الوصف",
      descriptionPlaceholder: "يرجى تقديم معلومات مفصلة...",
      contactInfo: "معلومات الاتصال",
      name: "اسمك",
      namePlaceholder: "محمد أحمد",
      email: "عنوان البريد الإلكتروني",
      emailPlaceholder: "انت@مثال.com",

      // Buttons
      submit: "إرسال التذكرة",
      update: "تحديث التذكرة",
      cancel: "إلغاء",
      reset: "إعادة تعيين"
    },

    // Table
    table: {
      title: "سجل التذاكر",
      subtitle: "عرض وإدارة جميع التذاكر المرسلة",
      search: "البحث في التذاكر...",
      noData: "لم يتم إرسال أي تذاكر بعد.",

      // Columns
      columns: {
        id: "الرقم",
        type: "النوع",
        subject: "الموضوع",
        priority: "الأولوية",
        status: "الحالة",
        actions: "الإجراءات"
      },

      // Actions
      actions: {
        view: "عرض التفاصيل",
        edit: "تعديل",
        delete: "حذف"
      },

      // Status options
      status: {
        new: "جديدة",
        inProgress: "قيد التنفيذ",
        resolved: "تم الحل",
        closed: "مغلقة"
      }
    },

    // Ticket details
    details: {
      title: "تفاصيل التذكرة",
      ticketId: "رقم التذكرة",
      type: "النوع",
      priority: "الأولوية",
      status: "الحالة",
      submittedBy: "مقدمة من",
      contactEmail: "البريد الإلكتروني للاتصال",
      submittedOn: "تاريخ الإرسال",
      description: "الوصف",
      na: "غير متاح",

      // Buttons
      edit: "تعديل",
      close: "إغلاق"
    },

    // Delete dialog
    delete: {
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف التذكرة #{id}؟",
      warning: "لا يمكن التراجع عن هذا الإجراء.",
      cancel: "إلغاء",
      confirm: "حذف"
    },

    // Print report
    report: {
      title: "تقرير تذاكر الدعم",
      subtitle: "ملخص لجميع تذاكر التعليقات والدعم المرسلة",
      tableTitle: "قائمة التذاكر",
      noteTitle: "التعليقات:",
      notesData: "يتضمن هذا التقرير جميع التذاكر المرسلة من خلال نظام التعليقات والدعم.",
      print: "طباعة التقرير",
      SummaryTitle:"ملخص",
      summary: {
        totalTickets: "إجمالي التذاكر",
        openTickets: "التذاكر المفتوحة",
        inProgressTickets: "قيد التنفيذ",
        resolvedTickets: "تم حلها",
        closedTickets: "مغلقة",
        issueCount: "المشاكل",
        feedbackCount: "التعليقات",
        featureRequests: "طلبات الميزات",
        otherTickets: "أخرى",
        dateRange: "النطاق الزمني"
      }
    }
  }
}
