<template>
<div class="loading-back" v-if="isLoading">
    <div class="loading">
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'loading',
    props: {
        isLoading: {
            type: Boolean,
            required: true,
        },
    },
}
</script>

<style lang="scss">
.loading-back {
    text-align: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    background-color: rgba(255, 255, 255, 0.6);

    .loading {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;
        margin: auto auto;

        .cir {
            border-radius: 100%;
            width: 30px;
            height: 30px;
            display: inline-block;
            animation: slide 1s infinite;
        }

        @for $i from 1 through 5 {
            .cir:nth-child(#{$i}) {
                animation-delay: $i * 0.1s;
            }
        }

        .cir:nth-child(1) {
            background: #6cdbfa;
        }

        .cir:nth-child(2) {
            background: #9edaf8;
        }

        .cir:nth-child(3) {
            background: #c4d1e9;
        }

        .cir:nth-child(4) {
            background: #eacfee;
        }

        .cir:nth-child(5) {
            background: #ffbdda;
        }

        @keyframes slide {
            0% {
                transform: scale(1);
            }

            50% {
                opacity: 0.3;
                transform: scale(2);
            }

            100% {
                transform: scale(1);
            }
        }
    }
}
</style>
