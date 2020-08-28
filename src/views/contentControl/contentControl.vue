<template>
  <div class="content">
    <!-- 下拉选择 -->
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
    <!-- 更新内容列表 -->
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      class="content-table"
      height="70%"
      :header-cell-style="tableHeaderColor"
      :row-style="tabRowClassName"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ContentName"
        label="内容名称"
        min-width="230"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ContentType"
        label="展项"
        min-width="80"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="UploadDate"
        label="日期"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div
            @click.prevent="onUpdataOne(scope.row.ContentName)"
            class="updata"
          >
            更新
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 更新按钮 -->
    <div class="content-refresh">
      <el-button @click="onUpdateAll" class="refresh-all" plain
        >更新全部</el-button
      >
      <el-button @click="onUpdateSelect" class="refresg-select" plain
        >更新所选</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: '', //下拉框一的值
      value2: '', //下拉框二的值
      tableData: [], //视频详细列表
      tableSaveData: [], //视频详细列表
      companyNameArr: [], //公司名称列表
      exhibNameArr: [{ value2: 0, label: '全部' }], //展项列表
      multipleSelection: [],
      upDateArr: []
    }
  },
  methods: {
    // 多选框发生改变时
    handleSelectionChange(val) {
      this.upDateArr = val
    },
    // 设置table的样式
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #2A2B3D;color: #fff;font-weight: 400;font-size:20px'
      }
    },
    tabRowClassName({ row }) {
      if (row) {
        return {
          backgroundColor: '#313447',
          fontSize: '16px',
          color: '#CECECE',
          borderColor: '#000'
        }
      }
    },
    //更新单个内容
    onUpdataOne(index) {
      this.upDateArr = []
      this.upDateArr.push(index)
      this.updataOperate(this.upDateArr)
    },
    // 获取详细视频信息
    onGetVideoContent(label) {
      let msg = {
        type: 'GetVideoInfoListByComname',
        val: label
      }
      this.socketApi.sendSock(msg, e => {
        this.tableData = e.Content
        this.tableSaveData = e.Content
      })
    },
    // 获取不同公司
    onSeleCompany(val) {
      this.onGetVideoContent(this.companyNameArr[val].label)
    },
    // 不同展项获取
    onSeleType(val) {
      this.tableData = []
      for (let i in this.tableSaveData) {
        if (
          this.tableSaveData[i].ContentType === this.exhibNameArr[val].label
        ) {
          this.tableData.push(this.tableSaveData[i])
        }
      }
      if (this.exhibNameArr[val].label === '全部') {
        this.tableData = this.tableSaveData
      }
    },
    //更新全部
    onUpdateAll() {
      this.upDateArr = []
      this.tableData.map((item, index) => {
        this.upDateArr[index] = item.ContentName
      })
      this.updataOperate(this.upDateArr)
    },
    //更新所选
    onUpdateSelect() {
      let seleArr = []
      this.upDateArr.map((item, index) => {
        seleArr[index] = item.ContentName
      })
      this.updataOperate(seleArr)
    },
    // 更新操作
    updataOperate(val) {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let msg = {
        type: 'ExeDispListCmd',
        val: val
      }
      setTimeout(() => {
        loading.close()
      }, 1500)
      this.socketApi.sendSock(msg, () => {})
    }
  },
  mounted() {
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
}
</script>

<style lang="scss">
.content {
  overflow: hidden;
  &-select {
    display: flex;
    align-items: center;
    width: 100%;
    height: 15%;
    overflow: hidden;
    .select-theme,
    .select-exhb {
      margin-left: 6%;
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
  &-table {
    border-radius: 10px;
    transform: translateX(-50%);
    background: #2a2b3d;
    left: 50%;
    width: 90%;
    .el-table__header-wrapper .el-table__header thead tr {
      background-color: #313447;
    }
  }
  &-refresh {
    height: 14%;
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
.el-table tbody tr:hover > td {
  background-color: #666 !important;
}
.el-table tbody tr {
  td {
    border-color: #313447 !important;
  }
}
.updata {
  color: #e0560c;
  cursor: pointer;
}
//table的部分样式清除
.gutter {
  display: none;
}
.el-table th.is-leaf {
  border: 0;
}
.el-table::before {
  height: 0;
}
</style>
