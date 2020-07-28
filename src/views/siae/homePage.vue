<template>
    <imgCar :imgCars="imgCars"></imgCar>
</template>
<script>
import imgCar from '@/components/siae/ImageCarousel'
export default {
    name:'HomePage',
   data(){
        return{
           imgCars:[
               require('@/assets/img/imgCar/1000285.jpg'),
               require('@/assets/img/imgCar/1001251.jpg'),
               require('@/assets/img/imgCar/1001777.jpg'),
               require('@/assets/img/imgCar/1001917.jpg'),
               require('@/assets/img/imgCar/2000411.jpg')
            ]
        }
    },
    components:{
        imgCar
    }
}
</script>