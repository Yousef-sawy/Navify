// src/i18n/feedback-en.js

export default {
  feedback: {
    // Page headers
    title: "Feedback & Support",
    subtitle: "Create and manage your tickets",

    // Form sections
    form: {
      title: "Submit New Ticket",
      updateTitle: "Update Ticket #{id}",
      subtitle: "Tell us about your experience, issue, or suggestion",
      updateSubtitle: "Modify the ticket details below",

      // Type selection
      typeQuestion: "What would you like to submit?",
      typeIssue: "Report an Issue",
      typeFeedback: "Share Feedback",
      typeFeatureRequest: "Request a Feature",
      typeOther: "Something Else",

      // Priority section
      priorityQuestion: "How urgent is this issue?",
      priorityLow: "Low",
      priorityMedium: "Medium",
      priorityHigh: "High",
      priorityCritical: "Critical",

      // Priority descriptions
      priorityLowDesc: "Minor issue that doesn't significantly affect usage",
      priorityMediumDesc: "Important issue that should be addressed soon",
      priorityHighDesc: "Serious issue affecting core functionality",
      priorityCriticalDesc: "Urgent issue requiring immediate attention",

      // Form fields
      subject: "Subject",
      subjectPlaceholder: "Brief title of your feedback or issue",
      description: "Description",
      descriptionPlaceholder: "Please provide detailed information...",
      contactInfo: "Contact Information",
      name: "Your Name",
      namePlaceholder: "John Smith",
      email: "Email Address",
      emailPlaceholder: "you@example.com",

      // Buttons
      submit: "Submit Ticket",
      update: "Update Ticket",
      cancel: "Cancel",
      reset: "Reset"
    },

    // Table
    table: {
      title: "Ticket History",
      subtitle: "View and manage all submitted tickets",
      search: "Search tickets...",
      noData: "No tickets submitted yet.",

      // Columns
      columns: {
        id: "ID",
        type: "Type",
        subject: "Subject",
        priority: "Priority",
        status: "Status",
        actions: "Actions"
      },

      // Actions
      actions: {
        view: "View Details",
        edit: "Edit",
        delete: "Delete"
      },

      // Status options
      status: {
        new: "New",
        inProgress: "In Progress",
        resolved: "Resolved",
        closed: "Closed"
      }
    },

    // Ticket details
    details: {
      title: "Ticket Details",
      ticketId: "Ticket ID",
      type: "Type",
      priority: "Priority",
      status: "Status",
      submittedBy: "Submitted By",
      contactEmail: "Contact Email",
      submittedOn: "Submitted On",
      description: "Description",
      na: "N/A",

      // Buttons
      edit: "Edit",
      close: "Close"
    },

    // Delete dialog
    delete: {
      title: "Confirm Deletion",
      message: "Are you sure you want to delete ticket #{id}?",
      warning: "This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete"
    },

    // Print report
    report: {
      title: "Support Tickets Report",
      subtitle: "Summary of all submitted feedback and support tickets",
      tableTitle: "Tickets List",
      noteTitle: "Notes:",
      notesData: "This fdsfsfsfreport includes all tickets submitted through the Feedback & Support system.",
      print: "Print Report",
      summaryTitle:"Summary",
      summary: {
        totalTickets: "Total Tickets",
        openTickets: "Open Tickets",
        inProgressTickets: "In Progress",
        resolvedTickets: "Resolved",
        closedTickets: "Closed",
        issueCount: "Issues",
        feedbackCount: "Feedback",
        featureRequests: "Feature Requests",
        otherTickets: "Other",
        dateRange: "Date Range"
      }
    }
  }
}
