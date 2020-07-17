<template>
  <div class="notice-sort">
    <div style="margin:23px 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
        <el-breadcrumb-item style="font-size:18px;">公告分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="24">
      <el-col :span="24">
        <ul style="margin:0 16px;">
          <li style="width:95%;padding:0;color: #606266;">
            <el-row :gutter="24">
              <el-col :span="3">
                <p>
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    :checked="isCheckAll"
                    @change="checkAll"
                    style="font-weight: 600;font-size:23px"
                  >全选</el-checkbox>
                </p>
              </el-col>
              <el-col :span="7">
                <h5>名称</h5>
              </el-col>
              <el-col :span="8" v-if="!isVertical">
                <h5>描述</h5>
              </el-col>
              <el-col :span="lastSpan" style="text-align:right;">
                <el-button
                  style="margin:10px 0;height:30px;padding:0;width:50%;"
                  type="danger"
                  round
                  @click="$refs.sortData.delTip()"
                >
                  <svg
                    t="1592462817830"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="3778"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M926.1 631.2c-19.3 0-35 15.7-35 35v66.7H253.6V130.8h127c19.3 0 35-15.7 35-35s-15.7-35-35-35h-162c-19.3 0-35 15.7-35 35v125.3H96.1c-19.3 0-35 15.7-35 35v672.1c0 19.3 15.7 35 35 35h707.5c19.3 0 35-15.7 35-35V802.9h87.5c19.3 0 35-15.7 35-35V666.2c0-19.3-15.7-35-35-35z m-157.5 262H131.1V291.1h52.5v476.8c0 19.3 15.7 35 35 35h550v90.3z"
                      p-id="3779"
                      fill="#ffffff"
                    />
                    <path
                      d="M473.8 249.3c-19.3 0-35 15.7-35 35v309.5c0 19.3 15.7 35 35 35h389.3c19.3 0 35-15.7 35-35V284.3c0-19.3-15.7-35-35-35s-35 15.7-35 35v274.5H508.8V284.3c0-19.3-15.7-35-35-35zM409 156.7c-19.3 0-35 15.7-35 35s15.7 35 35 35h255.9c0.6 0 1.3 0.1 1.9 0.1s1.3 0 1.9-0.1h259.2c19.3 0 35-15.7 35-35s-15.7-35-35-35H701.8v-50c0-19.3-15.7-35-35-35s-35 15.7-35 35v50H409z"
                      p-id="3780"
                      fill="#ffffff"
                    />
                    <path
                      d="M633.6 420.7V284.3c0-19.3-15.7-35-35-35s-35 15.7-35 35v136.4c0 19.3 15.7 35 35 35s35-15.7 35-35zM773.3 420.7V284.3c0-19.3-15.7-35-35-35s-35 15.7-35 35v136.4c0 19.3 15.7 35 35 35s35-15.7 35-35z"
                      p-id="3781"
                      fill="#ffffff"
                    />
                  </svg>
                  <span style="position:relative;top:-4px;">({{delsLen}})</span>
                </el-button>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div id="sortArr">
          <sort-data
            ref="sortData"
            @setAllSort="setAllSort"
            @setDels="setDels"
            @setIsCheckAll="setIsCheckAll"
            @setIsIndeterminate="setIsIndeterminate"
            :isVertical="isVertical"
            :lastSpan="lastSpan"
          ></sort-data>
          <div style="text-align:right;padding:0 15px;">
            <el-pagination
              :hide-on-single-page="true"
              @current-change="setAllSort"
              :current-page.sync="allSort.current"
              :page-size="allSort.size"
              :total="allSort.total"
              layout="total, prev, pager, next"
            ></el-pagination>
          </div>
          <div style="text-align:left;padding:0 30px;">
            <span style="font-size:14px;color:#999999;">添加分类</span>
          </div>
          <ul style="text-align:left;">
            <li class="sortArr" style="height: 1.6em;width:95%;border: 1px solid #e0e0e0;">
              <el-row :gutter="24" style="width:100%;text-align:center;">
                <el-col :span="3">
                  <h4>#</h4>
                </el-col>
                <el-col :span="7">
                  <p>
                    <el-input placeholder="请输入分类名称" v-model="sort.newsCategoryName" clearable></el-input>
                  </p>
                </el-col>
                <el-col :span="10">
                  <p>
                    <el-input placeholder="请输入分类描述" v-model="sort.remark" clearable></el-input>
                  </p>
                </el-col>
                <el-col :span="4" style="text-align:right;">
                  <p>
                    <el-button type="success" icon="el-icon-check" circle @click="addSort()"></el-button>
                  </p>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sortData from "@/views/backstage/notice/components/sort/sortData.vue";
export default {
  data() {
    return {
      allSort: [],
      el: "#sortArr",
      sort: {},
      delsLen: 0,
      isCheckAll: false,
      isIndeterminate: false,
      isVertical: false,
      lastSpan: 6,
      maxW: 0,
      maxH: 0
    };
  },
  created() {
    this.setAllSort(1);
  },
  mounted() {
    this.maxH = this.$parent.$data.maxH;
    this.maxW = this.$parent.$data.maxW;
    this.init();
  },
  watch: {
    allSort: function (newVal) {
      this.$refs.sortData.allSort = newVal.records;
    },
    isCheckAll(newVal) {
      this.$refs.sortData.isCheckAll = newVal;
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
        this.isVertical = true;
        this.lastSpan = 14;
      } else {
        this.isVertical = false;
        this.lastSpan = 6;
      }
    },
    async setAllSort(pageNo) {
      try {
        if (pageNo != this.allSort.pageNo) {
          this.dels = [];
        }
        let res = await this.$axios.get("newscategory/", {
          params: {
            currPage: pageNo
          }
        });
        if (res.status === 200) {
          this.allSort = res.data.data;
          this.dels = [];
        } else {
          this.$message.error({
            message: "请求出错！"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addSort() {
      try {
        let res = await this.$axios.post("newscategory/", this.sort);

        if (res.status === 200) {
          let typ = "";
          if (res.data.code === 200) typ = "success";
          else typ = "error";
          this.$message({
            type: typ,
            message: res.data.message
          });
          this.sort = {};
          this.setAllSort(this.allSort.pageNo);
        } else {
          this.$message.error({
            message: "请求出错！"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    checkAll() {
      if (!this.isCheckAll) {
        this.isCheckAll = true;
        this.isIndeterminate = false;
      } else {
        this.isCheckAll = false;
        this.isIndeterminate = false;
      }
    },
    setDels(val) {
      this.delsLen = val;
    },
    setIsCheckAll(val) {
      this.isCheckAll = val;
    },
    setIsIndeterminate(val) {
      this.isIndeterminate = val;
    }
  },
  components: {
    sortData
  }
};
</script>
<style>
ul {
  list-style: none;
}
.sortArr {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin: 15px auto;
  padding: 30px 10px;
  width: 95%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.sortArr.active .sortArr,
.sortArr:hover,
.sortArr:visited {
  border: 1px solid rgb(63, 171, 235);
  color: rgb(63, 171, 235);
}
.update-span,
.del-span {
  padding: 0 5px;
}
.update {
  fill: #8a8a8a;
}
.update-span:hover .update {
  fill: rgb(63, 171, 235);
}

.del {
  fill: #8a8a8a;
}
.del-span:hover .del {
  fill: #f56c6c;
}
/*
.el-input--suffix .el-input__inner {
  text-align: center;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #f56c6c;
}
.el-checkbox__inner:hover {
  border-color: #f56c6c;
}
*/

.noChecked {
  background-color: white;
  color: #666666;
}
</style>