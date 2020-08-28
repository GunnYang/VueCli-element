<template>
  <div class="play">
    <!-- 设备内容块 -->
    <div class="play-block">
      <!-- 单独一个 -->
      <div class="block-content" v-for="(item, index) of playArr" :key="index">
        <p class="content-text">{{ item.ContentType }}</p>
        <el-button
          class="content-stop"
          v-show="!item.EnablePause"
          @click="onSwitchPlay(index)"
          >暂停</el-button
        >
        <el-button
          class="content-play"
          v-show="item.EnablePause"
          @click="onSwitchPlay(index)"
          >播放</el-button
        >
      </div>
    </div>
    <!-- 更新按钮 -->
    <div class="play-refresh">
      <el-button class="refresh-all" @click="onSwitchAllPlay(1)"
        >全部暂停</el-button
      >
      <el-button class="refresg-select" @click="onSwitchAllPlay(2)"
        >全部播放</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playArr: [],
      savePlayArr: [] //用来存储全部暂停或者全部播放的列表
    }
  },
  methods: {
    // 单个播放和暂停
    onSwitchPlay(index) {
      var value = {}
      value.ContentType = this.playArr[index].ContentType
      if (this.playArr[index].EnablePause) {
        // true就是播放
        value.CtrlCmd = 'cmd:resume'
      } else {
        value.CtrlCmd = 'cmd:pause'
      }
      console.log(value)
      this.playArr[index].EnablePause = !this.playArr[index].EnablePause
      let msg = {
        type: 'SetDevCtrl',
        val: value
      }
      this.socketApi.sendSock(msg, () => {})
    },
    // 全部暂停和播放
    onSwitchAllPlay(index) {
      this.savePlayArr = []
      // console.log(this.playArr)
      if (index == 1) {
        for (let i in this.playArr) {
          let arr = {}
          arr.ContentType = this.playArr[i].ContentType
          arr.CtrlCmd = 'cmd:pause'
          this.savePlayArr.push(arr)
        }
      } else {
        for (let i in this.playArr) {
          let arr = {}
          arr.ContentType = this.playArr[i].ContentType
          arr.CtrlCmd = 'cmd:resume'
          this.savePlayArr.push(arr)
        }
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
      let msg = {
        type: 'SetDevCtrlList',
        val: this.savePlayArr
      }
      this.socketApi.sendSock(msg, e => {
        console.log(e)
        console.log(1)
        this.mountedEntetr()
      })
    },
    // 页面初始进入的时候
    mountedEntetr() {
      let msg = {
        type: 'GetActiveDevCtrlList',
        val: null
      }
      this.socketApi.sendSock(msg, e => {
        for (let i in e.Content) {
          let arr = {}
          arr.ContentType = e.Content[i].ContentType
          arr.EnablePause = e.Content[i].EnablePause
          this.playArr.push(arr)
        }
        // console.log(this.playArr)
      })
    }
  },
  mounted() {
    this.mountedEntetr()
  }
}
</script>

<style lang="scss">
.play {
  width: auto;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  &-block {
    overflow: auto;
    padding: 30px;
    margin: 0 auto;
    margin-top: 3%;
    width: 85%;
    height: 80%;
    max-height: 80%;
    background: #242635;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .block-content {
      width: 30%;
      min-width: 30%;
      height: 157px;
      margin: 10px;
      background: #313447;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .content-text {
        text-align: center;
        width: 70%;
        margin: 0 auto;
        margin-bottom: 40px;
        color: #cecece;
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  &-refresh {
    height: 15%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .refresh-all {
      width: 180px;
      border-radius: 28px;
      background-color: #2a2b3d;
      color: #e0560c;
      border-color: #e0560c;
      margin-right: 30px;
    }
    .refresg-select {
      width: 180px;
      border-radius: 28px;
      background-color: #ff5900;
      color: #ffffff;
      border-color: #e0560c;
      margin-right: 6%;
    }
  }
}
.content-stop {
  width: 122px;
  border-radius: 28px;
  background-color: #2a2b3d;
  color: #e0560c;
  border-color: #e0560c;
}
.content-play {
  width: 122px;
  border-radius: 28px;
  background-color: #ff5900;
  color: #ffffff;
  border-color: #e0560c;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
