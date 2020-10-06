import siae from '@/layouts/SIAE'

const siaeRouter = {
    path: '/',
    name: 'siae',
    redirect: '/homepage',
    component: siae,
    children: [{
            path: 'homepage',
            name: 'homepage',
            component: () =>
                import ('@/views/siae/homepage/index.vue'),
        },
        {
            path: 'join',
            name: 'join',
            redirect: '/join/apply',
            component: () =>
                import ('@/views/siae/join'),
            children: [{
                path: 'apply',
                name: 'apply',
                component: () =>
                    import ('@/views/siae/join/apply'),
            }, ]
        },
        {
            path: 'notice',
            name: 'notice',
            redirect: 'notice/all',
            component: () =>
                import ('@/views/siae/notice'),
            children: [{
                    path: 'all',
                    name: 'all',
                    component: () =>
                        import ('@/views/siae/notice/all'),
                },
                {
                    path: 'details',
                    name: 'details',
                    component: () =>
                        import ('@/views/siae/notice/details'),
                },
            ]
        },
        {
            path: 'data-download',
            name: 'data-download',
            component: () =>
                import ('@/views/siae/data-download'),
        },
        {
            path: 'books-borrow',
            name: 'books-borrow',
            component: () =>
                import ('@/views/siae/books-borrow'),
        },
        {
            path: 'personal-center',
            name: 'personal-center',
            redirect: '/personal-center/home',
            component: () =>
                import ('@/views/siae/personal-center'),
            children: [{
                    path: 'home',
                    name: 'home',
                    component: () =>
                        import ('@/views/siae/personal-center/home'),
                },
                {
                    path: 'my-info',
                    name: 'my-info',
                    component: () =>
                        import ('@/views/siae/personal-center/my-info'),
                },
                {
                    path: 'update-password',
                    name: 'update-password',
                    component: () =>
                        import ('@/views/siae/personal-center/update-password'),
                }
            ]
        },
        {
            path: 'account',
            name: 'account',
            redirect: 'account/',
            component: () =>
                import ('@/views/siae/account'),
            children: [{
                    path: 'login',
                    name: 'content',
                    component: () =>
                        import ('@/views/siae/account/login'),
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () =>
                        import ('@/views/siae/account/register'),
                },
                {
                    path: 'forget-pwd',
                    name: 'forget-pwd',
                    component: () =>
                        import ('@/views/siae/account/forget-pwd'),
                },
            ]

        }
    ]
}
export default siaeRouter