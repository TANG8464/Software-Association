<template>
<div class="img-car">
    <el-carousel trigger="click" :interval="4000" style="width:100%" :height="height">
        <el-carousel-item v-for="item in imgCars" :key="item">
            <img :src="item" />
        </el-carousel-item>
    </el-carousel>
</div>
</template>

<script>
export default {
    name: 'imgCar',
    props: {
        imgCars: Array,
        height: {
            type: String,
            require: true,
        },
    },
}
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 400px;
    margin: 0;
}

.img-car {
    box-shadow: 0 0 5px 1px #000000;
}

.img-car img {
    height: 100%;
    width: 100%;
}
</style>
