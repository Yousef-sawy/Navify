export default {
  print: {
    // Card headers and sections
    sections: {
      reportInfo: {
        title: 'Report Information',
        description: 'Enter the basic information for your report header and title.'
      },
      tableData: {
        title: 'Table Data',
        description: 'Enter your data in JSON format. The system will automatically detect all fields across your entries.'
      },
      notes: {
        title: 'Notes Section'
      }
    },

    // Form inputs
    inputs: {
      reportTitle: {
        label: 'Report Title *',
        hint: 'The main title that appears at the top of the report',
        rules: {
          required: 'Title is required'
        }
      },
      reportSubtitle: {
        label: 'Report Subtitle',
        hint: 'Optional secondary title below the main title'
      },
      tableTitle: {
        label: 'Table Title',
        hint: 'Heading that appears directly above the data table',
        placeholder: 'Data Table',
        default: 'Data Table'
      },
      jsonData: {
        label: 'Enter your data in JSON format',
        hint: 'Single object or array of objects. Example: [{ "id": 1, "name": "John" }]',
        rules: {
          required: 'JSON data is required',
          invalid: 'Invalid JSON format'
        }
      },
      notesToggle: {
        label: 'Include Notes'
      },
      notesTitle: {
        label: 'Notes Title',
        hint: 'The heading for your notes section',
        rules: {
          required: 'Notes title is required when notes are enabled'
        }
      },
      notesContent: {
        label: 'Notes Content',
        hint: 'Text content for your notes (supports multiple paragraphs)',
        rules: {
          required: 'Notes content is required when notes are enabled'
        }
      }
    },

    // Buttons
    buttons: {
      validateJson: 'Validate JSON',
      exportPdf: 'Export Report'
    },

    // Badges and indicators
    badges: {
      validJson: 'Valid JSON',
      invalidJson: 'Invalid JSON'
    },

    // JSON help section
    jsonHelp: {
      title: 'JSON Format Requirements:',
    },

    // Validation error messages
    errors: {
      duplicateIds: 'Data contains duplicate ID values',
      jsonSyntax: 'Invalid JSON format. Please check for proper syntax including quotes and commas.',
      jsonGeneral: 'Error in JSON code. Please check syntax.'
    },

    // Notifications
    notifications: {
      missingTitle: 'Please fill in the required Report Title field',
      invalidData: 'Please validate your data before generating a report',
      incompleteNotes: 'Please complete the notes section or disable it'
    }
  }
};
