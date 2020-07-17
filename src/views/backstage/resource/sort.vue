<template>
  <div class="res-sort">
    <div style="margin:23px 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
        <el-breadcrumb-item style="font-size:18px;">资源类别</el-breadcrumb-item>
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
                  <del-icon></del-icon>
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
         <!--分类数据-->
          <sort-data
            ref="sortData"
            @setAllSort="setAllSort"
            @setDels="setDels"
            @setIsCheckAll="setIsCheckAll"
            @setIsIndeterminate="setIsIndeterminate"
            :isVertical="isVertical"
            :lastSpan="lastSpan"
          ></sort-data>
          <!--分页-->
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
           <!--添加分类-->
          <add-sort @setAllSort="setAllSort(allSort.pageNo)"></add-sort>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sortData from "@/views/backstage/resource/components/sort/sortData.vue";
import delIcon from "@/views/backstage/resource/components/sort/delIcon.vue";
import addSort from "@/views/backstage/resource/components/sort/addSort.vue";
export default {
  data() {
    return {
      allSort: [],
      el: "#sortArr",
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
    allSort: function(newVal) {
      this.$refs.sortData.allSort = newVal.records;
    },
    isCheckAll(newVal) {
      this.$refs.sortData.isCheckAll = newVal;
    },
    "$parent.$data.maxH": function(newVal) {
      this.maxH = newVal;
    },
    "$parent.$data.maxW": function(newVal) {
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
      //分页查找所有资源种类
      try {
        if (pageNo != this.allSort.pageNo) {
          this.dels = [];
        }
        let res = await this.$axios.get("resocategory/page/", {
          params: {
            currPage: pageNo
          }
        });
        if (res.status === 200) {
          this.allSort = res.data.data;
          console.log(this.allSort);

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
    sortData,
    delIcon,
    addSort
  }
};
</script>
<style>
ul {
  list-style: none;
}

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
.noChecked {
  background-color: white;
  color: #666666;
}
</style>