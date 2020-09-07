const oauthRouter = {
    path: '/oauth',
    name: 'oauth',
    component: () =>
        import ('@/views/oauth'),
    children: [{
        path: 'bind/success',
        name: 'bind-success',
        component: () =>
            import ('@/views/oauth/bind/success'),
    }, {
        path: 'bind/error',
        name: 'bind-error',
        component: () =>
            import ('@/views/oauth/bind/error'),
    }, ]

}
export default oauthRouter