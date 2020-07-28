import store from '@/store'
const MediumSizeW = 1024;
const SmallSizeW = 992;
const { body } = document

export default {
    beforeMount() {
        this.$_resizeHandler()
        window.addEventListener('resize', this.$_resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_resizeHandler)
    },
    methods: {
        $_resizeHandler() {
            if (!document.hidden) {
                const maxW = window.outerWidth //获取网页外部窗体宽
                const maxH = window.outerHeight //获取网页外部窗体高
                store.commit('setResize', {
                    maxW,
                    maxH,
                    isLandscape: maxH < maxW,
                    isMediumSize: maxW < MediumSizeW && maxW > SmallSizeW,
                    isSmallSize: maxW < SmallSizeW
                })
            }
            // console.log(store.state);
        }
    }
}