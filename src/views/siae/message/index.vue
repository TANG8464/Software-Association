<template>
<div class="siae-message">
    <div class="bg-blur"></div>
    <div class="count">内容</div>
</div>
</template>

<style lang="scss">
.siae-message {
    .bg-blur {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: 0;
        height: 100%;
        width: 100%;
        filter: blur(1px);
        background-color: rgba(32, 32, 32, 0.9);
    }

    .count {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: 0;
        height: 100%;
        width: 100%;
    }
}
</style>
