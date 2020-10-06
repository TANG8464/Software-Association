<template>
<div class="back-main">
    <transition name="component" mode="out-in">
        <router-view />
    </transition>
</div>
</template>

<style>
.component-enter {
    opacity: 0;
    transform: translateX(-50px);
}

.component-leave-to {
    opacity: 0;
    transform: translateX(50px);
}

/* v-enter-active 入场动画时间段 */
/* v-leave-active 离场动画时间段 */

.component-enter-active,
.component-leave-active {
    transition: all 0.3s ease;
}
</style>
