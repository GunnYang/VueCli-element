<template>
  <div class="equip">
    <!-- 设备内容块 -->
    <div class="equip-block">
      <!-- 单独一个 -->
      <div
        class="block-content"
        v-for="(item, index) of equipArr"
        :key="index"
        v-loading="item.loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.7)"
      >
        <!-- 上半部分 -->
        <div class="content-main">
          <div class="left-img">
            <img src="../../assets/imgs/equipment.png" />
            <div class="img-text">
              <div class="circle-green" v-show="item.isOnLine"></div>
              <p class="img-on" v-show="item.isOnLine">在线</p>
              <div class="circle-red" v-show="!item.isOnLine"></div>
              <p class="img-off" v-show="!item.isOnLine">离线</p>
            </div>
          </div>
          <div class="right-btn">
            <el-switch
              style="display: block;padding-bottom:30px"
              v-model="item.isOnLine"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="ON"
              inactive-text="OFF"
              @change="onSwitchAction(index, item.isOnLine)"
            >
            </el-switch>
            <el-button
              class="btn-reset"
              :disabled="!item.isOnLine"
              @click="onResetBtn(index)"
              >重启</el-button
            >
          </div>
        </div>
        <p class="content-text">{{ item.name }}</p>
      </div>
    </div>
    <!-- 更新按钮 -->
    <div class="equip-refresh">
      <el-button
        class="refresh-all"
        @click="onSetMachine(1)"
        :disabled="isDisable"
        >全部关机</el-button
      >
      <el-button
        class="refresg-select"
        @click="onSetMachine(2)"
        :disabled="isDisable"
        >全部开机</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      equipArr: [],
      sendOrderArr: [], //发送全部开关机指令数组
      isDisable: false //全局是否存在,正在开关机状态
    }
  },
  methods: {
    // 单个开关按钮
    onSwitchAction(index, val) {
      this.equipArr[index].loading = true
      let arr = {}
      console.log(this.equipArr)
      arr.ContentType = this.equipArr[index].name
      if (val) {
        arr.CtrlCmd = 'cmd:on'
      } else {
        arr.CtrlCmd = 'cmd:off'
      }
      // console.log(arr)
      let msg = {
        type: 'DevPowerCtrl',
        val: arr
      }
      this.socketApi.sendSock(msg, e => {
        console.log(e + '1')
        setTimeout(() => {
          this.equipArr[index].loading = false
        }, 60000)
      })
    },
    // 重启按钮
    onResetBtn(index) {
      this.equipArr[index].loading = true
      let arr = {}
      arr.ContentType = this.equipArr[index].name
      arr.CtrlCmd = 'cmd:reset'
      let msg = {
        type: 'DevPowerCtrl',
        val: arr
      }
      console.log(msg)
      this.socketApi.sendSock(msg, e => {
        console.log(e)
        this.equipArr[index].loading = false
      })
    },
    // 全部开机或者关机
    onSetMachine(index) {
      this.isDisable = true
      if (index == 2) {
        //全部开机
        for (let i in this.equipArr) {
          let arr = {}
          arr.ContentType = this.equipArr[i].name
          arr.CtrlCmd = 'cmd:on'
          this.sendOrderArr.push(arr)
          if (!this.equipArr[i].isOnLine) {
            this.equipArr[i].loading = true
            this.equipArr[i].isOnLine = true
          }
        }
      } else {
        //全部关机
        for (let i in this.equipArr) {
          let arr = {}
          arr.ContentType = this.equipArr[i].name
          arr.CtrlCmd = 'cmd:off'
          this.sendOrderArr.push(arr)
          if (this.equipArr[i].isOnLine) {
            this.equipArr[i].loading = true
            this.equipArr[i].isOnLine = false
          }
        }
      }
      let msg = {
        type: 'DevPowerCtrlList',
        val: this.sendOrderArr
      }
      this.socketApi.sendSock(msg, () => {
        for (let i in this.equipArr) {
          this.equipArr[i].loading = false
        }
        this.isDisable = false
      })
    }
  },
  mounted() {
    let msg = {
      type: 'GetAllAllContenttype',
      val: null
    }
    this.socketApi.sendSock(msg, e => {
      for (let i in e.Content) {
        let arr = {}
        arr.name = e.Content[i]
        arr.isOnLine = false
        arr.loading = false
        this.equipArr.push(arr)
      }
      // console.log(this.equipArr)
    })
  }
}
</script>

<style lang="scss">
.equip {
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
      height: 180px;
      margin: 10px;
      background: #313447;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p {
        color: #fff;
        margin: 10px 0;
        text-align: center;
      }
      .content-main {
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .left-img {
          display: flex;
          flex-direction: column;
          img {
            width: 60px;
            height: 62px;
          }
          .img-text {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .img-on,
            .img-off {
              font-size: 16px;
              text-align: center;
            }
            .img-on {
              color: #64ff6e;
            }
            .img-off {
              color: #ff6464;
            }
            .circle-green,
            .circle-red {
              width: 8px;
              height: 8px;

              border-radius: 50%;
              text-align: center;
              margin-right: 10px;
            }
            .circle-green {
              background: #64ff6e;
            }
            .circle-red {
              background: #ff6464;
            }
          }
        }
        .right-btn {
          padding-left: 15px;
          .el-switch__core {
            width: 50px !important;
          }
          .btn-reset {
            width: 110px;
            height: 40px;
            border-radius: 20px;
            background-color: #313447;
            color: #e0560c;
            border-color: #e0560c;
          }
        }
      }
      .content-text {
        margin: 0 auto;
        margin: 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #cecece;
      }
    }
  }
  &-block::after {
    content: '';
    width: 30%; //这个宽度和子元素宽度一致
    height: 0;
    margin: 10px;
    display: block;
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
// 加载的文字颜色修改
.equip-block .block-content p {
  color: #e0560c;
}
</style>
