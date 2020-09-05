<template>
  <div class="manage">
    <el-divider content-position="left">职位管理</el-divider>
    <!--动画效果-->
    <transition-group
      style="list-style:none"
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      data-active="动画效果"
    >
      <!--职位展示与管理-->
      <li
        class="positionMenu"
        data-active="职位展示与管理"
        v-for="(item,index) in allPosition"
        :key="index"
        :data-index="index"
      >
        <div style="margin:0 5px;">
          <span>{{item.positionName}}</span>
          <div style="float:right;padding:0;">
            <span @click="openUpdate(item)">
              <icon name="edit" scale="20" width="20"></icon>
            </span>
            <span @click="delTip(item.id,item.positionName)">
              <icon name="close" scale="20" width="20"></icon>
            </span>
          </div>
        </div>
        <p>{{item.remark}}</p>
      </li>
    </transition-group>
    <!--添加职位弹出框-->
    <el-popover
      data-active="添加职位弹出框"
      placement="bottom"
      width="300"
      trigger="click"
      v-model="isOpenAdd"
      @close="position={}"
    >
      <!--添加职位表单-->
      <div>
        <p>添加职位</p>
        <el-form :model="position">
          <el-form-item>
            <el-input v-model="position.positionName" autocomplete="off" placeholder="职位名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="position.remark" autocomplete="off" placeholder="职位描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="float:right;">
          <el-button @click="isOpenAdd = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addPosition()"
            @keypress.enter.native="addPosition()"
          >确 定</el-button>
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
    <!--修改职位弹出框-->
    <el-dialog title="修改职位" :visible.sync="isopenUpdate" width="25%" @close="position={}">
      <el-form :model="position">
        <el-form-item>
          <el-input v-model="position.positionId" autocomplete="off" placeholder="职位ID" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="position.positionName" autocomplete="off" placeholder="职位名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip :disabled="true" content="点击关闭 tooltip 功能" placement="bottom" effect="light">
            <el-input v-model="position.remark" autocomplete="off" placeholder="职位描述"></el-input>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isopenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updatePosition()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allPosition: [], //所有职位
      isOpenAdd: false, //是否打开添加职位弹出框
      isopenUpdate: false, //是否打开修改职位弹出框
      position: {}, //存储添加或修改职位的数据
      formLabelWidth: '120px', //表单文字标签宽度
    }
  },
  created() {
    this.setAllPosition()
  },
  mounted() {},
  allPosition: function (newVal) {
    //监听获取到所有元素之后动态展示添加按钮
  },
  methods: {
    //动态效果初始样式
    beforeEnter: function (el) {
      //展示与管理职位动画效果开始前
      //设置每个元素样式
      el.style.opacity = 0 //透明度为0
      el.style.position = 'relative' //设置以本来位置
      el.style.left = '80px' //往做偏差50px
    },
    //动态效果进入动画
    enter: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 1, left: 0 }, { complete: done })
      }, delay)
    },
    //动态效果离开动画
    leave: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 0, left: '50px' }, { complete: done })
      }, delay)
    },
    async setAllPosition() {
      try {
        let res = await this.$axios.get('member/position/page')
        if (res.data.code === 200) {
          this.allPosition = res.data.data.records
          let el = this.$refs.addBox
          setTimeout(() => {
            el.style.opacity = 1
            el.style.left = 0
          }, this.allPosition.length * 200)
        } else {
          this.$message.error({
            message: res.data.message,
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    //添加职位
    async addPosition() {
      try {
        let res = await this.$axios.post('member/position/', this.position)
        if (res.data.code === 200) {
          this.$message.success({
            message: '添加成功',
          })
          this.isOpenAdd = false
          this.position = {}
          this.setAllPosition()
        } else {
          this.$message.error({
            message: res.data.message,
          })
        }
      } catch (err) {
        this.$message.error({
          message: err,
        })
      }
    },
    //删除职位提示
    delTip(id, name) {
      this.$confirm(`此操作将永久删除"${name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delPosition(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //删除职位
    async delPosition(id) {
      try {
        let ids = []
        ids.push(id)
        let res = await this.$axios.delete('member/position/', {
          data: ids,
        })
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: '删除成功',
            })
            this.setAllPosition()
          } else {
            this.$message.error({
              message: res.data.message,
            })
          }
        } else {
          this.$message.error({
            message: '请求错误',
          })
        }
      } catch (err) {
        this.$message.error({
          message: err,
        })
      }
    },
    //打开修改职位菜单框
    openUpdate(item) {
      let position = item
      this.position = {
        id: position.id,
        positionName: position.positionName,
        remark: position.remark,
      }
      this.isopenUpdate = true
    },
    //修改职位
    async updatePosition() {
      try {
        let res = await this.$axios.put('member/position/', this.position)
        if (res.data.code === 200) {
          this.$message.success({
            message: '修改成功',
          })
          this.isopenUpdate = false
          this.setAllPosition()
        } else {
          this.$message.error({
            message: res.data.message,
          })
        }
      } catch (err) {
        this.$message.error({
          message: err,
        })
      }
    },
  },
}
</script>
<style scoped>
/*
设置position卡片样式
*/
.positionMenu,
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
.positionMenu div,
.positionMenu p,
.positionMenu small {
  margin: 0;
  padding: 10px;
  color: #fa7528;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.positionMenu p {
  width: 100%;
}
.positionMenu small {
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