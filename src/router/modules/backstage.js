import Backstage from '@/layouts/Backstage'
import Main from '@/components/backstage/BackMain'
const backstageRouter = {
    path: '/backstage',
    name: 'backstage',
    redirect: '/backstage/homePage',
    component: Backstage,
    children: [{
            path: 'homePage',
            name: 'homePage',
            redirect: '/backstage/homePage/imageCarousel',
            component: Main,
            children: [{
                path: 'imageCarousel',
                name: 'imageCarousel',
                component: () =>
                    import ('@/views/backstage/homePage/ImageCarousel.vue'),
            }, ]
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
                        import ('@/views/backstage/menu/MenuNav.vue'),
                },
                {
                    path: 'authority',
                    name: 'authority',
                    component: () =>
                        import ('@/views/backstage/menu/MenuAuthority.vue'),
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
                        import ('@/views/backstage/notice/NoticeManage')
                }, {
                    path: 'edit',
                    name: 'edit',
                    component: () =>
                        import ('@/views/backstage/notice/NoticeEdit')
                },
                {
                    path: 'sort',
                    name: 'sort',
                    component: () =>
                        import ('@/views/backstage/notice/NoticeSort')
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
                    import ('@/views/backstage/system/SystemLog.vue'),
            }]
        },
        {
            path: 'resource',
            name: 'resource',
            redirect: 'resource/upload',
            component: Main,
            children: [{
                    path: 'secretKey',
                    name: 'secretKey',
                    component: () =>
                        import ('@/views/backstage/resource/SecretKey.vue'),
                },
                {
                    path: 'upload',
                    name: 'upload',
                    component: () =>
                        import ('@/views/backstage/resource/ResourceUpload.vue'),
                },
                {
                    path: 'sort',
                    name: 'sort',
                    component: () =>
                        import ('@/views/backstage/resource/ResourceSort.vue'),
                },
            ]
        },
        {
            path: 'book',
            component: Main,
            redirect: 'book/bookMenu',
            children: [{
                    path: 'statistics',
                    component: () =>
                        import ('@/views/backstage/book/Statistics.vue')
                },
                {
                    path: 'bookMenu',
                    component: () =>
                        import ('@/views/backstage/book/BookMenu.vue')
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
            component: Main,
            children: [{
                    path: 'memberManagement',
                    name: 'memberManagement',
                    component: () =>
                        import ('@/views/backstage/user/MemberManagement.vue')
                },
                {
                    path: 'collegeManagement',
                    name: 'collegeManagement',
                    component: () =>
                        import ('@/views/backstage/user/CollegeManagement.vue')
                }
            ]
        }
    ]
}
export default backstageRouter