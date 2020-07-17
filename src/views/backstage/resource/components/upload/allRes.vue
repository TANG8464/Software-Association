<template>
  <div class="resUpload-allRes">
    <!--查询资源的条件-->
    <query-condition
      :searchData="searchData"
      :total="allRes.total"
      @setSearchContent="setSearchContent"
      @search="setAllRes"
      ref="queryCondition"
    ></query-condition>
    <!--所有资源数据-->
    <all-res-data
      :allRes="allRes.records"
      :loading="loading"
      @setAllRes="setAllRes"
      ref="allResData"
    ></all-res-data>
    <!--分页-->
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        :current-page.sync="allRes.current"
        :page-size="allRes.size"
        layout="prev, pager, next, jumper"
        :total="allRes.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import queryCondition from "@/views/backstage/resource/components/upload/allRes/queryCondition.vue";
import allResData from "@/views/backstage/resource/components/upload/allRes/allResData.vue";
export default {
  data() {
    return {
      allRes: [], //所有资源数据
      searchData: {
        //查询条件
        limit: 10,
        resourceName: null, //模糊查询文件名
        resourceCategoryId: null,
        currPage: 1,
        type: "3",
        status: "-1"
      },
      loading: false
    };
  },
  created() {
    this.setAllRes();
  },
  mounted() {
    //当滚动或点击其他地方时不显示MoreMenu
    let allResData = this.$refs.allResData; //所有数据子组件
    let search = this.$refs.queryCondition.$refs.search; //查询条件子组件
    document.body.onclick = function (e) {
      let id = e.target.id;
      allResData.moreOpacity = 0; //将所有数据子组件中的更多菜单透明度设为0
      if (id != "search-icon" && id != "searchInput") search.inputInit(); //当非搜索图标和搜索框点击时，将搜索框隐藏
    };
    window.addEventListener(
      //滚动监听
      "scroll",
      function () {
        allResData.moreOpacity = 0; //将所有数据子组件中的更多菜单透明度设为0
      },
      true
    );
  },
  methods: {
    async setAllRes() {
      //设置所有资源数据
      let _this = this;
      this.loading = true; //开始载入动画
      try {
        let res = await this.$axios.get("/resources/page", {
          params: this.searchData
        });
        if (res.data.code === 200) {
          setTimeout(function () {
            _this.allRes = res.data.data;
            _this.loading = false;
          }, 1000);
          this.searchData.resourceName = "";
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleCurrentChange(val) {//当前页更换时
      console.log(val);
      this.searchData.currPage = val;
      this.setAllRes();
    },
    setSearchContent(val) {//设置搜索内容
      this.searchData.resourceName = val;
      this.setAllRes();
    }
  },
  components: {
    queryCondition,
    allResData
  }
};
</script>
<style>
.el-input {
  margin: 0;
}
.el-pagination {
  padding: 15px 0;
  float: right;
}
</style>