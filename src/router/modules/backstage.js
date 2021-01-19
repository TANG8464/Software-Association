import Backstage from '@/layouts/Backstage'
import Main from '@/layouts/Backstage/components/BackMain'
const backstageRouter = {
    path: '/backstage',
    name: 'backstage',
    meta: {
        roles: ['admin']
    },
    redirect: '/backstage/data-monitor',
    component: Backstage,
    children: [{
            path: 'data-monitor',
            name: 'data-monitor',
            meta: {
                roles: ['admin']
            },
            component: () =>
                import ('@/views/backstage/data-monitor'),
        }, {
            path: 'siae',
            name: 'backstage-siae',
            redirect: '/backstage/siae/image-carousel',
            meta: {
                roles: ['admin']
            },
            component: Main,
            children: [{
                    path: 'image-carousel',
                    name: 'image-carousel',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/siae/image-carousel.vue'),
                },
                {

                    path: 'background-image',
                    name: 'background-image',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/siae/background-image.vue'),
                },
                {

                    path: 'message',
                    name: 'message',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/siae/message.vue'),
                }
            ]
        },
        {
            path: 'menu',
            name: 'backstage-menu',
            meta: {
                roles: ['admin']
            },
            redirect: '/backstage/menu/nav',
            component: Main,
            children: [{
                    path: 'nav',
                    name: 'nav',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/menu/nav.vue'),
                },
                {
                    path: 'authority',
                    name: 'authority',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/menu/authority.vue'),
                },

            ]
        },
        {
            path: 'notice',
            name: 'backstage-notice',
            meta: {
                roles: ['admin']
            },
            redirect: '/backstage/notice/manage',
            component: Main,
            children: [{
                    path: 'manage',
                    name: 'manage',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/notice/manage')
                }, {
                    path: 'edit',
                    name: 'edit',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/notice/edit')
                },
                {
                    path: 'sort',
                    name: 'notice-sort',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/notice/sort')
                }
            ]
        },
        {
            path: 'system',
            name: 'system',
            redirect: 'system/log',
            component: Main,
            children: [{
                path: 'log',
                name: 'log',
                meta: {
                    roles: ['admin']
                },
                component: () =>
                    import ('@/views/backstage/system/log.vue'),
            }]
        },
        {
            path: 'resource',
            name: 'resource',
            redirect: 'resource/upload',
            component: Main,
            children: [{
                    path: 'secret-key',
                    name: 'secret-key',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/resource/secret-key.vue'),
                },
                {
                    path: 'upload',
                    name: 'upload',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/resource/upload.vue'),
                },
                {
                    path: 'sort',
                    name: 'resource-sort',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/resource/sort.vue'),
                },
            ]
        },
        {
            path: 'book',
            component: Main,
            redirect: 'book/menu',
            children: [{
                    path: 'statistics',
                    name: 'statistics',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/book/statistics.vue')
                },
                {
                    path: 'menu',
                    name: 'menu',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/book/menu.vue')
                },
                {
                    path: 'category',
                    name: 'category',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/book/category.vue')
                },
                {
                    path: 'entry',
                    name: 'entry',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/book/entry.vue')
                },
                {
                    path: 'record',
                    name: 'record',
                    component: () =>
                        import ('@/views/backstage/book/record.vue')
                }
            ]

        },
        {
            path: 'user',
            name: 'user',
            meta: {
                roles: ['admin']
            },
            redirect: 'user/member',
            component: Main,
            children: [{
                    path: 'member',
                    name: 'member',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/user/member.vue')
                },
                {
                    path: 'college',
                    name: 'college',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/user/college.vue')
                },
                {
                    path: 'add',
                    name: 'add',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/user/add.vue')
                },
                {
                    path: 'test',
                    name: 'test',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/user/test.vue')
                },
                {
                    path: 'check',
                    name: 'check',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                        import ('@/views/backstage/user/check.vue')
                },
                {
                    path:'experience-category',
                    name:'experience-category',
                    meta: {
                        roles: ['admin']
                    },
                    component: () =>
                    import ('@/views/backstage/user/experience-category.vue')
                }
            ]
        }
    ]
}
export default backstageRouter