<template>
  <div class="setOne">
    <!-- 步骤栏 -->
    <div class="setOne-tab">
      <el-button class="tab-back" @click="onBack">上一步</el-button>
      <div class="tab-right">
        <el-button class="tab-next" @click="onSave">保存</el-button>
      </div>
    </div>
    <!-- 步骤条 -->
    <div class="setOne-step">
      <el-steps :active="active" finish-status="success">
        <el-step title="选择内容"></el-step>
        <el-step title="选择灯光"></el-step>
        <el-step title="选择音量"></el-step>
      </el-steps>
    </div>
    <!-- 音量选择块 -->
    <div class="volume-view">
      <div class="view-block" v-for="(item, index) of volumeArr" :key="index">
        <img
          src="../../assets/imgs/soundon.png"
          v-show="item.VolumeValue"
          @click="ontiggerOff(index)"
        />
        <img src="../../assets/imgs/soundoff.png" v-show="!item.VolumeValue" />
        <p class="volume-name">{{ item.ContentType }}</p>
        <el-slider
          v-model="item.VolumeValue"
          class="block-slider"
          :disabled="!item.VolumeState"
          @change="onChangeSlider"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 3,
      volumeArr: [],
      setArr: {} // 步骤全局数组
    }
  },
  methods: {
    onBack() {
      this.$router.push({
        path: '/setTwo',
        query: {
          setArr: JSON.stringify(this.setArr)
        }
      })
    },
    onSave() {
      var flag = true
      if (this.setArr.PresetLabel === '') {
        this.setArr.PresetLabel = '参展'
        flag = false
      }
      let msg = {
        type: flag ? 'UpdatePresetDataByName' : 'AddNewPresetData',
        val: this.setArr
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.socketApi.sendSock(msg, () => {
        setTimeout(() => {
          loading.close()
        }, 1000)
        this.$router.push('/')
      })
    },
    ontiggerOff(index) {
      this.volumeArr[index].VolumeValue = 0
    },
    //改变音量滑块
    onChangeSlider() {
      this.setArr.PresetVolumes = this.volumeArr
      // console.log(this.setArr)
    },
    // 初次进入步骤三页面
    mountedEnter() {
      let msg = {
        type: 'GetSavedVolumeCtrlList',
        val: null
      }
      this.socketApi.sendSock(msg, e => {
        this.volumeArr = []
        for (let i in e.Content) {
          var arr = {}
          arr.ContentType = e.Content[i].ContentType
          arr.VolumeState = e.Content[i].VolumeState
          arr.VolumeValue = 0
          this.volumeArr.push(arr)
        }
        // console.log(this.volumeArr)
        // 恢复默认值的时候给系统修改灯光值
        let msg = {
          type: 'SetVolumeCtrlList',
          val: this.volumeSendArr
        }
        this.socketApi.sendSock(msg, () => {})
      })
    }
  },
  mounted() {
    this.mountedEnter()
    // console.log(this.$route.query.setArr)
    this.setArr = JSON.parse(this.$route.query.setArr)
  }
}
</script>

<style lang="scss">
.setOne {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &-tab {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 88%;
    height: 15%;
    margin: 0 auto;
    .tab-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  &-step {
    width: 90%;
    margin: 20px auto;
    height: 10%;
    .el-step__head.is-success {
      color: #e0560c;
      border-color: #e0560c;
    }
    .el-step__title.is-success {
      color: #e0560c;
    }
  }
  .volume-view {
    overflow: auto;
    padding: 30px;
    width: 85%;
    height: 55%;
    max-height: 55%;
    margin: 0 auto;
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
  .volume-view::after {
    width: 45%;
    content: '';
    height: 0;
  }
}
.tab-back {
  width: 180px;
  border-radius: 28px;
  background-color: #2a2b3d;
  color: #e0560c;
  border-color: #e0560c;
}
.tab-next {
  width: 180px;
  border-radius: 28px;
  background-color: #ff5900;
  border-color: #e0560c;
  color: #ffffff;
}
// 音量文字的提示
.volume-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60px;
}
.volume-name:hover {
  width: auto;
}
.el-step__title.is-process {
  color: #c0c4cc;
}
</style>
