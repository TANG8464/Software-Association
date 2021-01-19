<template>
  <div class="apply">
    <div class="content" v-if="!isApplySuccess">
      <p class="tip">请正确填写入会信息，这将关系到你的账号安全</p>
      <el-form class="applyFrom" ref="applyFrom" :model="applyFrom" label-position="top">
        <el-form-item prop="phoneNum">
          <el-input v-model="applyFrom.phoneNum" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="cardID">
          <el-input v-model="applyFrom.cardID" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item prop="classID">
          <el-cascader
            placeholder="班级"
            v-model="applyFrom.cascadeClass"
            :options="cascadeClass"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChangeCascadeClass"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="stu_num">
          <el-input v-model="applyFrom.stu_num" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            action="#"
            drag
            :auto-upload="false"
            :on-change="importApply"
          >
            <i class="el-icon-upload"></i>
            <p class="el-upload__text">
              将申请表拖到此处，或
              <em>点击上传</em>
            </p>
            <p class="el-upload__tip" slot="tip">只能上传Word文件，且文件大小不能为空</p>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="submitForm()">提交申请</el-button>
        </el-form-item>
        <el-form-item v-if="error">
          <span class="error-tip">{{ error }}</span>
        </el-form-item>
      </el-form>
      <p style="text-align: right">
        <el-link type="info" :href="templateLink">下载申请表模板</el-link>
      </p>
      <p class="link-box" @click="isSubmitted = true">
        <span class="link">查看已提交申请表</span>
      </p>
    </div>
    <!-- 提交成功 -->
    <div class="finish" v-else>
      <h2 class="success"><icon name="success" scale="40" width="40"></icon>申请成功</h2>
      <p class="wait">请耐心等待审核结果，审核结果将会通过邮箱发送给你</p>
      <p class="link-box" @click="isSubmitted = true">
        <span class="link">查看已提交申请表</span>
      </p>
    </div>
    <!-- 信息确认 -->
    <div class="pop-up-box" v-if="isOpenInfoConfirm">
      <div class="info">
        <p class="tip">请再确认一遍你的信息，这将关系到你的账号安全</p>
        <p>身份证号:{{ applyFrom.cardID }}</p>
        <p>手机号:{{ applyFrom.phoneNum }}</p>
        <el-button class="btn-full" type="primary" @click="uploadApply()">我已确认</el-button>
        <el-link
          type="danger"
          style="font-size: 12px; margin-left: 3px"
          @click="isOpenInfoConfirm = false"
          >信息有误</el-link
        >
      </div>
    </div>
    <!-- 查看自己已经提交的申请书 -->
    <div class="pop-up-box" v-show="isSubmitted">
      <div class="bottom" ref="submitted">
        <div class="submitted-header">
          <span
            @click="isSubmitted = false"
            style="margin: 10px; display: inline-block; color: #999999"
          >
            <icon name="close" scale="20" width="20"></icon>
          </span>
        </div>
        <div class="submitted-main" v-if="isSubmitted">
          <my-apply></my-apply>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import token from '@/utils/token'
