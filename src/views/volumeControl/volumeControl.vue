<template>
  <div class="volume">
    <!-- 音量 -->
    <div class="volume-view">
      <div class="view-block" v-for="(item, index) of volumeArr" :key="index">
        <img
          src="../../assets/imgs/soundon.png"
          v-show="item.VolumeValue"
          @click="ontiggerOff(index, item.ContentType, item.VolumeValue)"
        />
        <img src="../../assets/imgs/soundoff.png" v-show="!item.VolumeValue" />
        <p class="volume-name">{{ item.ContentType }}</p>
        <el-slider
          v-model="item.VolumeValue"
          class="block-slider"
          :disabled="!item.VolumeState"
          @change="onChangeVolume(item.VolumeValue, item.ContentType, index)"
        ></el-slider>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <div class="btn-left">
        <el-button class="left-save" @click.native="onSaveDefault"
          >保存为默认值</el-button
        >
        <p>
          <img src="../../assets/imgs/info.png" />
          开机展示默认值音量
        </p>
      </div>
      <div class="btn-right">
        <el-button class="right-default" @click.native="onRestoreDefault"
          >恢复默认</el-button
        >
        <el-button class="right-mute" @click.native="onMuteAll"
          >全部静音</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VolumeState: false,
      volumeArr: [],
      volumeSendArr: [], //恢复默认值的存储发送数组
      volumeSaveArr: []
    }
  },
  methods: {
    // 保存为默认值
    onSaveDefault() {
      let msg = {
        type: 'SaveVolumeCtrlList',
        val: this.volumeArr
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
      this.socketApi.sendSock(msg, () => {})
    },
    //恢复默认值
    onRestoreDefault() {
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
        type: 'GetSavedVolumeCtrlList',
        val: null
      }
      this.socketApi.sendSock(msg, e => {
        this.volumeArr = []
        for (let i in e.Content) {
          var arr = {},
            defaultArr = {}
          defaultArr.ContentType = e.Content[i].ContentType
          defaultArr.VolumeValue = e.Content[i].VolumeValue
          arr.ContentType = e.Content[i].ContentType
          arr.VolumeState = e.Content[i].VolumeState
          arr.VolumeValue = e.Content[i].VolumeValue
          this.volumeSendArr.push(defaultArr)
          this.volumeArr.push(arr)
        }
        // 恢复默认值的时候给系统修改灯光值
        let msg = {
          type: 'SetVolumeCtrlList',
          val: this.volumeSendArr
        }
        this.socketApi.sendSock(msg, () => {})
      })
    },
    //全部静音
    onMuteAll() {
      let flag = []
      for (let i in this.volumeArr) {
        var a = {}
        a.ContentType = this.volumeArr[i].name
        a.VolumeValue = 0
        flag.push(a)
        this.volumeArr[i].VolumeValue = 0
      }
      // const loading = this.$loading({
      //   lock: true,
      //   text: '拼命加载中...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      let msg = {
        type: 'SetVolumeCtrl',
        val: flag
      }
      // setTimeout(() => {
      //   loading.close()
      // }, 1500)
      this.socketApi.sendSock(msg, e => {
        console.log(e)
      })
    },
    // 单个静音静音
    ontiggerOff(index, name, value) {
      if (value !== 0) {
        this.onChangeVolume(0, name, index)
      }
    },
    // 单独改变音量大小
    onChangeVolume(val, name, index) {
      this.volumeArr[index].VolumeValue = val
      let msg = {
        type: 'SetVolumeCtrl',
        val: {
          ContentType: name,
          VolumeValue: val
        }
      }
      this.socketApi.sendSock(msg, () => {})
    }
  },
  mounted() {
    this.onRestoreDefault()
  }
}
</script>

<style lang="scss">
.volume {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2a2b3d;
  padding-top: 30px;
  overflow: hidden;
  &-view {
    overflow: auto;
    padding: 30px;
    width: 85%;
    height: 80%;
    max-height: 80%;
    background: #242635;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    .view-block {
      width: 45%;
      min-width: 45%;
      background: #313447;
      border-radius: 10px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      img {
        width: 42px;
        height: 30px;
        margin-left: 10px;
      }
      p {
        padding: 0 20px;
        color: #fff;
        width: 30%;
        margin: 0 10px;
      }
      .block-slider {
        // width: 160px;
        width: 60%;
        margin-right: 10px;
      }
    }
  }
  &-view::after {
    width: 45%;
    content: '';
    height: 0;
  }
  .btn {
    height: 20%;
    width: 88%;
    display: flex;
    justify-content: space-between;
    &-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .left-save {
        margin-right: 20px;
      }
      p {
        color: #656565;
        font-size: 16px;
        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          margin: 0 5px 3px 0;
        }
      }
    }
    &-right {
      display: flex;
      align-items: center;
      .right-default {
        margin-right: 20px;
      }
    }
  }
}
// 下面按钮样式
.left-save,
.right-default {
  width: 150px;
  border-radius: 28px;
  background-color: #2a2b3d;
  color: #e0560c;
  border-color: #e0560c;
}
.right-mute {
  width: 150px;
  border-radius: 28px;
  background-color: #ff5900;
  color: #ffffff;
  border-color: #e0560c;
}

.volume-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60px;
}
.volume-name:hover {
  width: auto;
}
.el-button.is-disabled {
  background: #000;
}
.el-button.is-disabled:hover {
  background: #000;
}
</style>
