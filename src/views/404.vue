<template>
  <div class="container">
    <div class="mars"></div>
    <img src="@/assets/404/images/404.svg" class="logo-404">
    <img src="@/assets/404/images/meteor.svg" class="meteor">
    <p class="title">Oh no!!</p>
    <p class="subtitle">
      页面未找到<br>要么请求一个不再在这里的页面。
    </p>
    <div align="center">
      <a class="btn-back cursor-pointer" @click.prevent="$router.push('/')">返回首页</a>
    </div>
    <img src="@/assets/404/images/astronaut.svg" class="astronaut">
    <img src="@/assets/404/images/spaceship.svg" class="spaceship">
  </div>
</template>
<style scoped>
@import "@/assets/404/404.css";
</style>