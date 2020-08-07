<template>
  <div class="user-college">
    <div style="margin:30px 0;">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" style="display:inline;">
        <el-breadcrumb-item
          v-for="item in breadcrumb"
          :key="item.id"
          to="/backstage/user/college"
          @click.native="breadcrumbClick(item)"
        >{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="collegeTree"
      style="width: 100%;overflow: auto;"
      class="not-choose-text"
      height="450"
      :cell-class-name="cellClassName"
      @cell-mouse-enter="onCellMouseEnter"
      @cell-mouse-leave="onCellMouseLeave"
      @row-dblclick="rowClick"
    >
      <el-table-column width="30" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.child&&scope.row.child.length">
            <icon name="multistage" scale="16" width="16"></icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="typeMap[currentData.type]">
        <template slot-scope="scope">
          <div v-if="scope.row.isEdit">
            <el-input style="width:70%" v-model="scope.row.name" placeholder="请输入内容"></el-input>
            <div
              style="display:inline-block;color:#33ce33;"
              @click="updateName(scope.row,scope.$index)"
            >
              <icon name="confirm" scale="23" width="23"></icon>
            </div>
            <div style="display:inline-block;color:#f56666;" @click="scope.row.isEdit=false">
              <icon name="close" scale="20" width="20"></icon>
            </div>
          </div>
          <div v-else>
            <span v-if="scope.row.type!==0">
              <el-tag :type="scope.row.tagType" size="mini" effect="plain">{{scope.row.parentName}}</el-tag>
            </span>
            <span>{{scope.row.name}}</span>
            <span v-show="scope.row.isHover" @click="scope.row.isEdit=true" style="margin:0 5px;">
              <icon name="edit" scale="20" width="20"></icon>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.child">共有{{scope.row.child.length}}个{{typeMap[currentData.type+1]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="right">
        <template slot="header">
          <el-button size="mini" @click="add(currentData)">{{currentData.type|addBtnText}}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="removeTip(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>共{{ collegeTree.length}}个{{typeMap[currentData.type]}}</footer>
  </div>
</template>
<script>
import { searchCollegeTree } from '@/api/searchData'
export default {
  data() {
    return {
      collegeTree: [],
      typeMap: ['院系', '专业', '班级'],
      breadcrumb: [{ id: 0, name: '所有院系', type: 0, parentId: 0 }],
      currentData: { type: 0, parentId: 0 },
    }
  },
  created() {
    this.setCollegeTree()
  },
  methods: {
    //获取院系树
    async setCollegeTree() {
      const data = await searchCollegeTree()
      this.breadcrumb[0].upOneLevel = data
      //更改面包屑绑定的上一级
      this.breadcrumb.forEach((item, index, arr) => {
        if (index > 0) {
          arr[index - 1].upOneLevel.forEach((children) => {
            if (children.id === item.parentId) item.upOneLevel = children.child
          })
        }
      })
      //最后一个为当前所在位置
      this.collegeTree = this.breadcrumb[this.breadcrumb.length - 1].upOneLevel
    },
    //设置一个特定的className，可以操作表格的row和column返回值
    cellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
    },
    //用于是否展示编辑框
    onCellMouseEnter(row, column, cell, event) {
      if (column.index === 1) row.isHover = true
    },
    onCellMouseLeave(row, column, cell, event) {
      if (column.index === 1) row.isHover = false
    },
    //当表格的某行被双击时，展开子集，并设置所需要的内容
    rowClick(row, column, event) {
      if (row.child) {
        this.breadcrumb[row.type + 1] = {
          id: row.type + 1,
          name: row.name,
          upOneLevel: row.child,
          parentId: row.id,
        }
        //重置当前属性
        this.currentData.type = row.type + 1
        this.currentData.parentId = row.id
        this.collegeTree = row.child
      }
    },
    //当面包屑导航被点击时
    breadcrumbClick(item) {
      //重置当前属性
      this.currentData.type = item.id
      this.currentData.parentId = item.parentId
      this.collegeTree = item.upOneLevel
      //删除相应的面包屑
      const startIndex = item.id + 1
      const overIndex = this.breadcrumb.length - startIndex
      this.breadcrumb.splice(startIndex, overIndex)
    },
    async add({ type, parentId }) {
      const addDataMap = [
        { institute_name: '新的院系' },
        { instituteID: parentId, specialty_name: '新的专业' },
        { specialtyID: parentId, class_name: '新的班级' },
      ]
      const urlMap = ['college/institute', 'college/specialty', 'college/class']
      const addData = addDataMap[type]

      const { data } = await this.$axios.post(`${urlMap[type]}`, addData)
      if (data.code === 200) {
        this.$message.success('添加成功')
        this.setCollegeTree()
      } else {
        this.$message.error(data.message)
      }
    },
    async updateName({ type, id, name }, index) {
      this.collegeTree[index].isEdit = false
      this.$message.warning('暂未实现修改功能')
    },
    removeTip({ type, id, child }) {
      const typeMap = this.typeMap
      const childrenLen = child ? child.length : 0
      if (childrenLen > 0) {
        this.$confirm(
          `此操作将永久删除该${typeMap[type]}以及该${typeMap[type]}下所有${typeMap[type + 1]}`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            this.removeName(type, id)
          })
          .catch(() => {})
      } else this.removeName(type, id)
    },
    async removeName(type, id) {
      const urlMap = ['college/institute', 'college/specialty', 'college/class']
      const { data } = await this.$axios.delete(`${urlMap[type]}/${id}`)
      if (data.code === 200) {
        this.$message.success('删除成功')
        this.setCollegeTree()
      } else {
        this.$message.error(data.message)
      }
    },
  },
  filters: {
    addBtnText(type) {
      const addMap = ['新增院系', '新增专业', '新增班级']
      return addMap[type]
    },
  },
}
</script>
<style>
footer {
  text-align: center;
  margin: 10px 0;
  color: #666666;
  font-size: 14px;
}
</style>