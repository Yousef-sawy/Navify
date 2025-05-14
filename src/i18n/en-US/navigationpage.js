export default {
  navigationPage: {
    header: {
      title: 'Navigation Builder',
      subtitle: 'Create and manage custom navigation structure'
    },
    builderCard: {
      title: 'Create New Navigation Link',
      subtitle: 'Design the navigation structure for your site',
      linkType: {
        label: 'Link Type',
        main: 'Main Navigation Link',
        mainTooltip: 'Top-level navigation element',
        sub: 'Sub-link / Child Page',
        subTooltip: 'Child page under a main link',
        noMainTooltip: 'Create a main link first'
      },
      formFields: {
        title: {
          label: 'Link Title *',
          hint: 'Text displayed in navigation menus',
          required: 'Title is required',
          exists: 'A link with this title already exists'
        },
        path: {
          label: 'Link Path *',
          hint: 'URL path (letters, numbers, hyphens, underscores)',
          required: 'Path is required',
          invalid: 'Only letters, numbers, hyphens, and underscores are allowed',
          existsMain: 'A main link with this path already exists',
          existsSub: 'A sub-link with this path already exists under this parent'
        },
        icon: {
          label: 'Menu Icon *',
          hint: 'Icon displayed next to the link in navigation menu',
          required: 'Icon is required'
        },
        parent: {
          label: 'Parent Link *',
          hint: 'Main navigation link this sub-link belongs to',
          required: 'Parent link is required',
          noResults: 'No results'
        }
      },
      createMainFirst: 'Please create a main link first before adding sub-links.',
      buttons: {
        reset: 'Reset',
        add: 'Add Navigation Link'
      }
    },
    previewCard: {
      title: 'Navigation Preview',
      subtitle: 'Visualize your navigation structure',
      emptyState: 'No navigation links created yet. Use the form to build your navigation structure.',
      noSublinks: 'No sub-links yet. Add some using the form.',
      tooltips: {
        hide: 'Hide link',
        show: 'Show link',
        delete: 'Delete link'
      }
    },
    notifications: {
      mainLinkSuccess: 'Main link created successfully!',
      sublinkSuccess: 'Sub-link created successfully!',
      error: 'Failed to add navigation link',
      formErrors: 'Please correct form errors before submitting',

      mainLinkDeleted: 'Main link "{title}" deleted successfully!',
      sublinkDeleted: 'Sub-link "{title}" deleted successfully!',
      deleteFailed: 'Failed to delete link: {error}',
      unknownError: 'Unknown error'
    }
  }
}
