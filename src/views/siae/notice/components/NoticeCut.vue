<template>
  <div class="notice-cut" v-if="otherNotice">
    <div
      class="notice"
      v-for="(item,index) in otherNotice"
      :key="item.id"
      @click="toOther(item.id,otherArr[index])"
    >
      <el-row :gutter="24" style="margin:0">
        <el-col :lg="5" :sm="24">
          <img class="cover" :src="item.cover" alt />
        </el-col>
        <el-col :lg="18" :sm="24">
          <h4>{{item.title}}</h4>
          <p class="content" style="min-height:75px">{{item.text}}</p>
          <div class="notice-item_footer">
            <p v-if="item.member">
              <span>
                <img
                  :src="item.member.avatarUrl"
                  height="30px"
                  width="30px"
                  style="border-radius:50%"
                  alt
                />
              </span>
              <span>{{item.member.memberName}}</span>
              <span>
                <icon name="time" scale="14" width="14"></icon>
                {{item.deplDate|dataFormatter}}
              </span>
              <span>
                <icon name="footer" scale="15" width="15"></icon>
                {{item.count}}
              </span>
            </p>
            <p style="float:right;"></p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import dataFormatter from '@/filters'
export default {
  props: {
    otherNotice: {
      type: Array,
      require: true,
    },
    otherArr: {
      type: Array,
      require: true,
    },
  },
  methods: {
    toOther(id, index) {
      this.$emit('toOther', id, index)
    },
  },
  filters: { dataFormatter },
}
</script>
<style>
.notice-cut {
  width: 98%;
  margin: 5px;
}
.notice-cut div {
  margin: 5px 0;
  padding: 0 2px;
}
.notice-cut .notice {
  border-bottom: 1px solid #e0e0e0;
}
.notice-cut .notice:hover {
  box-shadow: 0px 0px 5px 1px #e0e0e0;
}
.notice-cut .notice:hover .cover {
  transform: scale(1.01);
}
.notice-cut .cover {
  width: 98%;
  height: 148px;
  object-fit: cover;
  border-radius: 8px;
}
.notice-cut .content {
  overflow: hidden !important;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: 15px;
}
.notice-cut h4 {
  padding: 0;
  margin: 0;
}
.notice-cut .notice-item_footer {
  color: #666666;
  font-size: 13px;
}
.notice-cut .notice-item_footer p {
  display: flex;
  align-items: center;
  margin: 5px;
}
.notice-cut .notice-item_footer span {
  margin: 0 5px;
}
</style>