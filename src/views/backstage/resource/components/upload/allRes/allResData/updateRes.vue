<template>
  <div class="allRes-resUpdate">
    <el-form label-position="left" label-width="80px" :model="update">
      <el-form-item label="资源名称">
        <el-input v-model="update.resourceName"></el-input>
      </el-form-item>
      <el-form-item label="封面">
        <upload-cover
          @setLogo="setLogo"
          :imageUrl="update.resourceLogo"
          :isOpenSelectable="isOpenUpdate"
          ref="cover"
          :fileType="fileType"
        ></upload-cover>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="update.author"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="update.resourceCategoryID" placeholder="请选择" style="width:100%">
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
        <el-input v-model="update.description"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import uploadCover from "@/views/backstage/resource/components/upload/information/uploadCover.vue";
export default {
  components: {
    uploadCover
  },
  props: {
    update: {
      type: Object,
      default: {}
    },
    isOpenUpdate: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      resourceCategory: []
    };
  },
  watch: {
    isOpenUpdate(newVal) {
      if (!newVal) {
        this.$refs.cover.visible = false;
      }
    }
  },
  created() {
    this.setResSort();
  },
  methods: {
    setLogo(val) {
      //设置上传资源封面链接
      this.$emit('setLogo',val);
    },
    async setResSort() {
      //设置展示的分类
      try {
        let res = await this.$axios.get("resocategory/page", {
          params: {
            limit: 1000
          }
        });
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.resourceCategory = res.data.data.records;
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },

};
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