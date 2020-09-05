<template>
  <div class="resource-list" style="min-height:520px">
    <el-row :gutter="24" class="resource" style="margin:0;overflow:auto;">
      <el-col
        class="resource-item"
        :lg="6"
        :sm="5"
        :xs="12"
        v-for="item in resource"
        :key="item.id"
        :style="{height}"
      >
        <div class="item-content">
          <img class="cover" :src="item.resourceLogo" alt :style="{width:imgW,height:imgH}" />
          <div class="info" :style="{width:imgW}">
            <el-tooltip class="item" effect="dark" :content="item.resourceName" placement="bottom">
              <p class="resource-name" style="margin:5px 0">{{item.resourceName}}</p>
            </el-tooltip>
            <p style="margin:5px 0;color:#999999;font-size:14px" v-if="item.member">
              <span>{{item.member.memberName}}</span>
              <span style="float:right;" @click="download(item)">
                <icon name="download" scale="30" width="30"></icon>
                {{item.count}}
              </span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="resource&&resource.length===0" class="null">
      <icon name="null" scale="50" width="50"></icon>
      <span>什么也没有</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    resource: {
      type: Array,
      require: true,
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    height() {
      const maxH = this.size.maxH
      return this.size.isSmallSize ? 130 + maxH * 0.1 + 'px' : 180 + maxH * 0.1 + 'px'
    },
    imgW() {
      return this.size.isSmallSize ? '100%' : '90%'
    },
    imgH() {
      return this.size.isSmallSize ? '55%' : '70%'
    },
  },
  mounted() {
    console.log(this.resource)
  },
  methods: {
    download(item) {
      this.$emit('download', item)
    },
  },
}
</script>
<style>
.resource-list {
  margin: 10px;
}
.resource-list .cover {
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.resource-list .item-content {
  width: 99%;
  height: 99%;
}
.resource-list .item-content:hover {
  transform: scale(1.01);
}
.resource-list .info {
  width: 90%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 5px 8px;
  box-sizing: border-box;
  position: relative;
  top: -5px;
  box-shadow: 0 0 5px 0 #e0e0e0;
}
.resource-list .resource-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.resource-list .null {
  text-align: center;
  line-height: 500px;
  color: #666666;
  transition: all 0.5s;
}
</style>