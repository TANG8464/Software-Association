import Backstage from '@/layouts/Backstage'
import Main from '@/layouts/Backstage/components/BackMain'
const backstageRouter = {
    path: '/backstage',
    name: 'backstage',
    redirect: '/backstage/siae',
    component: Backstage,
    children: [{
            path: 'siae',
            name: 'siae',
            redirect: '/backstage/siae/image-carousel',
            component: Main,
            children: [{
                    path: 'image-carousel',
                    name: 'image-carousel',
                    component: () =>
                        import ('@/views/backstage/siae/image-carousel.vue'),
                },
                {

                    path: 'background-image',
                    name: 'background-image',
                    component: () =>
                        import ('@/views/backstage/siae/background-image.vue'),
                },
                {

                    path: 'message',
                    name: 'message',
                    component: () =>
                        import ('@/views/backstage/siae/message.vue'),
                }
            ]
        },
        {
            path: 'menu',
            name: 'menu',
            redirect: '/backstage/menu/nav',
            component: Main,
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
            redirect: '/backstage/notice/manage',
            component: Main,
            children: [{
                    path: 'manage',
                    name: 'manage',
                    component: () =>
                        import ('@/views/backstage/notice/manage')
                }, {
                    path: 'edit',
                    name: 'edit',
                    component: () =>
                        import ('@/views/backstage/notice/edit')
                },
                {
                    path: 'sort',
                    name: 'sort',
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
                    component: () =>
                        import ('@/views/backstage/resource/secret-key.vue'),
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
            component: Main,
            redirect: 'book/menu',
            children: [{
                    path: 'statistics',
                    component: () =>
                        import ('@/views/backstage/book/statistics.vue')
                },
                {
                    path: 'menu',
                    component: () =>
                        import ('@/views/backstage/book/menu.vue')
                },
                {
                    path: 'category',
                    component: () =>
                        import ('@/views/backstage/book/category.vue')
                },
                {
                    path: 'entry',
                    component: () =>
                        import ('@/views/backstage/book/entry.vue')
                },
                {
                    path: 'record',
                    component: () =>
                        import ('@/views/backstage/book/record.vue')
                }
            ]

        },
        {
            path: 'user',
            name: 'user',
            redirect: 'user/member',
            component: Main,
            children: [{
                    path: 'member',
                    name: 'member',
                    component: () =>
                        import ('@/views/backstage/user/member.vue')
                },
                {
                    path: 'college',
                    name: 'college',
                    component: () =>
                        import ('@/views/backstage/user/college.vue')
                },
                {
                    path: 'add',
                    name: 'add',
                    component: () =>
                        import ('@/views/backstage/user/add.vue')
                },
                {
                    path: 'test',
                    name: 'test',
                    component: () =>
                        import ('@/views/backstage/user/test.vue')
                }
            ]
        }
    ]
}
export default backstageRouter