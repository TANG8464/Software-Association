import siae from '@/layouts/SIAE'

const siaeRouter = {
    path: '/siae',
    name: 'siae',
    redirect: '/siae/homePage',
    component: siae,
    children: [{
            path: 'homePage',
            name: 'homePage',
            component: () =>
                import ('@/views/siae/homePage.vue'),
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
                import ('@/views/siae/notice/index.vue'),
        },
        {
            path: 'dataDownload',
            name: 'dataDownload',
            component: () =>
                import ('@/views/siae/dataDownload.vue'),
        },
        {
            path: 'books-borrow',
            name: 'books-borrow',
            component: () =>
                import ('@/views/siae/books-borrow.vue'),
        }
    ]
}
export default siaeRouter