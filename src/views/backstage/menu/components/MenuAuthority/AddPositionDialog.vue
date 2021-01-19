<template>
  <el-popover
    data-active="添加职位弹出框"
    placement="bottom"
    width="300"
    trigger="click"
    v-model="isOpenAdd"
    @close="positionInfo = {}"
  >
    <!--添加职位表单-->
    <div>
      <p>添加职位</p>
      <el-form :model="positionInfo">
        <el-form-item>
          <el-input
            v-model="positionInfo.positionName"
            autocomplete="off"
            placeholder="职位名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="positionInfo.remark"
            autocomplete="off"
            placeholder="职位描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="float: right">
        <el-button @click="isOpenAdd = false">取 消</el-button>
        <el-button type="primary" @click="addPosition()" @keypress.enter.native="addPosition()"
          >确 定</el-button
        >
      </span>
    </div>
    <!--添加职位按钮-->
    <div slot="reference" class="add-box" ref="addBox">
      <div class="add gradual-change" ref="add">
        <!--添加职位图标-->
      </div>
      <icon name="add" scale="40" width="40"></icon>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    //职位
    position: {
      type: Object,
      require: true,
    },
    //是否打开添加职位
    isOpen: {
      type: Boolean,
      require: true,
    },
    loaded: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      positionInfo: {},
      isOpenAdd: false,
    }
  },
  watch: {
    position(newVal) {
      this.positionInfo = newVal
    },
    positionInfo(newVal) {
      this.$emit('update:position', newVal)
    },
    isOpen(newVal) {
      this.isOpenAdd = newVal
    },
    isOpenAdd(newVal) {
      this.$emit('update:isOpen', newVal)
    },
    loaded(newVal) {
      if (!newVal) return
      const el = this.$refs.addBox
      setTimeout(() => {
        el.style.opacity = 1
        el.style.left = 0
      }, (this.$parent.allPosition.length | 1) * 200)
    },
  },
  methods: {
    addPosition() {
      this.$emit('addPosition')
    },
  },
}
</script>
<style scoped>
/*
设置position卡片样式
*/
.position-manage {
}
.position-menu,
.add-box {
  max-width: 350px;
  width: 100%;
  height: 80px;
  border: 1px solid #fdc6a7;
  border-radius: 10px;
  background-color: #ffefe2;
  margin: 5px;
  float: left;
  text-align: left;
}

.add-box {
  transition: all 1s;
  opacity: 0;
  position: relative;
  left: 80px;
  display: flex;
  align-items: center;
}

.position-menu div,
.position-menu p,
.position-menu small {
  margin: 0;
  padding: 10px;
  color: #fa7528;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.position-menu p {
  width: 100%;
}

.position-menu small {
  display: block;
  text-align: right;
  font-size: 12px;
}

.add {
  transition: 0.2s linear;
  width: 0;
  border-radius: 10px 150px 10px 10px;
  height: 80px;
  background: linear-gradient(to right, #ffb78d, #ffe3cd, #ffb78d);
  overflow: hidden;
  opacity: 0;
}

.add-box:hover .add {
  border-radius: 10px;
  width: 100%;
  opacity: 1;
  background-size: 200% 100%;
  animation: slide 3s forwards linear alternate-reverse infinite;
}

@keyframes slide {
  0% {
    background-size: 200% 100%;
  }

  50% {
    background-size: 100% 100%;
  }

  100% {
    background-size: 200% 100%;
  }
}

.add-box svg {
  position: absolute;
  left: 40%;
}

.add-box {
  color: #fa7528;
}

.add-box:hover {
  color: white;
}
</style>