<template>
  <div class="notice_list">
    <ul class="notice">
      <li class="notice-item" v-for="item in notice" :key="item.id" @click="itemClick(item)">
        <el-row :gutter="24">
          <el-col :lg="19" :sm="15">
            <h3 class="notice-item_title">
              <span>
                <el-tag
                  size="mini"
                  v-if="item.top!==0"
                  :type="item.tagType"
                  effect="plain"
                >{{ item.tagLabel }}</el-tag>
              </span>
              <span>{{item.title}}</span>
            </h3>
            <p class="notice-item_content">{{item.content|formatHtml}}</p>
          </el-col>
          <el-col :lg="5" :sm="8" style="text-align:right">
            <img :src="item.content|formatImg" style="max-height:110px;max-width:200px" />
          </el-col>
        </el-row>
        <p class="notice-item_footer">
          <span v-if="item.member">{{item.member.memberName}}</span>
          <span>{{item.deplDate}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    notice: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.notice)
  },
  methods: {
    itemClick(item) {
      this.$emit('itemClick', item)
    },
  },
  filters: {
    formatHtml(content) {
      return content
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '')
        .replace(/<[^>]+?>/g, '')
        .replace(/\s+/g, ' ')
        .replace(/ /g, ' ')
        .replace(/>/g, ' ')
    },
    formatImg(content) {
      let data
      content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
        data = capture
      })
      return data
    },
  },
}
</script>
<style>
.notice_list .notice {
  list-style: none;
}
.notice_list .notice-item {
  border: 1px solid #99aaaa;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 15px 0;
  transition: all 0.5s;
}
.notice_list .notice-item:hover {
  border: 1px solid #666666;
}
.notice_list .notice-item_footer {
  color: #666666;
  font-size: 13px;
  text-align: right;
}
.notice_list .notice-item_footer span {
  margin: 0 5px;
}
.notice-item:hover .notice-item_title span:nth-child(2) {
  border-bottom: 2px solid #666666;
}
.notice_list .notice-item_content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}
.notice_list .notice-item_content img {
  display: none;
}
</style>