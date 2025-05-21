export default {
  print: {
    // Card headers and sections
    sections: {
      reportInfo: {
        title: 'معلومات التقرير',
        description: 'أدخل المعلومات الأساسية لرأس التقرير وعنوانه.'
      },
      tableData: {
        title: 'بيانات الجدول',
        description: 'أدخل بياناتك بتنسيق JSON. سيكتشف النظام تلقائيًا جميع الحقول عبر إدخالاتك.'
      },
      notes: {
        title: 'قسم الملاحظات'
      }
    },

    // Form inputs
    inputs: {
      reportTitle: {
        label: 'عنوان التقرير *',
        hint: 'العنوان الرئيسي الذي يظهر في أعلى التقرير',
        rules: {
          required: 'العنوان مطلوب'
        }
      },
      reportSubtitle: {
        label: 'العنوان الفرعي للتقرير',
        hint: 'عنوان ثانوي اختياري أسفل العنوان الرئيسي'
      },
      tableTitle: {
        label: 'عنوان الجدول',
        hint: 'العنوان الذي يظهر مباشرة فوق جدول البيانات',
        placeholder: 'جدول البيانات',
        default: 'جدول البيانات'
      },
      jsonData: {
        label: 'أدخل بياناتك بتنسيق JSON',
        hint: 'كائن واحد أو مصفوفة من الكائنات. مثال: [{ "id": 1, "name": "John" }]',
        rules: {
          required: 'بيانات JSON مطلوبة',
          invalid: 'تنسيق JSON غير صالح'
        }
      },
      notesToggle: {
        label: 'تضمين الملاحظات'
      },
      notesTitle: {
        label: 'عنوان الملاحظات',
        hint: 'العنوان لقسم الملاحظات الخاص بك',
        rules: {
          required: 'عنوان الملاحظات مطلوب عند تفعيل الملاحظات'
        }
      },
      notesContent: {
        label: 'محتوى الملاحظات',
        hint: 'المحتوى النصي لملاحظاتك (يدعم الفقرات المتعددة)',
        rules: {
          required: 'محتوى الملاحظات مطلوب عند تفعيل الملاحظات'
        }
      }
    },

    // Buttons
    buttons: {
      validateJson: 'التحقق من صحة JSON',
      exportPdf: 'تصدير تقرير '
    },

    // Badges and indicators
    badges: {
      validJson: 'JSON صالح',
      invalidJson: 'JSON غير صالح'
    },

    // JSON help section
    jsonHelp: {
      title: 'متطلبات تنسيق JSON:'
    },

    // Validation error messages
    errors: {
      duplicateIds: 'تحتوي البيانات على قيم معرف مكررة',
      jsonSyntax: 'تنسيق JSON غير صالح. يرجى التحقق من بناء الجملة الصحيح بما في ذلك علامات الاقتباس والفواصل.',
      jsonGeneral: 'خطأ في كود JSON. يرجى التحقق من بناء الجملة.'
    },

    // Notifications
    notifications: {
      missingTitle: 'يرجى ملء حقل عنوان التقرير المطلوب',
      invalidData: 'يرجى التحقق من صحة البيانات قبل إنشاء تقرير',
      incompleteNotes: 'يرجى إكمال قسم الملاحظات أو تعطيله'
    }
  }
};
