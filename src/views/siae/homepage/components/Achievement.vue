<template>
<div class="achievement">
    <p class="title" :style="{'font-size':+10+size.maxW*0.01+'px'}">
        <icon name="notice" scale="40" :width="25+size.maxW*0.01"></icon>
        <span>主要成就</span>
    </p>
</div>
</template>

<script>
export default {
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
}
</script>
