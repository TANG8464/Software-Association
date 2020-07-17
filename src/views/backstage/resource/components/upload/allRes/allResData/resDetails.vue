<template>
  <div class="allRes-resDetails">
    <!--详细信息-->
    <ul class="details-list" v-if="Details.resourceCategory">
      <li class="details-item">
        <label>
          <img class="resImg" :src="Details.resourceLogo" width="80" height="80" />
        </label>
        <span style="font-weight: bold;font-size:20px;">{{Details.resourceName}}</span>
      </li>
      <el-divider></el-divider>
      <li class="details-item">
        <label>所属类别：</label>
        <span>{{Details.resourceCategory.resourceCategoryName}}</span>
      </li>
      <li class="details-item">
        <label>位置：</label>
        <span>{{Details.type}}</span>
      </li>
      <el-divider></el-divider>
      <li class="details-item">
        <label>文件类型：</label>
        <span>{{Details.fileType}}</span>
      </li>
      <li class="details-item">
        <label>文件大小：</label>
        <span>{{Details.size|fsizeFormat}}</span>
      </li>
      <el-divider></el-divider>
      <li class="details-item">
        <label>上传日期：</label>
        <span>{{Details.uploadDate}}</span>
      </li>
      <li class="details-item">
        <label>上传者：</label>
        <span>{{Details.member.memberName}}</span>
      </li>
      <li class="details-item">
        <label>作者：</label>
        <span>{{Details.author}}</span>
      </li>
      <li class="details-item">
        <label>状态：</label>
        <span>{{Details.status?'可下载':'不可下载'}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    Details: {
      //选中项的详细信息
      type: Object,
      default: {}
    }
  },
  mounted() {
    console.log(this.Details);
  },
  methods: {},
  filters: {
    fsizeFormat(fsize) {
      fsize = fsize ? fsize : 0;
      let size;
      let unit = 1024 * 1024 * 1024; //1GB
      let pos;
      if (fsize > unit) {
        size = fsize / unit;
        pos = "GB";
      } else {
        unit /= 1024; //1MB
        if (fsize > unit) {
          size = fsize / unit;
          pos = "MB";
        } else {
          unit /= 1024; //1KB
          if (fsize > unit) {
            size = fsize / unit;
            pos = "KB";
          } else {
            unit /= 1024; //1B
            size = fsize / unit;
            pos = "B";
          }
        }
      }
      return size.toFixed(2) + pos + ` (${fsize}字节)`;
    }
  }
};
</script>
<style scoped>
.details-list {
  list-style: none;
  text-align: left;
}
.details-item:nth-child(1) label img {
  display: inline-block;
}
.details-item label,
.details-item span {
  display: inline-block;
  padding: 0 10px;
  line-height: 30px;
}
.details-item label {
  width: 30%;
}
.details-item {
  display: flex;
  align-items: center;
}
.resImg {
  border-radius: 3px;
}
</style>