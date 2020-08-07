<template>
  <div class="bulk-import">
    <p class="intro">
      注意:上传时的数据条数最好不要超过3000条哦!因为不超过3000行上传的数据如果出现错数据也会回滚，修改数据重新上传即可,反之不会。
      <br />flag: 0协会内，1协会外，2永不录入
    </p>
    <el-link type="success" :href="uploadLink">下载导入模板</el-link>
    <el-upload
      class="upload-demo"
      drag
      action="http://120.26.177.203/member/uploadMemberExcel"
      :headers="token"
      :on-success="handldeSuccess"
      :on-error="handldeError"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将成员表拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>
    </el-upload>
  </div>
</template>
<script>
import token from '@/utils/token'
export default {
  data() {
    return {
      uploadLink: '#',
      token: {},
    }
  },
  mounted() {
    this.setUploadLink()
    this.token = {
      'HEADER-TOKEN': token.getHeaderToken(),
    }
  },
  methods: {
    async setUploadLink() {
      const { data } = await this.$axios.get('member/downloadMemExportTemplates', {
        responseType: 'blob',
      })
      let url = window.URL.createObjectURL(data)
      this.uploadLink = url
    },
    beforeUpload(file) {
      const excel = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      const isExcel = excel.includes(file.type)
      console.log(isExcel)
      if (!isExcel) this.$message.error('请上传Excel文件')
      return isExcel
    },
    handldeSuccess(res, file) {
      console.log(res)
      this.$message.success('导入成功')
    },
    handldeError(err, file) {
      this.$message.error(err.message)
    },
  },
}
</script>
<style>
.bulk-import .intro {
  color: #666f80;
  width: 70%;
  text-align: left;
  font-size: 14px;
  margin: 50px 0;
}
.bulk-import .upload-demo {
  text-align: center;
}
.bulk-import .el-upload {
  width: 100%;
  max-width: 500px;
}
.bulk-import .el-upload-dragger {
  width: 100%;
  height: 260px;
  padding-top: 30px;
}
</style>