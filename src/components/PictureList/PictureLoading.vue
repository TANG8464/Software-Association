<template>
<div class="loading">
    <div class="dot-box">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>
</div>
</template>

<style lang="scss">
.loading {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: inline-block;
    background-color: #fafafa;
    margin: 5px;

    .dot-box {
        width: 35px;
        height: 100%;
        margin: auto auto;
        display: flex;
        align-items: center;

        .dot {
            position: relative;
            background-color: rgb(137, 190, 255);
            border-radius: 50%;
            display: inline-block;
            margin: 3px;
            width: 5px;
            height: 5px;
        }
    }
}

@for $i from 1 through 3 {
    .loading .dot:nth-child(#{$i}) {
        animation: loading $i + 0.1s infinite;
    }
}

@keyframes loading {
    0% {
        top: 0;
    }

    50% {
        opacity: 0.3;
        top: 10px;
    }

    100% {
        top: 0;
    }
}
</style>
