<template>
  <div class="setOne">
    <!-- 步骤栏 -->
    <div class="setOne-tab">
      <el-button class="tab-back" @click="onBack">返回</el-button>
      <div class="tab-right">
        <div class="tab-input">
          <span>预设名</span>
          <el-input
            placeholder="请输入预设名"
            v-model="preValue"
            :disabled="this.setArr.PresetLabel === '' ? false : true"
          ></el-input>
        </div>
        <el-button
          class="tab-next"
          @click="onNext"
          :disabled="preValue == '' ? true : false"
          >下一步</el-button
        >
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
      <div class="content-select">
        <el-select
          class="select-theme"
          v-model="value1"
          placeholder="请选择"
          @change="onSeleCompany(value1)"
        >
          <el-option
            v-for="item in companyNameArr"
            :key="item.value1"
            :label="item.label"
            :value="item.value1"
          >
          </el-option>
        </el-select>
        <el-select
          class="select-exhb"
          v-model="value2"
          placeholder="请选择"
          @change="onSeleType(value2)"
        >
          <el-option
            v-for="item in exhibNameArr"
            :key="item.value2"
            :label="item.label"
            :value="item.value2"
          >
          </el-option>
        </el-select>
      </div>
      <div class="content-block">
        <div
          class="block-text"
          v-for="(item, index) of textArr"
          :key="index"
          :class="{ seleCont: isSelect(item.ContentName) }"
          @click="onSeleCont(item.ContentName)"
        >
          {{ item.ContentName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      textArr: [],
      textSaveArr: [],
      preValue: '',
      value1: '',
      value2: '',
      companyNameArr: [],
      exhibNameArr: [{ value2: 0, label: '全部' }],
      valArr: [],
      setArr: {} //设置步骤的存储对象
    }
  },
  methods: {
    // 选中的颜色函数
    isSelect(i) {
      return this.valArr.indexOf(i) == -1 ? false : true
    },
    onNext() {
      this.setArr.PresetName = this.preValue
      this.$router.push({
        path: '/setTwo',
        query: {
          setArr: JSON.stringify(this.setArr)
        }
      })
    },
    onBack() {
      this.$router.push({ path: '/' })
    },
    //选择内容
    onSeleCont(val) {
      this.setArr.PresetContents = []
      if (this.valArr.indexOf(val) == -1) {
        this.valArr.push(val)
      } else {
        this.valArr.splice(this.valArr.indexOf(val), 1)
      }
      this.setArr.PresetContents = this.valArr
      // console.log(this.valArr)
    },
    // 获取不同公司
    onSeleCompany(val) {
      this.onGetVideoContent(this.companyNameArr[val].label)
    },
    // 不同展项获取
    onSeleType(val) {
      this.textArr = []
      for (let i in this.textSaveArr) {
        if (this.textSaveArr[i].ContentType === this.exhibNameArr[val].label) {
          this.textArr.push(this.textSaveArr[i])
        }
      }
      if (this.exhibNameArr[val].label === '全部') {
        this.textArr = this.textSaveArr
      }
    },
    // 获取详细视频信息
    onGetVideoContent(label) {
      let msg = {
        type: 'GetVideoInfoListByComname',
        val: label
      }
      this.socketApi.sendSock(msg, e => {
        this.textArr = e.Content
        this.textSaveArr = e.Content
      })
    },
    //初次进入页面加载
    mountedEnter() {
      let msg = {
        type: 'GetCompNameList',
        val: 'Null'
      }
      // 获取公司名称列表
      this.socketApi.sendSock(msg, e => {
        this.value1 = e.Content[0]
        for (let i in e.Content) {
          var arr = {}
          arr.value1 = i
          arr.label = e.Content[i]
          this.companyNameArr.push(arr)
        }
        let exhib = {
          type: 'GetAllAllContenttype',
          val: 'Null'
        }
        // 获取展项分类列表
        this.socketApi.sendSock(exhib, ex => {
          for (let i in ex.Content) {
            i++
            var Arr = {}
            Arr.value2 = i
            Arr.label = ex.Content[i]
            this.exhibNameArr.push(Arr)
          }
          this.value2 = this.exhibNameArr[0].value2
          this.onGetVideoContent(this.value1)
        })
      })
    }
  },
  mounted() {
    this.mountedEnter()
    this.setArr = JSON.parse(this.$route.query.setArr)
    // console.log(this.setArr)
    this.valArr =
      this.setArr.PresetContents === null ? [] : this.setArr.PresetContents
    this.preValue = this.setArr.PresetName
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
    margin: 0 auto;
    width: 88%;
    height: 15%;
    .tab-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .tab-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
        .el-input__inner {
          background: #313447;
          color: #ffffff;
          width: 250px;
          border-radius: 28px;
        }
        span {
          color: #cecece;
          text-align: center;
          width: 70px;
          padding: 0 5px;
        }
      }
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
    padding: 10px 30px;
    width: 85%;
    height: 60%;
    max-height: 60%;
    background: #242635;
    border-radius: 10px;
    margin: 0 auto;
    .content-select {
      display: flex;
      align-items: center;
      width: 100%;
      height: 15%;
      overflow: hidden;
      .select-theme,
      .select-exhb {
        margin-left: 50px;
        .el-input {
          font-size: 16px;
          input {
            height: 40px;
            color: #cecece;
            border: 1px solid #aaa;
            border-radius: 10px;
            background: #313447;
          }
        }
      }
    }
    .content-block {
      display: flex;
      flex-wrap: wrap;
      // align-items: center;
      justify-content: space-between;
      // width: 100%;
      .block-text {
        width: 38%;
        max-width: 38%;
        height: 60px;
        line-height: 60px;
        padding: 3px 30px;
        margin: 10px 15px;
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
      width: 38%;
      height: 0;
      display: block;
      padding: 0 40px;
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
  border-color: #e0560c;
}
.el-step__title.is-process {
  color: #c0c4cc;
}
.seleCont {
  border: 3px solid #e0560c;
  color: #e0560c !important;
  padding: 0 27px !important;
}
// 禁用颜色
.el-button.is-disabled {
  cursor: not-allowed;
  color: #000;
  background-image: none;
  background-color: #ff5900;
  border-color: #ff5900;
}
</style>
