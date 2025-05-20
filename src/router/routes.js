const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: '/link', component: () => import('src/pages/NavigationBuilder.vue') },
      { path: 'test', component: () => import('pages/TestPage.vue') },
      { path: 'feedback', component: () => import('pages/FeedbackPage.vue') },
      { path: 'print', component: () => import('src/pages/PrintPage.vue') },
      // { path: 'playground', component: () => import('pages/PlayGround.vue') },



    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
