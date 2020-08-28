<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <section class="section">
      <!-- 左边tabber -->
      <div width="248px" class="index-aside">
        <div class="index-aside_logo">
          <img src="./assets/imgs/logo.png" alt="logo" />
          <span>智能中控</span>
        </div>
        <div class="index-aside_content">
          <router-link
            to="/"
            :class="{
              on:
                isCurrent('/') ||
                isCurrent('/setOne') ||
                isCurrent('/setTwo') ||
                isCurrent('/setThree')
            }"
          >
            <img
              src="./assets/imgs/custom.png"
              class="btn_img btn_img-yushe "
            />
            <!-- <img
              src="./assets/imgs/custom_active.png"
              class="btn_img btn_img-yushe "
            /> -->
            <span class="btn_text">自定义预设</span>
          </router-link>

          <router-link
            to="/contentControl"
            :class="{ on: isCurrent('/contentControl') }"
          >
            <img
              src="./assets/imgs/video.png"
              class="btn_img btn_img-neirong"
            />
            <span class="btn_text">内容控制</span>
          </router-link>

          <router-link
            to="/volumeControl"
            :class="{ on: isCurrent('/volumeControl') }"
          >
            <img
              src="./assets/imgs/volume.png"
              class="btn_img btn_img-yinliang"
            />
            <span class="btn_text">音量控制</span>
          </router-link>

          <router-link
            to="/envirControl"
            :class="{ on: isCurrent('/envirControl') }"
          >
            <img
              src="./assets/imgs/environment.png"
              class="btn_img btn_img-huanjing"
            />
            <span class="btn_text">环境控制</span>
          </router-link>

          <router-link
            to="/equipControl"
            :class="{ on: isCurrent('/equipControl') }"
          >
            <img
              src="./assets/imgs/hardware.png"
              class="btn_img btn_img-shebei"
            />
            <span class="btn_text">设备控制</span>
          </router-link>

          <router-link
            to="/playbackControl"
            :class="{ on: isCurrent('/playbackControl') }"
          >
            <img src="./assets/imgs/play.png" class="btn_img btn_img-bofang" />
            <span class="btn_text">播放控制</span>
          </router-link>
        </div>
      </div>
      <!-- 右边内容 -->
      <section class="section-right">
        <header>
          <div class="refresh">
            <img class="refresh-img" src="./assets/imgs/pic.png" />
            <span>刷新</span>
          </div>
          <!-- <div class="account">
            <i class="el-icon-s-custom"></i>
            <span>账号</span>
          </div> -->
        </header>
        <router-view class="view" />
      </section>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAction: true
    }
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    isCurrent(path) {
      return this.$route.path === path
    }
  },
  watch: {}
}
</script>

<style lang="scss">
#app {
  min-width: 700px;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
}
.section {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.index-aside {
  display: flex;
  flex-direction: column;
  background: #242635;
  &_logo {
    width: 248px;
    height: 90px;
    text-align: center;
    img {
      width: 35px;
      height: 35px;
      vertical-align: middle;
      padding-bottom: 10px;
    }
    span {
      margin-left: 10px;
      font-size: 28px;
      line-height: 90px;
      color: rgba(224, 86, 12, 1);
    }
  }
  &_content {
    flex: 1;
    overflow: auto;
    a {
      display: block;
      text-decoration: none;
      height: 96px;
      padding-left: 36px;
      line-height: 96px;
      .btn_text {
        color: #cecece;
        font-size: 24px;
      }
      .btn_img {
        vertical-align: middle;
        padding-right: 20px;
        padding-bottom: 5px;
      }
      .btn_img-yushe {
        width: 32px;
        height: 32px;
      }
      .btn_img-neirong {
        width: 32px;
        height: 26.87px;
      }
      .btn_img-yinliang {
        width: 32px;
        height: 29.22px;
      }
      .btn_img-huanjing {
        width: 26.68px;
        height: 35.58px;
      }
      .btn_img-shebei {
        width: 32px;
        height: 32px;
      }
      .btn_img-bofang {
        width: 32.33px;
        height: 32.2px;
      }
    }
  }
}
.section-right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
header {
  background: #313447;
  height: 90px;
  display: flex;
  justify-content: flex-end;
  .refresh,
  .account {
    margin-right: 20px;
    line-height: 90px;
    cursor: pointer;
    color: #fff;
    &-img {
      padding: 0;
      width: 26.75px;
      height: 23.1px;
      vertical-align: middle;
      margin: -7px 7px 0 0;
      background: url(./assets/imgs/refresh.png) no-repeat;
      background-size: 26.75px 23.1px;
      border: none;
      border-style: none;
    }
    span {
      font-size: 24px;
    }
    i {
      font-size: 24px;
      margin-right: 7px;
    }
  }
  .refresh:active,
  .account:active {
    color: #e0560c;
    img {
      background: url(./assets/imgs/refresh_active.png) no-repeat;
      background-size: 26.75px 23.1px;
      width: 26.75px;
      height: 23.1px;
      border: none;
      border-style: none;
    }
  }
}
.on {
  padding-left: 30px !important;
  border-left: 6px solid #e0560c;
  background: linear-gradient(
    88deg,
    rgba(49, 52, 71, 1) 0%,
    rgba(80, 81, 90, 0) 100%
  );
  .btn_text {
    color: #ffffff !important;
  }
}
.view {
  flex: 1;
  background: #2a2b3d;
}
</style>
