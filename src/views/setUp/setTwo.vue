<template>
  <div class="setOne">
    <!-- 步骤栏 -->
    <div class="setOne-tab">
      <el-button class="tab-back" @click="onBack">上一步</el-button>
      <div class="tab-right">
        <el-button class="tab-next" @click="onNext">下一步</el-button>
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
    <!-- 选择内容 -->
    <div class="setOne-content">
      <div class="content-block">
        <div
          class="block-text"
          v-for="(item, index) of textArr"
          :key="index"
          :class="{ seleCont: isSelect(item.name) }"
          @click="onSeleCont(item.name)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 2,
      textArr: [],
      valArr: [],
      setArr: {} // 步骤一二三传递对象
    }
  },
  methods: {
    onNext() {
      this.$router.push({
        path: '/setThree',
        query: {
          setArr: JSON.stringify(this.setArr)
        }
      })
    },
    onBack() {
      this.$router.push({
        path: '/setOne',
        query: {
          setArr: JSON.stringify(this.setArr)
        }
      })
    },
    isSelect(i) {
      return this.valArr.indexOf(i) == -1 ? false : true
    },
    //选择内容
    onSeleCont(val) {
      this.setArr.PresetLight = []
      if (this.valArr.indexOf(val) == -1) {
        this.valArr.push(val)
      } else {
        this.valArr.splice(this.valArr.indexOf(val), 1)
      }
      this.setArr.PresetLight = this.valArr
    },
    //页面刚进入
    mountedEnter() {
      let msg = {
        type: 'GetLightNamelist',
        val: 'NULL'
      }
      this.socketApi.sendSock(msg, e => {
        // console.log(e)
        for (let i in e.Content) {
          var a = {}
          a.name = e.Content[i]
          this.textArr.push(a)
        }
      })
    }
  },
  mounted() {
    this.mountedEnter()
    // console.log(this.$route.query.setArr)
    this.setArr = JSON.parse(this.$route.query.setArr)
    this.valArr =
      this.setArr.PresetLight === null ? [] : this.setArr.PresetLight
  }
}
</script>

<style lang="scss">
.setOne {
  width: auto;
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
  &-content {
    overflow: auto;
    width: 85%;
    height: 65%;
    max-height: 65%;
    background: #242635;
    border-radius: 10px;
    margin: 0 auto;
    .content-block {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .block-text {
        width: 38%;
        max-width: 38%;
        height: 60px;
        line-height: 60px;
        padding: 3px 30px;
        margin: 10px 15px;
        text-align: center;
        background: #313447;
        border-radius: 10px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .content-block::after {
      content: '';
      height: 0;
      display: block;
      width: 38%;
      padding: 3px 30px;
      margin: 10px 15px;
    }
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
  color: #ffffff;
}
.el-step__title.is-process {
  color: #c0c4cc;
}
// 选中内容样式
.seleCont {
  border: 3px solid #e0560c;
  color: #e0560c !important;
  padding: 0 27px !important;
}
</style>
