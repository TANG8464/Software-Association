import backstage from '@/views/backstage'
const backstageRouter = {
    path: '/backstage',
    name: 'backstage',
    redirect: '/backstage/homePage',
    component: backstage,
    children: [{
            path: 'homePage',
            name: 'homePage',
            component: () =>
                import ('@/views/backstage/homePage.vue')
        },
        {
            path: 'menu',
            name: 'menu',
            redirect: '/backstage/menu/nav',
            component: () =>
                import ('@/views/backstage/menu.vue'),
            children: [{
                    path: 'nav',
                    name: 'nav',
                    component: () =>
                        import ('@/views/backstage/menu/nav.vue'),
                },
                {
                    path: 'authority',
                    name: 'authority',
                    component: () =>
                        import ('@/views/backstage/menu/authority.vue'),
                },

            ]
        },
        {
            path: 'notice',
            name: 'notice',
            redirect: '/backstage/notice/manager',
            component: () =>
                import ('@/views/backstage/notice.vue'),
            children: [{
                    path: 'manager',
                    name: 'manager',
                    component: () =>
                        import ('@/views/backstage/notice/manage.vue')
                }, {
                    path: 'edit',
                    name: 'edit',
                    component: () =>
                        import ('@/views/backstage/notice/edit.vue')
                },
                {
                    path: 'sort',
                    name: 'sort',
                    component: () =>
                        import ('@/views/backstage/notice/sort.vue')
                }
            ]
        },
        {
            path: 'system',
            name: 'system',
            redirect: 'system/log',
            component: () =>
                import ('@/views/backstage/system.vue'),
            children: [{
                path: 'log',
                name: 'log',
                component: () =>
                    import ('@/views/backstage/system/log.vue'),
            }]
        },
        {
            path: 'resource',
            name: 'resource',
            redirect: 'resource/upload',
            component: () =>
                import ('@/views/backstage/resource.vue'),
            children: [{
                    path: 'secretKey',
                    name: 'secretKey',
                    component: () =>
                        import ('@/views/backstage/resource/secretKey.vue'),
                },
                {
                    path: 'upload',
                    name: 'upload',
                    component: () =>
                        import ('@/views/backstage/resource/upload.vue'),
                },
                {
                    path: 'sort',
                    name: 'sort',
                    component: () =>
                        import ('@/views/backstage/resource/sort.vue'),
                },
            ]
        },
        {
            path: 'book',
            component: () =>
                import ("@/views/backstage/book.vue"),
            redirect: 'book/bookMenu',
            children: [{
                    path: 'statistics',
                    component: () =>
                        import ('@/views/backstage/book/Statistics.vue')
                },
                {
                    path: 'bookMenu',
                    component: () =>
                        import ('@/views/backstage/book/Bookmenu.vue')
                },
                {
                    path: 'category',
                    component: () =>
                        import ('@/views/backstage/book/Category.vue')
                },
                {
                    path: 'entry',
                    component: () =>
                        import ('@/views/backstage/book/Entry.vue')
                },
                {
                    path: 'record',
                    component: () =>
                        import ('@/views/backstage/book/Record.vue')
                }
            ]

        },
        {
            path: 'user',
            name: 'user',
            redirect: 'user/memberManagement',
            component: () =>
                import ('@/views/backstage/user.vue'),
            children: [{
                    path: 'memberManagement',
                    name: 'memberManagement',
                    component: () =>
                        import ('@/views/backstage/user/memberManagement.vue')
                },
                {
                    path: 'collegeManagement',
                    name: 'collegeManagement',
                    component: () =>
                        import ('@/views/backstage/user/collegeManagement.vue')
                }
            ]
        }
    ]
}
export default backstageRouter