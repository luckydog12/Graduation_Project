<template>
    <div class="temp">
        <div class="link">
            <p>恭喜您注册成功</p>
            <div class="sec">将于{{sec}}秒后自动跳转登录界面，或<router-link to="./login">点击此处跳转</router-link></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        const time =  setInterval(() => {
            this.sec--
            if(this.sec === 0) {
                clearInterval(time)
                this.$router.push('./login')
            }
        }, 1000)
        return {
            sec: 5
        }
    }
}
</script>

<style lang="scss" scoped>
    .temp {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background-image: url("../../image/user/background.jpeg");
      background-size: cover;
      background-repeat: no-repeat;
      .link {
        width: 100%;
        margin: 100px auto;
        color: blue;
        p,.sec{
          text-align: center;
        }
       
      }
    }
</style>