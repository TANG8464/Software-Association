<template>
  <div class="notice-manage">
    <el-row :gutter="24">
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="margin:23px 0;">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
              <el-breadcrumb-item style="font-size:18px;">所有公告</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col style="width:400px;float:right;">
          <router-link to="/backstage/notice/edit" tag="div" class="operationBtn">
            <el-button type="primary" round style="padding:9px 15px;">
              <i class="el-icon-edit"></i>
              写个公告
            </el-button>
          </router-link>
          <el-input
            style="width:240px;float:left;margin:10px 0;"
            v-model="state"
            size="mini"
            placeholder="请输入标题搜索"
          ></el-input>
        </el-col>
      </el-row>
      <div class="badge" v-if="draftBadge!=0">{{draftBadge}}</div>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="已发布" name="0"></el-tab-pane>
            <el-tab-pane label="定时发布" name="2"></el-tab-pane>
            <el-tab-pane label="草稿箱" name="1"></el-tab-pane>
            <newsData ref="newsData" @setDraftBadge="setDraftBadge" :isMedium="isMedium" :isSmall="isSmall"></newsData>
          </el-tabs>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import newsData from "@/views/backstage/notice/components/manage/newsData.vue";
export default {
  data() {
    return {
      draftBadge: 0,
      activeName: "0",
      activeFlag: 0,
      timingFlag: 0,
      allSort: "",
      restaurants: [],
      state: "",
      timeout: null,
      maxH: 0,
      maxW: 0,
      isMedium: false,
      isSmall: false
    };
  },
  created() {
    this.setDraftBadge();
    this.setAllSort();
  },
  mounted() {
    this.maxH = this.$parent.$data.maxH;
    this.maxW = this.$parent.$data.maxW;
    this.init();
  },
  watch: {
    state: function (newVal) {
      this.title = newVal;
      this.setNotice(this.activeFlag);
    },
    activeName: function (newVal) {

    },
    "$parent.$data.maxH": function (newVal) {
      this.maxH = newVal;
    },
    "$parent.$data.maxW": function (newVal) {
      this.maxW = newVal;
      this.init();
    }
  },
  methods: {
    init() {
      if (this.maxW < 800) {
        this.isMedium = false;
        this.isSmall = true;
      } else if (this.maxW < 1000) {
        this.isMedium = true;
        this.isSmall = false;
      } else {
        this.isMedium = false;
        this.isSmall = false;
      }
    },
    setNotice(index) {
      this.$refs.newsData.newsFlag = index;
      this.$refs.newsData.title = this.title;
      this.$refs.newsData.setNotice();
    },
    setAllSort() {
      this.$axios("newscategory/", {
        method: "get"
      }).then(res => {
        this.allSort = res.data.data.records;
      });
    },
    //设置草稿总条数
    async setDraftBadge() {
      try {
        let res = await this.$axios.get('news/', {
          credentials: "include",
          params: {
            newsFlag: 1,
            pageNo: 1,
            title: ""
          }
        })
        console.log(res);
        if (res.data.code === 200) {
          this.draftBadge = res.data.data.total;
          console.log(this.draftBadge);

          if (this.draftBadge > 99) this.draftBadge = "99+";
        } else {
          this.$message.error({
            message: res.data.message
          })
        }
      } catch (err) {
        console.log(err);
      }
    },
    openEdit() {
      this.$parent.openEdit();
    },
    handleClick(tab) {
      console.log(Number(tab.name));
      this.activeFlag = Number(tab.name);
      this.setNotice(this.activeFlag);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) { }
  },

  components: {
    newsData
  }
};
</script>
<style scoped>
.operationBtn {
  float: left;
  margin: 8px;
}
.badge {
  width: 15px;
  height: 15px;
  background-color: #409eff;
  font-size: 12px;
  position: absolute;
  left: 255px;
  border-radius: 50%;
  padding: 3px;
  color: white;
  z-index: 9;
}
</style>

