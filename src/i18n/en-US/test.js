export default {
  test: {
    title: 'Print Test Page',
    summary: 'Tickets Summary',
    description: 'This page is dedicated to testing the report printing feature in Arabic.',
    table: {
      title: 'Ticket List',
      id: 'ID',
      title: 'Title',
      status: 'Status',
      priority: 'Priority',
      category: 'Category',
      assignee: 'Assignee',
      created: 'Created Date',
      description: 'Description'
    },
    report: {
      title: 'Tickets Report',
      subtitle: 'Summary of ticket status and information',
      tableTitle: 'Ticket List',
      print: 'Print Report',
      notesTitle: 'Notes',
      notesData: 'This report displays the status of tickets in the system. Please note that data may change over time and this report reflects the status at the time of creation only. For updated information, please generate a new report.'
    },
    status: {
      open: 'Open',
      inProgress: 'In Progress',
      closed: 'Closed',
      new: 'New',
      verified: 'Verified'
    },
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      urgent: 'Urgent'
    },
    category: {
      ui: 'User Interface',
      security: 'Security',
      features: 'Features',
      performance: 'Performance',
      translation: 'Translation',
      infrastructure: 'Infrastructure'
    },
    summaryItems: {
      totalTickets: 'Total Tickets',
      openTickets: 'Open Tickets',
      inProgressTickets: 'In Progress Tickets',
      closedTickets: 'Closed Tickets',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority'
    }
  },
  general: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    loading: 'Loading...',
    noData: 'No data available',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    dateGenerated: 'Date Generated',
    page: 'Page'
  }
}
