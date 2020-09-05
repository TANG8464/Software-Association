 <template>
  <div class="public-table">
    <el-table :data="data" style="width: 100%">
      <el-table-column
        v-for="(item,index) in header"
        :key="index"
        :label="item"
        :min-width="(item.length*16>minW?item.length*16:minW)+'px'"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row[item]+''" placement="bottom">
            <span>{{scope.row[item]?scope.row[item]:'-'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

  <script>
export default {
  props: {
    data: {
      type: Array,
      require: true,
    },
    header: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      minW: 80,
    }
  },
}
</script>
<style>
.public-table .el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}
</style>