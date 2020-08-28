<template>
  <div class="light">
    <!-- 标题 -->
    <h2 class="light-title">投影灯光</h2>
    <!-- 灯光块 -->
    <div class="light-block">
      <!-- 单个灯光 -->
      <div class="block-single" v-for="(item, index) of linghtArr" :key="index">
        <div
          :class="item.isShowLight == true ? 'img_on' : 'img_off'"
          @click="onChangeLight(index)"
        >
          <img
            src="../../assets/imgs/lighton.png"
            v-show="item.isShowLight"
            class="img-showon"
          />
          <img
            src="../../assets/imgs/lightoff.png"
            class="img-showoff"
            v-show="!item.isShowLight"
          />
        </div>
        <p class="single-text">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowLight: false,
      linghtArr: [
        // {
        //   name: '二楼大厅灯光XXaaaaaaaaaaaaaaaaaaaa',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: true
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: true
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // },
        // {
        //   name: '二楼大厅灯光XX',
        //   isShowLight: false
        // }
      ],
      value: '' //开关灯需要传送的值
    }
  },
  methods: {
    onChangeLight(index) {
      this.linghtArr[index].isShowLight = !this.linghtArr[index].isShowLight
      if (this.linghtArr[index].isShowLight) {
        this.value = index + '1'
      } else {
        this.value = index + '0'
      }
      // console.log(this.value)
      let msg = {
        type: 'SetLightCtrl',
        val: this.value
      }
      this.socketApi.sendSock(msg, e => {
        console.log(e)
      })
    }
  },
  mounted() {
    let msg = {
      type: 'GetLightNamelist',
      val: 'NULL'
    }
    this.socketApi.sendSock(msg, e => {
      // console.log(e)
      for (let i in e.Content) {
        var a = {}
        a.name = e.Content[i]
        a.isShowLight = false
        this.linghtArr.push(a)
      }
    })
  }
}
</script>

<style lang="scss">
.light {
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &-title {
    color: #cecece;
    font-size: 24px;
    margin: 20px 6%;
    line-height: 50px;
    height: 5%;
  }
  &-block {
    overflow: auto;
    padding: 30px;
    width: 85%;
    height: 75%;
    max-height: 75%;
    background: #242635;
    border-radius: 10px;
    display: flex;
    margin: 0 auto;
    flex-wrap: wrap;
    align-content: flex-start;
    .block-single {
      width: 120px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 30px;
      .img_on,
      .img_off {
        width: 120px;
        height: 120px;
        background: #313447;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .img-showon {
          width: 51.25px;
          height: 64.89px;
        }
        .img-showoff {
          width: 40.04px;
          height: 55.43px;
        }
      }
      .img_on {
        background: #ff5900;
      }
      .img_off {
        background: #313447;
      }
      p {
        color: #cecece;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        width: 120px;
        height: 60px;
        margin: 0;
        padding-top: 20px;
      }
    }
  }
}
</style>
