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
      required: true
    }
  }
}
</script>
<style>
.loading-back {
  text-align: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  background-color: rgba(255, 255, 255, 0.6);
}
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  margin: auto auto;
}
.cir {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  display: inline-block;
  animation: slide 1s infinite;
}
.cir:nth-child(1) {
  animation-delay: 0.1s;
  background: #6cdbfa;
}
.cir:nth-child(2) {
  animation-delay: 0.2s;
  background: #9edaf8;
}
.cir:nth-child(3) {
  animation-delay: 0.3s;
  background: #c4d1e9;
}
.cir:nth-child(4) {
  animation-delay: 0.4s;
  background: #eacfee;
}
.cir:nth-child(5) {
  animation-delay: 0.5s;
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
</style>
