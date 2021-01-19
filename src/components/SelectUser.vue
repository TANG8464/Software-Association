<template>
  <div class="select-user">
    <span class="title-item">
      <el-select
        style="width: 120px"
        v-model="condition.startYear"
        placeholder="请选择"
        @change="setAllMember()"
      >
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in startYearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </span>
    <span style="margin: 0 5px"></span>
    <el-select style="width: 210px" v-model="userId" placeholder="请选择" filterable>
      <el-option v-for="item in allMember" :key="item.id" :label="item.memberName" :value="item.id">
        <span>
          <person-avatar :avatar="item.avatarUrl"></person-avatar>
        </span>
        <span style="color: #8492a6; font-size: 13px">{{ item.memberName }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { updateMemberInfo, conditionSearch, downloadMemberInfo } from '@/api/member'
import PersonAvatar from '@/components/PersonAvatar'
import info from '@/utils/info'
export default {
  components: {
    PersonAvatar,
  },
  props: {
    selectId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      allMember: [],
      condition: {
        memberName: null,
        id: null,
        flag: 3,
        curPage: 1,
        classID: null,
        instituteID: null,
        specialtyID: null,
        size: 10000,
        startYear: null,
      },
      userId: null,
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.activeUserInfo
    },
    startYearList() {
      return info.startYear()
    },
  },
  watch: {
    selectId(newVal) {
      this.userId = newVal
    },
    userId(newVal) {
      this.$emit('update:selectId', newVal)
    },
  },
  mounted() {
    this.setAllMember()
  },
  methods: {
    async setAllMember() {
      const data = await conditionSearch(this.condition)
      if (data.code === 200) {
        this.allMember = data.data.records
        // this.$emit('update:selectId', null)
      } else this.$message.error(data.message)
    },
  },
}
</script>

<style lang="scss" scoped>
.select-user {
  .title-item {
    display: inline-block;
  }

  .el-select {
    display: inline-block;
  }
}
</style><style lang="scss">
.el-select-dropdown__item {
  height: 50px !important;
  line-height: 50px !important;
}

.el-select-dropdown {
  span {
    vertical-align: middle;
    display: inline-block;
    margin: 0 3px;
  }
}
</style>
