const errorRouter = {
    path: '/error',
    name: 'error',
    component: () =>
        import ('@/views/error-page'),
    children: [{
        path: '401',
        name: 'error-401',
        component: () =>
            import ('@/views/error-page/401'),
    }, {
        path: '404',
        name: 'error-404',
        component: () =>
            import ('@/views/error-page/404'),
    }, ]
}
export default errorRouter