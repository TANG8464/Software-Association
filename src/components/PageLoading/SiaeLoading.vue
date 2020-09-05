<template>
  <div class="siae-loading">
    <div class="loading">
      <span>S</span>
      <span>O</span>
      <span>F</span>
      <span>T</span>
      <span>W</span>
      <span>A</span>
      <span>R</span>
      <span>E</span>
      <span>-</span>
      <span>A</span>
      <span>S</span>
      <span>S</span>
      <span>O</span>
      <span>C</span>
      <span>I</span>
      <span>A</span>
      <span>T</span>
      <span>I</span>
      <span>O</span>
      <span>N</span>
    </div>
  </div>
</template>
<style>
.siae-loading {
  width: 100%;
  height: 100%;
  text-align: center;
}
.loading span {
  width: 200px;
  height: 30px;
  margin: auto auto;
  background-color: white;
  animation: loading 0.5s infinite;
  position: relative;
}
</style>
<style lang="scss">
@for $i from 1 through 20 {
  .loading span:nth-child(#{$i}) {
    animation-delay: $i* 0.1s;
    
  }
}
@keyframes loading {
  0% {
    top: 0;
  }
  50% {
    opacity: 0.3;
    top: 5px;
  }
  100% {
    top: 0;
  }
}
</style>