<template>
  <div class="allRes-resUpdate">
    <el-dialog
      title="修改信息"
      :visible.sync="isOpen"
      :width="size.isSmallSize?'100%':'40%'"
      @close="close"
    >
      <el-form label-position="left" label-width="80px" :model="res">
        <el-form-item label="资源名称">
          <el-input v-model="res.resourceName"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <upload-cover
            v-if="isOpen"
            @setLogo="setLogo"
            :imageUrl="res.resourceLogo"
            :fileType="fileType"
            ref="cover"
          ></upload-cover>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="res.author"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="res.resourceCategoryID" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in resourceCategory"
              :key="item.id"
              :label="item.resourceCategoryName"
              :value="item.id"
              selected
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="res.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="updateRes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UploadCover from '@/components/UploadResourceCover'
export default {
  components: {
    UploadCover,
  },
  props: {
    update: {
      type: Object,
      default: {},
    },
    isOpenUpdate: {
      type: Boolean,
      default: false,
    },
    fileType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      resourceCategory: [],
      res: {},
      isOpen: false,
    }
  },
  watch: {
    isOpenUpdate(newVal) {
      if (!newVal) {
        this.$refs.cover.visible = false
      }
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenUpdate', newVal)
    },
    update(newVal) {
      this.res = newVal
    },
    res(newVal) {
      this.$emit('update:update', newVal)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.setResSort()
  },
  methods: {
    close() {
      this.$emit('update:update', {})
    },
    setLogo(val) {
      //设置上传资源封面链接
      this.$emit('setLogo', val)
    },
    updateRes() {
      this.$emit('updateRes')
    },
    async setResSort() {
      //设置展示的分类
      try {
        let res = await this.$axios.get('resocategory/page', {
          params: {
            limit: 1000,
          },
        })
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.resourceCategory = res.data.data.records
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
        console.log(err)
      }
    },
  },
}
</script>
<style scoped>
.details-list {
  list-style: none;
  text-align: left;
}
.details-item:nth-child(1) label img {
  display: inline-block;
}
.details-item label,
.details-item span {
  display: inline-block;
  padding: 0 10px;
  line-height: 30px;
}
.details-item label {
  width: 30%;
}
.resImg {
  border-radius: 3px;
}
</style>