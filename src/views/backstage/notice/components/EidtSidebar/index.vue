<template>
  <div class="edit-sidebar">
    <el-col :span="24">
      <p class="small-title">置顶</p>
      <el-switch style="float:right;" v-model="top" active-color="#409EFF" inactive-color="#e0e0e0"></el-switch>
    </el-col>
    <el-col :span="24" v-if="top">
      <p class="small-title">高级置顶</p>
      <el-switch
        style="float:right;"
        v-model="highTop"
        active-color="#409EFF"
        inactive-color="#e0e0e0"
      ></el-switch>
    </el-col>
    <el-col :span="24">
      <div class="block">
        <p class="small-title">定时发布</p>
        <el-switch
          style="float:right;"
          v-model="operation.isTiming"
          active-color="#409EFF"
          inactive-color="#e0e0e0"
        ></el-switch>
        <div v-if="operation.isTiming">
          <p class="small-title" style="margin: 10px 0;display:inline-block;">发布时间</p>
          <date-time @setDate="setDate" ref="datetime"></date-time>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <p class="small-title">选择分类</p>
      <div id="category" class="overflow selectDiv">
        <el-radio
          v-for="item in categoryData"
          :key="item.id"
          v-model="operation.categoryId"
          :label="item.id"
          style="display:block;"
        >{{item.newsCategoryName}}</el-radio>
      </div>
    </el-col>
    <el-col :span="24">
      <p class="small-title" style=" margin: 10px 0;">文章标签</p>
      <div class="overflow selectDiv">
        <el-tag
          style=" margin: 3px;"
          :key="tag"
          v-for="tag in operation.newsLabels"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
      </div>
      <el-input
        class="input-new-tag"
        style="margin:10px 0;width:100%"
        v-if="inputVisible"
        v-model="newLabel"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
      ></el-input>
      <el-button style v-else class="button-new-tag" size="small" @click="showInput">添加标签(enter键入)</el-button>
    </el-col>
  </div>
</template>

<script>
import DateTime from './DateTime'
export default {
  components: {
    DateTime,
  },
  props: {
    isTiming: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      top: false, //是否置顶
      highTop: false, //是否高级置顶
      //上传给服务端的数据
      operation: {
        isTiming: false,
        top: 0,
        categoryId: '',
        newsLabels: [],
        date: '',
      },
      categoryData: [], //分类数据
      inputVisible: false, //是否展示输入标签框
      newLabel: '', //输入的标签
    }
  },
  watch: {
    'operation.top': function (newVal, oldVal) {
      //重新编辑时会传入top值，监听该值如果有置顶则设置置顶
      if (newVal === 2) {
        this.top = true
        this.highTop = true
      } else if (newVal === 1) {
        this.top = true
        this.highTop = false
      } else {
        this.top = false
        this.highTop = false
      }
    },
    'operation.isTiming': function (newVal, oldVal) {
      this.$emit('update:isTiming', newVal)
    },
    isTiming: function (newVal) {
      this.operation.isTiming = newVal
    },
    top: function (newVal, oldVal) {
      this.setTop(newVal, this.highTop)
    },
    highTop: function (newVal, oldVal) {
      this.setTop(this.top, newVal)
    },
  },
  created() {
    this.setCategoryData()
  },
  methods: {
    setDate(val) {
      this.operation.date = val
    },
    //设置top值
    setTop(top, highTop) {
      if (top && highTop) {
        this.operation.top = 2
      } else if (top) {
        this.operation.top = 1
      } else {
        this.operation.top = 0
      }
    }, //设置分类数据
    async setCategoryData() {
      let res = await this.$axios.get('newscategory/', {
        params: { limit: 1000 },
        credentials: 'include',
      })
      if (res.data.code === 200) {
        this.categoryData = res.data.data.records
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
    //添加标签
    handleClose(tag) {
      this.operation.newsLabels.splice(this.operation.newsLabels.indexOf(tag), 1)
    },
    //展示输入标签框
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //添加标签提示
    handleInputConfirm() {
      let label = this.operation.newsLabels
      if (label.length >= 6) {
        this.$message.error('标签最多只能有六个')
      } else {
        let newLabel = this.newLabel
        if (
          newLabel.includes(',') ||
          newLabel.includes('，') ||
          newLabel.includes(' ') ||
          newLabel.includes(' ')
        ) {
          this.$message.error(`出错啦，标签不能包含逗号和空格`)
        } else if (newLabel.length <= 0 || newLabel.length > 6) {
          this.$message.error('标签必须在1-6个字之间哦~')
        } else if (label.indexOf(newLabel) != -1) {
          this.$message.error('标签重复啦!>__<')
        } else {
          label.push(newLabel)
        }
      }
      this.inputVisible = false
      this.newLabel = ''
    },
  },
}
</script>

<style>
.edit-sidebar .el-col {
  text-align: left;
  padding: 10px 0;
}
.edit-sidebar p {
  display: inline;
}
.edit-sidebar .selectDiv {
  overflow: auto;
  width: 90%;
  height: 130px;
  border: 1px solid #e0e0e0;
  padding: 10px;
}

.edit-sidebar .overflow {
  overflow: hidden;
}

.edit-sidebar .overflow:hover {
  overflow: auto;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.edit-sidebar .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.edit-sidebar .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.edit-sidebar .el-button {
  margin: 10px 0;
  padding: 0 10px;
  box-sizing: content-box;
  width: 90%;
}
.edit-sidebar .small-title {
  font-size: 14px;
  color: #999999;
}
</style>
