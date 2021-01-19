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
            import('@/views/siae/homepage'),
    },
    {
        path: 'homepage-last',
        name: 'homepage-last',

        component: () =>
            import('@/views/siae/homepage-last'),
        children: [{
            path: 'association-profile',
            name: 'association-profile',
            component: () =>
                import('@/views/siae/homepage-last/association-profile'),
        },
        {
            path: 'member-introduction',
            name: 'member-introduction',
            component: () =>
                import('@/views/siae/homepage-last/member-introduction'),
        },
        {
            path: 'contact-us',
            name: 'contact-us',
            component: () =>
                import('@/views/siae/homepage-last/contact-us'),
        },
        {
            path: 'common-problem',
            name: 'common-problem',
            component: () =>
                import('@/views/siae/homepage-last/common-problem'),
        }
        ]
    },
    {
        path: 'join',
        name: 'join',
        meta: {
            roles: ['admin', 'visitor']
        },
        redirect: '/join/apply',
        component: () =>
            import('@/views/siae/join'),
        children: [{
            path: 'apply',
            name: 'apply',
            meta: {
                roles: ['admin', 'visitor']
            },
            component: () =>
                import('@/views/siae/join/apply'),
        },]
    },
    {
        path: 'notice',
        name: 'notice',

        redirect: 'notice/all',
        component: () =>
            import('@/views/siae/notice'),
        children: [{
            path: 'all',
            name: 'all',
            meta: {
                roles: ['visitor', 'non-member', 'member', 'admin']
            },
            component: () =>
                import('@/views/siae/notice/all'),
        },
        {
            path: 'details',
            name: 'details',
            meta: {
                roles: ['visitor', 'non-member', 'member', 'admin']
            },
            component: () =>
                import('@/views/siae/notice/details'),
        },
        ]
    },
    {
        path: 'data-download',
        name: 'data-download',
        meta: {
            roles: ['admin', 'member']
        },
        component: () =>
            import('@/views/siae/data-download'),
    },
    {
        path: 'books-borrow',
        name: 'books-borrow',
        meta: {
            roles: ['admin', 'member']
        },
        component: () =>
            import('@/views/siae/books-borrow'),
    },
    {
        path: 'personal-center',
        name: 'personal-center',

        redirect: '/personal-center/home',
        component: () =>
            import('@/views/siae/personal-center'),
        children: [{
            path: 'home',
            name: 'home',
            component: () =>
                import('@/views/siae/personal-center/home'),
        },
        {
            path: 'my-info',
            name: 'my-info',
            component: () =>
                import('@/views/siae/personal-center/my-info'),
        },
        {
            path: 'update-password',
            name: 'update-password',
            component: () =>
                import('@/views/siae/personal-center/update-password'),
        }
        ]
    },
    {
        path: 'account',
        name: 'account',
        redirect: 'account/',

        component: () =>
            import('@/views/siae/account'),
        children: [{
            path: 'login',
            name: 'content',
            component: () =>
                import('@/views/siae/account/login'),
        },
        {
            path: 'register',
            name: 'register',
            component: () =>
                import('@/views/siae/account/register'),
        },
        {
            path: 'forget-pwd',
            name: 'forget-pwd',
            component: () =>
                import('@/views/siae/account/forget-pwd'),
        },
        ]

    }
    ]
}
export default siaeRouter