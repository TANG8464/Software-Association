<template>
  <div class="notice-edit">
    <el-row :gutter="24">
      <el-row :gutter="24">
        <div style="margin:23px 0;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Backstage/notice' }" style="font-size:18px;">所有公告</el-breadcrumb-item>
            <el-breadcrumb-item style="font-size:18px;">编辑公告</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="18">
          <div style="width:97%;float:right;">
            <el-input style="margin:10px 0;" v-model="news.title" placeholder="标题"></el-input>
            <edit ref="edit"></edit>
            <div style="float:right;margin:10px 0;">
              <el-button v-if="!isTiming&&(!isReEdit||(isReEdit&&flag===1))" @click="putOut(1)">保存草稿</el-button>
              <el-button
                type="primary"
                @click="putOut(0)"
              >{{isReEdit && flag != 1 ? "保存修改" : "发布公告"}}</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align:left;font-weight:bold;">
              <span>操作</span>
            </div>
            <div>
              <sidebar ref="sidebar" @setTiming="setTiming"></sidebar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import edit from "@/views/backstage/notice/components/edit/froalaEdit.vue";
import sidebar from "@/views/backstage/notice/components/edit/sidebar.vue";
export default {
  components: {
    edit,
    sidebar
  },
  data() {
    return {
      adminId: "",
      news: {
        title: "",
        content: ""
      },
      operation: {
        top: 0,
        newsCategoryId: "",
        newsLabels: []
      },
      isTiming: false,
      isReEdit: false,
      flag: 0
    };
  },
  created() {
    this.adminId = this.$cookies.get("activeUser").split("&")[0];
    let id = this.$route.query.id;
    if (id) {
      this.isReEdit = true;
      this.setPage(id);
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event;
      if (e) {
        e.retrunValue = "关闭提示";
      }
      return "关闭提示";
    };
  },
  methods: {
    async putOut(flag) {
      //数据
      this.news.content = this.$refs.edit.content;
      this.operation = this.$refs.sidebar.operation;
      let flagData = flag;
      let publishTime = null;
      if (this.operation.isTiming) {
        let timeDifference = new Date(this.operation.date).getTime() - new Date().getTime();
        console.log(timeDifference);

        if (timeDifference < 0) {
          this.uploadNotice(flag, null);
        } else if (timeDifference < 5 * 60 * 1000) {
          this.$confirm('定时发布时间过于接近当前时间是否立即发布', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.uploadNotice(flag, null);
          }).catch(() => {
            this.uploadNotice(2, this.operation.date);
          });
        } else {
          this.uploadNotice(2, this.operation.date);
        }
      } else {
        this.uploadNotice(flag, null);
      }

    },
    async uploadNotice(flagData, publishTime) {//判断是修改还是发布
      let method = "post";
      let data = {
        adminId: this.adminId,
        categoryId: this.operation.newsCategoryId,
        content: this.news.content,
        flag: flagData,
        newsLabel: this.operation.newsLabels.join(","),
        title: this.news.title,
        top: this.operation.top,
        publishTime: publishTime
      };
      if (this.isReEdit) {
        method = "put";
        data.newsId = this.$route.query.id;
      }
      try {
        let res = await this.$axios("news/", {
          method: method,
          data: data
        });
        if (res.status === 200) {
          if (res.data.code === 200) {
            let msg = "";
            if (this.isReEdit) {
              msg = "修改成功"
            } else if (flagData == 1) msg = "保存成功";
            else msg = "发布成功";
            this.$message.success(msg);
            this.$router.push("/backstage/notice/manager");
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        this.$message.error({
          message: err
        });
      }

    },
    async setPage(id) {
      try {
        let res = await this.$axios.get("news/" + id);
        if (res.data.code === 200) {
          this.flag = res.data.data.flag;
          this.news.title = res.data.data.title;
          this.$refs.edit.resetValue(res.data.data.content);
          let operation = {
            top: res.data.data.top,
            isTiming: res.data.data.flag === 2,
            date: res.data.data.publishTime,
            newsCategoryId: res.data.data.newsCategory.id,
            newsLabels: res.data.data.newsLabel.split(",")
          };
          this.$refs.sidebar.operation = operation;
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
    },
    setTiming(val) {
      console.log(val);
      this.isTiming = val;
    }
  },


};
</script>

