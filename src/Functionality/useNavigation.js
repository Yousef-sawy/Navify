// src\Functionality\useNavigation.js
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const navigationLinks = ref([])
const STORAGE_KEY = 'dynamic-navigation-links'

// Added list of available icons for selection
export const iconOptions = [
  { label: 'Link', value: 'link' },
  { label: 'Home', value: 'home' },
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Settings', value: 'settings' },
  { label: 'Person', value: 'person' },
  { label: 'Info', value: 'info' },
  { label: 'Mail', value: 'mail' },
  { label: 'List', value: 'list' },
  { label: 'Star', value: 'star' },
  { label: 'Folder', value: 'folder' },
  { label: 'Build', value: 'build' },
  { label: 'Menu', value: 'menu' },
  { label: 'Assignment', value: 'assignment' },
  { label: 'Bookmark', value: 'bookmark' },
  { label: 'Favorite', value: 'favorite' },
  { label: 'Shopping Cart', value: 'shopping_cart' },
  { label: 'Payment', value: 'payment' },
  { label: 'Account', value: 'account_circle' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Public', value: 'public' },
  { label: 'School', value: 'school' },
  { label: 'Work', value: 'work' },
  { label: 'Chat', value: 'chat' },
  { label: 'Feedback', value: 'feedback' },
]

export function useNavigation() {
  const router = useRouter()
  const $q = useQuasar()

  // Passed when editing an existing link.
  const titleExists = (title, excludeId = null) => {
    const normalizedTitle = title.trim().toLowerCase();

    const mainLinkExists = navigationLinks.value.some(link =>
      link.id !== excludeId && link.title.toLowerCase() === normalizedTitle
    );

    if (mainLinkExists) return true;

    for (const parent of navigationLinks.value) {
      const sublinkExists = parent.children.some(child =>
        child.id !== excludeId && child.title.toLowerCase() === normalizedTitle
      );

      if (sublinkExists) return true;
    }

    return false;
  };

  const pathExists = (path, parentId = null, excludeId = null) => {
    const normalizedPath = path.trim().toLowerCase();

    if (parentId) {
      const parent = findLinkById(parentId);
      if (parent) {
        return parent.children.some(child =>
          child.id !== excludeId && child.path.toLowerCase() === normalizedPath
        );
      }
    } else {
      return navigationLinks.value.some(link =>
        link.id !== excludeId && link.path.toLowerCase() === normalizedPath
      );
    }

    return false;
  };

  const loadNavigation = () => {
    try {
      const savedNavigation = localStorage.getItem(STORAGE_KEY)
      if (savedNavigation) {
        navigationLinks.value = JSON.parse(savedNavigation)

        // Ensure all links have an icon property
        ensureIconsExist(navigationLinks.value)

        registerAllRoutes()
      }
    } catch (error) {
      console.error('Failed to load navigation from storage:', error)
    }
  }

  // Helper function to ensure all links have an icon property
  const ensureIconsExist = (links) => {
    links.forEach(link => {
      if (!link.icon) link.icon = 'link'

      if (link.children && link.children.length) {
        ensureIconsExist(link.children)
      }
    })
  }

  const saveNavigation = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(navigationLinks.value))
    } catch (error) {
      console.error('Failed to save navigation to storage:', error)
    }
  }

  const addLink = (linkData, isSublink = false) => {
    // console.log('Adding link with data:', linkData, 'isSublink:', isSublink);

    if (titleExists(linkData.title)) {
      throw new Error('A link with this title already exists. Please use a unique title.');
    }

    if (pathExists(linkData.path, isSublink ? linkData.parentId : null)) {
      throw new Error('A link with this path already exists. Please use a unique path.');
    }

    const newLink = {
      id: Date.now().toString(),
      title: linkData.title,
      path: linkData.path,
      icon: linkData.icon || 'link', // Add icon property with default fallback
      visible: true,
      children: []
    }

    if (isSublink && linkData.parentId) {
      // console.log('This is a sublink, looking for parent:', linkData.parentId);

      const parent = findLinkById(linkData.parentId);

      if (parent) {
        console.log('Found parent link:', parent.title);
        parent.children.push(newLink)

        registerRoute(`/${parent.path}/${newLink.path}`, newLink.id, newLink.title)
      } else {
        console.error('Parent link not found with ID:', linkData.parentId);
        throw new Error('Parent link not found');
      }
    } else {
      console.log('This is a main link');
      navigationLinks.value.push(newLink)

      registerRoute(`/${newLink.path}`, newLink.id, newLink.title)
    }

    saveNavigation()

    return newLink.id
  }

  const updateLink = (id, updatedData) => {
    const link = findLinkById(id);
    if (link) {
      // Update properties
      if (updatedData.title) link.title = updatedData.title;
      if (updatedData.path) link.path = updatedData.path;
      if (updatedData.icon) link.icon = updatedData.icon;

      // Re-register routes if path changed
      if (updatedData.path) {
        registerAllRoutes();
      }

      saveNavigation();
      return true;
    }
    return false;
  }

  const deleteLink = (id) => {
    const mainIndex = navigationLinks.value.findIndex(link => link.id === id)

    if (mainIndex !== -1) {
      removeRoute(`dynamic-${id}`)

      for (const child of navigationLinks.value[mainIndex].children) {
        removeRoute(`dynamic-${child.id}`)
      }

      navigationLinks.value.splice(mainIndex, 1)
      saveNavigation()
      return true
    }

    for (const parent of navigationLinks.value) {
      const childIndex = parent.children.findIndex(child => child.id === id)
      if (childIndex !== -1) {
        removeRoute(`dynamic-${id}`)

        parent.children.splice(childIndex, 1)
        saveNavigation()
        return true
      }
    }

    return false
  }

  const toggleLinkVisibility = (id) => {
    const link = findLinkById(id)
    if (link) {
      link.visible = !link.visible
      saveNavigation()
      return true
    }
    return false
  }

  const findLinkById = (id, links = navigationLinks.value) => {
    for (const link of links) {
      if (link.id === id) {
        return link
      }

      if (link.children.length) {
        const found = findLinkById(id, link.children)
        if (found) return found
      }
    }
    return null
  }

  const registerRoute = (path, id, title) => {
    try {
      console.log(`Registering route: ${path}, name: dynamic-${id}, title: ${title}`);

      router.addRoute({
        path,
        name: `dynamic-${id}`,
        component: () => import('../pages/ErrorNotFound.vue'),
        meta: { title }
      })
      console.log('Current routes:', router.getRoutes().map(r => r.path));
    } catch (error) {
      console.error('Error registering route:', error)
      if ($q) {
        $q.notify({
          type: 'negative',
          message: 'Failed to register route. Check console for details.'
        })
      }
    }
  }

  const removeRoute = (name) => {
    try {
      router.removeRoute(name)
      console.log(`Route removed: ${name}`)
    } catch (error) {
      console.error('Error removing route:', error)
    }
  }

  const registerAllRoutes = () => {
    router.getRoutes().forEach(route => {
      if (route.name?.startsWith('dynamic-')) {
        router.removeRoute(route.name)
      }
    })

    navigationLinks.value.forEach(link => {
      registerRoute(`/${link.path}`, link.id, link.title)

      link.children.forEach(sublink => {
        registerRoute(`/${link.path}/${sublink.path}`, sublink.id, sublink.title)
      })
    })
  }

  watch(navigationLinks, () => {
    saveNavigation()
  }, { deep: true })

  return {
    navigationLinks,
    addLink,
    updateLink, // Added update function
    deleteLink,
    toggleLinkVisibility,
    findLinkById,
    loadNavigation,
    titleExists,
    pathExists,
    iconOptions, // Exporting icon options
  }
}
