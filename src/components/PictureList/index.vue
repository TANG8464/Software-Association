<template>
  <div class="picture-list" :key="show">
    <el-row :gutter="24" v-for="(item, index) in allBackground" :key="item.id">
      <!--中等大小时：第一张当行数处于%3余2的情况下为1/2 处于小型大小时：所有状态下列宽都1/2 -->
      <el-col
        :lg="current(index) === 2 ? 12 : 6"
        :md="current(index) === 2 ? 12 : 6"
        :xs="12"
        :sm="12"
      >
        <!-- current(index),当前行数%3的余数,height：当前行数该放大时1/2，否则1/4 -->
        <div class="img-box" :style="{ height: height(current(index) !== 2) }">
          <!-- preview(index, 0)预览，图片未加载出来前的占位符picture-loading -->
          <el-image
            :src="item[0].url"
            style="height: 100%"
            :style="{ opacity: item[0].status ? 1 : 0.7 }"
            :preview-src-list="preview(index, 0)"
            fit="cover"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <!-- 对图片的操作 -->
          <slot name="actions" :item="item[0]"></slot>
        </div>
        <div
          class="img-box"
          :style="{ height: height(current(index) !== 2) }"
          v-if="item.length > 1 && current(index) !== 2"
        >
          <el-image
            :src="item[1].url"
            :preview-src-list="preview(index, 1)"
            fit="cover"
            :style="{ opacity: item[1].status ? 1 : 0.7 }"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <slot
            name="actions"
            :item="item[1]"
            :updateStatus="updateStatus"
            :deleteImg="deleteImg"
          ></slot>
        </div>
      </el-col>
      <!--中等大小时：第二张当行数处于%3余0的情况下为1/2 处于小型大小时：所有状态下列宽都1/2 -->
      <el-col
        v-if="item.length > 2"
        :lg="current(index) === 0 ? 12 : 6"
        :md="current(index) === 0 ? 12 : 6"
        :xs="12"
        :sm="12"
      >
        <div class="img-box" :style="{ height: height(current(index) !== 0) }">
          <!-- 考虑之前可能会有一张图片占两个位置的情况 所以需要判断是否需要为前一项 -->
          <el-image
            :style="{ opacity: item[current(index) === 2 ? 1 : 2].status ? 1 : 0.7 }"
            :src="item[current(index) === 2 ? 1 : 2].url"
            :preview-src-list="preview(index, current(index) === 2 ? 1 : 2)"
            fit="cover"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <slot name="actions" :item="item[current(index) === 2 ? 1 : 2]"></slot>
        </div>
        <div
          class="img-box"
          :style="{ height: height(current(index) !== 0) }"
          v-if="item.length > 3 && current(index) !== 0"
        >
          <el-image
            :style="{ opacity: item[current(index) === 2 ? 2 : 3].status ? 1 : 0.7 }"
            :src="item[current(index) === 2 ? 2 : 3].url"
            :preview-src-list="preview(index, current(index) === 2 ? 2 : 3)"
            fit="cover"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <slot name="actions" :item="item[current(index) === 2 ? 2 : 3]"></slot>
        </div>
      </el-col>
      <!--中等大小时：第二张当行数处于%3余1的情况下为1/2 处于小型大小时：所有状态下列宽都1/2 -->
      <el-col
        v-if="item.length > 4 || (item.length > 3 && current(index) === 0)"
        :lg="current(index) === 1 ? 12 : 6"
        :md="current(index) === 1 ? 12 : 6"
        :xs="12"
        :sm="12"
      >
        <div class="img-box" :style="{ height: height(current(index) !== 1) }">
          <el-image
            :style="{ opacity: item[current(index) === 1 ? 4 : 3].status ? 1 : 0.7 }"
            :src="item[current(index) === 1 ? 4 : 3].url"
            :preview-src-list="preview(index, current(index) === 1 ? 4 : 3)"
            fit="cover"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <slot name="actions" :item="item[current(index) === 1 ? 4 : 3]"></slot>
        </div>
        <div
          class="img-box"
          :style="{ height: height(current(index) !== 1) }"
          v-if="item.length > 4 && current(index) !== 1"
        >
          <el-image
            :src="item[4].url"
            :preview-src-list="preview(4)"
            fit="cover"
            :style="{ opacity: item[4].status ? 1 : 0.7 }"
          >
            <picture-loading slot="placeholder"></picture-loading>
          </el-image>
          <slot name="actions" :item="item[4]"></slot>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PictureLoading from './PictureLoading'
export default {
  components: {
    PictureLoading,
  },
  props: {
    pictures: {
      //当前渲染的图片和即将渲染的图片
      type: Array,
      require: true,
    },
    pictureUrlArr: {
      //所有图片的url
      type: Array,
      require: true,
    },
    col: {
      //需要多少列，暂时还没优化
      type: Number,
      default: 4,
    },
    refresh: {
      //是否刷新
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      allBackground: null, //存储当前渲染的图片
      show: false, //强制重新渲染
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    pictures() {
      //当有加载新的背景图时，重新计算当前渲染的背景图
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.show = !this.show
      let backs = []
      if (!this.allBackground) {
        let index = -1
        this.pictures.forEach((item) => {
          if (index === -1 || backs[index].length >= this.col) backs[++index] = []
          backs[index].push(item)
        })
        this.index = index
      } else {
        const len = this.allBackground.length
        //前面的所有行*列加上最后一行的所有列===当前渲染了多少张图片
        const currentIndex = (len - 1) * this.col + this.allBackground[len - 1].length
        //将图片依次存入backs中
        for (let i = currentIndex; i < this.pictures.length; i++) {
          if (this.index === -1 || backs[this.index].length >= this.col) backs[++this.index] = []
          backs[this.index].push(this.pictures[i])
        }
      }
      this.allBackground = backs
      console.log(backs);
      
    },
    height(flag) {
      return flag || this.size.isSmallSize ? '150px' : '310px'
    },
    current(index) {
      return (index + 3) % 3
    },
    preview(row, col) {
      //预览将当前图片放置第一位，裁剪+拼接
      const index = (row + 1) * (col + 1) - 1
      const front = this.pictureUrlArr.slice(index) //从index至末尾
      const back = this.pictureUrlArr.slice(0, index) //从0至index
      return front.concat(back)
    },
    updateStatus(id, status) {
      this.$emit('updateStatus', id, status)
    },
    deleteImg(name) {
      this.$emit('deleteImg', name)
    },
  },
}
</script>

<style lang="scss">
.picture-list {
  .img-box {
    position: relative;
    margin: 5px;
  }

  .img-box:hover .actions {
    opacity: 1;
  }

  .el-row .el-col {
    padding: 0 !important;
    position: relative;
  }

  .el-image {
    border-radius: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
