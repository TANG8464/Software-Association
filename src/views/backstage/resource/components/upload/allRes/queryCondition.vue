<template>
  <div class="resUpload-allRes_queryCondition">
    <span style="float:left;">共{{total}}个文件</span>
    <!--搜索框-->
    <search-icon @setSearchContent="setSearchContent" ref="search"></search-icon>
    <!--筛选条件框-->
    <el-popover placement="bottom" trigger="click" v-model="isOpenCondition">
      <ul style="list-style:none;">
        <li>
          <span class="condition_title">资源类别：</span>
          <el-select
            v-model="searchData.resourceCategoryId"
            placeholder="请选择"
            size="mini"
            style="width:110px;margin:0 5px;"
          >
            <el-option label="所有" :value="null"></el-option>
            <el-option
              v-for="item in resourceCategory"
              :key="item.id"
              :label="item.resourceCategoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <span class="condition_title">存储类型：</span>
          <el-select
            size="mini"
            v-model="searchData.type"
            placeholder="请选择"
            style="width:110px;margin:0 5px;"
          >
            <el-option label="所有" value="3"></el-option>
            <el-option label="七牛云" value="2"></el-option>
            <el-option label="本地服务器" value="1"></el-option>
          </el-select>
        </li>
        <li>
          <span class="condition_title">资源状态：</span>
          <el-select
            size="mini"
            v-model="searchData.status"
            placeholder="请选择"
            style="width:110px;margin:0 5px;"
          >
            <el-option label="所有" value="-1"></el-option>
            <el-option label="可下载" value="1"></el-option>
            <el-option label="不可下载" value="0"></el-option>
          </el-select>
        </li>
        <li>
          <span class="condition_title">每 页</span>
          <el-select
            size="mini"
            v-model="searchData.limit"
            placeholder="请选择"
            style="width:110px;margin:0 5px;"
          >
            <el-option label="10" value="10"></el-option>
            <el-option label="20" value="20"></el-option>
            <el-option label="50" value="50"></el-option>
          </el-select>
          <span class="condition_title">条</span>
        </li>
        <li>
          <el-button
            type="primary"
            size="mini"
            round
            style="width:100%"
            @click="queryCondition()"
          >开始查询</el-button>
        </li>
      </ul>
      <condition-icon slot="reference"></condition-icon>
    </el-popover>
  </div>
</template>
<script>
import searchIcon from "@/views/backstage/resource/components/upload/allRes/queryCondition/searchIcon.vue";
import conditionIcon from "@/views/backstage/resource/components/upload/allRes/queryCondition/conditionIcon.vue";
export default {
  data() {
    return {
      resourceCategory: [],//分类数据
      isOpenCondition: false//是否打开条件筛选框
    };
  },
  props: {
    searchData: {//查询条件数据
      type: Object,
      default: {}
    },
    total: {//文件总数
      type: Number,
      default: 0
    }
  },
  created() {
    this.setResSort();
  },
  methods: {
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
    },
    //设置搜索框文本值，并查询
    setSearchContent(val) {
      this.$emit("setSearchContent", val);
      this.$emit("search");
    },
    //条件查询
    queryCondition() {
      this.$emit("search");
    }
  },
  components: {
    searchIcon,
    conditionIcon
  }
};
</script>
<style scoped>
/*
给整体加个外边框，让居右
*/
.resUpload-allRes_queryCondition {
  margin: 15px 0;
  text-align: right;
}
</style>
<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.condition_title {
  font-size: 13px;
  color: #666666;
}
.el-popover ul li {
  margin: 8px 0;
}
</style>