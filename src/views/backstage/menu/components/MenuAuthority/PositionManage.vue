<template>
  <div class="position-manage">
    <el-divider content-position="left">职位管理</el-divider>
    <!--动画效果-->
    <transition-group
      style="list-style: none"
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
        class="position-menu"
        data-active="职位展示与管理"
        v-for="(item, index) in allPosition"
        :key="index"
        :data-index="index"
      >
        <div style="margin: 0 5px">
          <span>{{ item.positionName }}</span>
          <div style="float: right; padding: 0">
            <span @click="openUpdate(item)">
              <icon name="edit" scale="20" width="20"></icon>
            </span>
            <span @click="delTip(item.id, item.positionName)">
              <icon name="close" scale="20" width="20"></icon>
            </span>
          </div>
        </div>
        <p>{{ item.remark }}</p>
      </li>
    </transition-group>
    <!--添加职位弹出框-->
    <add-position-dialog
      :position.sync="position"
      :isOpen.sync="isOpenAdd"
      :loaded="loaded"
      @addPosition="addPosition"
    ></add-position-dialog>
    <!--修改职位弹出框-->
    <update-position-dialog
      :position.sync="position"
      :isOpen.sync="isOpenUpdate"
      @updatePosition="updatePosition"
    ></update-position-dialog>
  </div>
</template>

<script>
import { getAllPosition, addPosition, updatePosition, deletePosition } from '@/api/member/position'
import UpdatePositionDialog from './UpdatePositionDialog'
import AddPositionDialog from './AddPositionDialog'
export default {
  components: { UpdatePositionDialog, AddPositionDialog },
  data() {
    return {
      allPosition: [], //所有职位
      loaded: false,
      isOpenAdd: false, //是否打开添加职位弹出框
      isOpenUpdate: false, //是否打开修改职位弹出框
      position: {}, //存储添加或修改职位的数据
      formLabelWidth: '120px', //表单文字标签宽度
    }
  },
  created() {
    this.setAllPosition()
  },
  watch: {
    allPosition() {
      this.loaded = true
    },
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
      const res = await getAllPosition()
      if (res.code === 200) {
        this.allPosition = res.data.records
      } else this.$message.error(res.message)
    },
    //添加职位
    async addPosition() {
      const res = await addPosition(this.position)
      if (res.code === 200) {
        this.$message.success('添加成功')
        this.isOpenAdd = false
        this.position = {}
        this.setAllPosition()
      } else this.$message.error(res.message)
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
          this.$message.info('已取消删除')
        })
    },
    //删除职位
    async delPosition(id) {
      const ids = [id]
      const res = await deletePosition(ids)
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.setAllPosition()
      } else this.$message.error(res.message)
    },
    //打开修改职位菜单框
    openUpdate(item) {
      const { id: positionId, positionName, remark } = item
      this.position = { positionId, positionName, remark }
      this.isOpenUpdate = true
    },
    //修改职位
    async updatePosition() {
      this.position.id = this.position.positionId
      const res = await updatePosition(this.position)
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.isOpenUpdate = false
        this.setAllPosition()
      } else this.$message.error(res.message)
    },
  },
}
</script>

<style scoped>
/*
设置position卡片样式
*/
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
