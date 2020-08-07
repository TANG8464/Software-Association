<template>
  <div class="login-change_back">
    <div
      class="changeBackBtn"
      style="position: fixed;right:50px;bottom:30px"
      @click="centerDialogVisible = true"
    >
      <icon name='skin-peeler' scale='25' width='25'></icon>
    </div>
    <el-dialog title="设置背景" v-dialogDrag :visible.sync="centerDialogVisible" center>
      <div style="height:350px;overflow:auto;">
        <div
          class="backSmall"
          v-for="(item,index) in backs"
          :key="index"
          style="width:200px;height:140px;float:left;"
          @click="selectIndex=index"
        >
          <img :src="item" alt style="width:100%;height:100%;" />
          <div style="float:right; position: relative;top:-140px;" v-if="selectIndex==index">
          <icon name='pitch-on' scale='25' width='25'></icon>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setBack(false)">取 消</el-button>
        <el-button type="primary" @click="setBack(true)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    backs: {
      type: Array,
      default: []
    },
    backIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectIndex: 0,
      centerDialogVisible: false
    }
  },
  mounted() {
    this.selectIndex = this.backIndex
  },
  methods: {
    setBack(isSet) {
      this.centerDialogVisible = false
      if (isSet) {
        localStorage.setItem('backIndex', this.selectIndex)
        this.$emit('update:backIndex', this.selectIndex)
      } else {
        this.selectIndex = this.backIndex
      }
    }
  }
}
</script>
<style scoped>
.changeBackBtn {
  padding: 10px 14px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0);
  transition: all 0.5s;
}
.changeBackBtn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.changeBackSvg {
  fill: white;
}
.backSmall {
  margin: 5px;
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
</style>