<template>
  <div class="main">
    <!-- 内容块 -->
    <div class="main-content">
      <!-- 单独每个内容 -->
      <div class="section" v-for="(item, index) in preArr" :key="index">
        <div class="section-img" @click.prevent="onOpenPreset(index)">
          <img :src="item.imgSrc" class="img-icon" />
          <el-popover
            placement="top"
            width="150"
            trigger="click"
            v-model="item.visible"
          >
            <div style="text-align: center">
              <el-link @click="onEditSet(index)">编辑</el-link> |
              <el-link @click="onDelSet(index)">删除</el-link>
            </div>
            <img
              src="../assets/imgs/option.png"
              class="img-set"
              slot="reference"
              @click.stop="item.visible === true"
            />
          </el-popover>
        </div>
        <p class="section-text">{{ item.name }}</p>
      </div>
      <!-- 新增模块 -->
      <div class="add">
        <div class="add-img" @click="onAddBlock">
          <img src="../assets/imgs/add.png" />
        </div>
        <p class="add-p">新增</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      preArr: [], //获取预设数组
      setArr: {
        PresetLabel: '',
        PresetName: '',
        PresetPic: require('../assets/imgs/video.png'),
        PresetLedBelt: '',
        PresetLight: [],
        PresetContents: null,
        PresetVolumes: []
      }
    }
  },
  methods: {
    // 打开预设
    onOpenPreset(index) {
      let msg = {
        type: 'ExePresetCmdByName',
        val: this.preArr[index].name
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.socketApi.sendSock(msg, e => {
        if (e.TypeInfo === 'RespExePresetCmdByName') {
          loading.close()
          // console.log(this.preArr[index].name)
        }
      })
    },
    // 预设的编辑
    onEditSet(index) {
      this.preArr[index].visible = false
      let msg = {
        type: 'GetPresetDataByName',
        val: this.preArr[index].name
      }
      this.socketApi.sendSock(msg, e => {
        e.Content.PresetPicture = require('../assets/imgs/video.png')
        this.$router.push({
          path: '/setOne',
          query: {
            setArr: JSON.stringify(e.Content)
          }
        })
      })
    },
    // 预设的删除
    onDelSet(index) {
      this.preArr[index].visible = false
      let msg = {
        type: 'UpdatePresetDataByName',
        val: this.preArr[index].name
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
      this.socketApi.sendSock(msg, () => {
        console.log(index)
        this.mountedEnter()
      })
    },
    // 添加新的预设
    onAddBlock() {
      this.$router.push({
        path: '/setOne',
        query: {
          setArr: JSON.stringify(this.setArr)
        }
      })
    },
    // 初次进入首页页面
    mountedEnter() {
      let msg = {
        type: 'GetLatestPreName'
      }
      this.socketApi.sendSock(msg, e => {
        for (let i in e.Content) {
          var arr = {}
          arr.name = e.Content[i]
          arr.visible = false
          arr.loading = false
          arr.imgSrc = require('../assets/imgs/video.png')
          this.preArr.push(arr)
        }
      })
    }
  },
  mounted() {
    this.mountedEnter()
  }
}
</script>

<style lang="scss">
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &-content {
    overflow: auto;
    padding: 30px;
    width: 85%;
    height: 80%;
    max-height: 80%;
    background: #242635;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .section {
      margin: 0 15px;
      width: 164px;
      height: 200px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      &-img {
        cursor: pointer;
        width: 160px;
        height: 160px;
        background: #313447;
        border-radius: 15px;
        position: relative;
        .img-icon {
          width: 64px;
          height: 53px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &-text {
        text-align: center;
        color: #fff;
      }
    }
    .add {
      cursor: pointer;
      width: 160px;
      height: 200px;
      display: flex;
      flex-direction: column;
      margin: 0 20px;
      &-img {
        width: 150px;
        height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 3px dashed #fff;
        border-radius: 15px;
        img {
          width: 64px;
          height: 53px;
        }
      }
      &-p {
        text-align: center;
        color: #fff;
      }
    }
  }
  &-content::after {
    content: '';
    width: 160px;
    height: 0;
    display: block;
  }
}
.img-set {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 5px;
}
.el-popover {
  background: #4a4e61 !important;
  border: 0 !important;
  span {
    font-size: 18px;
    color: #e0560c;
  }
}
.el-loading-mask {
  border-radius: 10px;
}
.section-img:active {
  border: 2px solid #e77817;
}
</style>