import { phoneVerify, cardIdVerify, stuNumVerify, wordVerify } from '@/utils/verify'
import { uploadApply, downloadApplyTemplate } from '@/api/join-apply'
import { searchCascadeClass } from '@/api/member/institutes'
import { encryptionObj, decryptionObj } from '@/utils/encryption'
import MyApply from './components/my-apply.vue'
export default {
  components: {
    MyApply,
  },
  data() {
    return {
      cascadeClass: null,
      applyFrom: {
        cardID: null,
        classID: null,
        phoneNum: null,
        stu_num: null,
        apply: null,
      },
      error: null,
      isOpenInfoConfirm: false,
      isApplySuccess: false,
      isSubmitted: false,
      templateLink: null,
      day: 0,
    }
  },
  watch: {
    isSubmitted(newVal) {
      setTimeout(() => {
        if (newVal) {
          this.$refs.submitted.classList.remove('fade-out')
          this.$refs.submitted.classList.add('fade-in')
        } else {
          this.$refs.submitted.classList.add('fade-out')
          this.$refs.submitted.classList.remove('fade-in')
        }
      }, 100)
    },
  },
  async created() {
    const applyFrom = localStorage.getItem('applyFrom')
    if (applyFrom) {
      console.log(await decryptionObj(applyFrom))
      this.applyFrom = JSON.parse(await decryptionObj(applyFrom))
    }
    this.setCascadeClass()
    this.downloadApply()
  },
  methods: {
    //查找级联班级
    async setCascadeClass() {
      const res = await searchCascadeClass()
      this.cascadeClass = res
    },
    //设置班级id
    handleChangeCascadeClass(cascadeClass) {
      this.applyFrom.classID = cascadeClass[cascadeClass.length - 1]
    },
    //导入申请表
    async importApply(file) {
      if (file.size === 0) {
        this.$message.error('文件大小不能为空，已取消上传')
        this.$refs['upload'].clearFiles()
        return
      }
      const isWord = wordVerify(file.raw)
      const sizeM = 1024 * 1024 * 10
      if (!isWord) this.$message.error('请上传Word文件')
      else if (file.size > sizeM) {
        this.$message.error('文件最大不能超过10MB')
      } else this.applyFrom.apply = file.raw
      if (!isWord || file.size > sizeM) {
        this.$refs['upload'].clearFiles()
      }
    },
    //提交前验证
    submitForm() {
      const cardID = this.applyFrom.cardID
      const classID = this.applyFrom.classID
      const phoneNum = this.applyFrom.phoneNum
      const stu_num = this.applyFrom.stu_num
      if (!phoneVerify(phoneNum)) {
        this.error = '手机号格式不正确'
      } else if (!cardIdVerify(cardID)) {
        this.error = '身份证号格式不正确'
      } else if (!Number(stu_num)) {
        this.error = '学号必须为数值'
      } else if (!stuNumVerify(stu_num)) {
        this.error = '学号必须为2-3位'
      } else if (!this.applyFrom.apply) {
        this.error = '请上传招新申请表'
      } else {
        this.error = null
        this.isOpenInfoConfirm = true
      }
    },
    //上传申请表
    async uploadApply() {
      this.isOpenInfoConfirm = false
      const data = await uploadApply(this.applyFrom)
      localStorage.setItem('applyFrom', JSON.stringify(await encryptionObj(this.applyFrom)))
      if (data.code === 200) {
        this.isApplySuccess = true
      } else this.error = data.message
    },
    //下载申请表模板
    async downloadApply() {
      const data = await downloadApplyTemplate()
      if (data.code === 200) {
        this.templateLink = data.data
      }
    },
  },
}
</script>

<style lang="scss">
.apply {
  .tip {
    color: #bababa;
  }

  .applyFrom {
    .el-input {
      input {
        border: 1px dashed #3f3f3f;
        background: none;
        background: rgba($color: #000000, $alpha: 0.2) !important;
        color: white;
      }

      input:focus {
        border-color: rgba($color: #ffffff, $alpha: 0.5);
      }
    }

    .el-cascader {
      width: 100%;
    }

    .el-form-item {
      margin: 0;
      margin-bottom: 10px;
    }
  }

  .link-box {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0;
  }

  .link:hover {
    border-bottom: 1px solid white;
  }

  .el-upload {
    width: 100%;
    color: rgb(181, 181, 181);
    background: rgba($color: #000000, $alpha: 0.2);

    .el-upload-dragger {
      width: 100%;
      background: none;
      height: 130px;
      border: 0.5px dashed #3f3f3f;

      .el-icon-upload {
        margin: 10px 0;
      }
    }

    .el-upload-dragger:hover {
      border-color: rgba($color: #ffffff, $alpha: 0.5);
    }

    .el-upload__text {
      color: #b5b5b5;
    }
  }
  .el-form-item__content {
    line-height: normal !important;
  }
  .el-upload__tip {
    margin: 0 !important;
    color: #b5b5b5;
  }
}
</style>
