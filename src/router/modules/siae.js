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
            path: 'joinIn',
            name: 'joinIn',
            component: () =>
                import ('@/views/siae/joinIn.vue'),
        },
        {
            path: 'notice',
            name: 'notice',
            component: () =>
                import ('@/views/siae/notice'),
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
            path: 'login',
            name: 'login',
            component: () =>
                import ('@/views/siae/login'),

        },
        {
            path: 'message',
            name: "message",
            component: () =>
                import ('@/views/siae/message'),
        }
    ]
}
export default siaeRouter