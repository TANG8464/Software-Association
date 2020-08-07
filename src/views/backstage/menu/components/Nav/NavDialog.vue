<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="isOpen"
    v-dialogDrag
    :width="size.isSmallSize?'100%':'30%'"
    @close="cancel()"
  >
    <el-form :model="menuObj" v-if="menuObj" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="menuObj.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单" style="text-aligin:left;" v-if="menuObj.isP">
        <el-select v-model="menuObj.parentId" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in parentArr"
            :key="item.menuId"
            :label="item.name"
            :value="item.menuId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由" v-if="btnType!=2">
        <el-input
          v-model="menuObj.url"
          autocomplete="off"
          placeholder="路由地址不包括/Backstage(设置为-则不展示)"
        ></el-input>
      </el-form-item>
      <el-form-item label="接口名称" v-if="btnType===2">
        <el-input v-model="menuObj.perms" autocomplete="off" placeholder="逗号分隔多个接口"></el-input>
      </el-form-item>
      <el-form-item label="图标" v-if="btnType!=2">
        <el-input
          type="textarea"
          v-model="menuObj.icon"
          autocomplete="off"
          maxlength="3000"
          show-word-limit
          resize="none"
          rows="8"
          placeholder="贴入表示图标的代码(建议宽高18~30px)"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否可用" style="width:150px">
        <el-switch v-model="menuObj.status"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    //是否打开Dialog
    isOpenDialog: {
      type: Boolean,
      require: true,
    },
    //标题
    dialogTitle: {
      type: String,
      require: true,
    },
    //按钮类型（用于切换菜单内容）
    btnType: {
      type: Number,
      require: true,
    },
    //展示的menu值
    menu: {
      type: Object,
      require: true,
    },
    //可选的父级数组
    parentArr: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      isOpen: null,
      menuObj: null,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    isOpenDialog(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenDialog', newVal)
    },
    menu(newVal) {
      this.menuObj = newVal
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.menuObj)
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>