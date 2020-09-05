<template>
  <div class="book-list" style="min-height:500px">
    <transition-group
      name="staggered-fade"
      tag="div"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
    >
      <el-row :key="cut" :data-index="1" :gutter="24" class="book" style="margin:0;overflow:auto;">
        <el-col
          class="book-item"
          :lg="5"
          :sm="8"
          :xs="12"
          v-for="(item,index) in books"
          :key="index"
        >
          <div class="book-cover_box">
            <div class="page">
              <div class="page-front">
                <img class="book-cover" :src="item.imageUrl" alt />
              </div>
              <div class="page-back" @click="backClick(item)">
                <div v-if="item.flag===0||item.isNotReturn">
                  <div v-if="item.isNotReturn">
                    <el-button round size="small" style="width:100px">还书</el-button>
                  </div>
                  <div v-else style="font-size:14px">
                    <p style="margin:5px 0">作者:{{item.author}}</p>
                    <p style="margin:5px 0">库存:{{item.count}}</p>
                    <el-button round size="small" style="width:100px">借书</el-button>
                  </div>
                </div>
                <div v-else>{{item.tagLabel}}</div>
              </div>
            </div>
          </div>
          <div style="margin:5px">
            <p class="bookName" style="margin:0 3px">
              <el-tag size="mini" :type="item.tagType" effect="plain">{{ item.tagLabel }}</el-tag>
              <el-tooltip class="item" effect="dark" :content="item.bookName" placement="bottom">
                <span>{{item.bookName}}</span>
              </el-tooltip>
            </p>
          </div>
        </el-col>
      </el-row>
      <div :key="cut+1" :data-index="2" v-if="books&&books.length===0" class="null">
        <icon name="null" scale="50" width="50"></icon>
        <span>什么也没有</span>
      </div>
    </transition-group>
  </div>
</template>
<script>
export default {
  props: {
    books: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      cut: 1,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    books() {
      this.cut++
    },
  },
  methods: {
    //动态效果初始样式
    beforeEnter: function (el) {
      //展示与管理职位动画效果开始前
      //设置每个元素样式
      el.style.opacity = 0 //透明度为0
      el.style.position = 'relative' //设置以本来位置
      el.style.top = '500px' //往做偏差50px
    },
    //动态效果进入动画
    enter: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 1, top: 0 }, { complete: done })
      }, delay)
    },
    //动态效果离开动画
    leave: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 0, top: '-500px' }, { complete: done })
      }, delay)
    },
    backClick({ flag, id, isNotReturn, tagLabel }) {
      if (isNotReturn) {
        this.$message({
          message: '还书需要联系管理员哦~',
          customClass: 'siae-msg',
        })
      } else if (flag === 0) {
        this.$emit('backClick', id)
      } else {
        this.$message.error(`书籍${tagLabel}`)
      }
    },
  },
}
</script>
<style>
.book-list .book-item {
  display: inline;
  margin: 10px 20px;
}
.book-list .book-cover {
  width: 100%;
  height: 100%;
}
.book-cover_box {
  min-width: 150px;
  min-height: 200px;
}
.page {
  transition: all 1s;
  box-shadow: 0px 0px 10px 1px #999999;
  width: 150px;
  height: 200px;
  position: absolute;
  transform-style: preserve-3d;
}
.page:hover,
.page:focus {
  transform: rotateY(-180deg);
}
.page-back {
  cursor: pointer;
  color: rgba(41, 42, 52, 0.82);
  font-size: 25px;
}
.page-back div {
  text-align: center;
  width: 100%;
}
.page-front {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 1s;
}
.page:hover .page-back {
  z-index: 2;
}
.page-back {
  width: 100%;
  height: 100%;
  background-color: white;
  transition: all 0.5s;
  position: absolute;
  transform: rotateY(-180deg);
  display: flex;
  align-items: center;
}
.page-back:active {
  background-image: radial-gradient(circle, transparent 10%, #fff 10%);
  background-color: rgb(168, 168, 168);
  transition: 0s;
}
.book-list .null {
  text-align: center;
  line-height: 500px;
  color: #666666;
  transition: all 0.5s;
}
.book-list .bookName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>