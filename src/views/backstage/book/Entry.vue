<template>
  <div class>
    <div style="margin:23px 0">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
        <el-breadcrumb-item style="font-size:18px;">录入书籍</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form ref="form" pxlabel-width="100px" :model="form" :rules="rules">
        <div class="form1">
          <div>
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="form.bookName"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="数量" prop="count">
              <el-input v-model.number="form.count" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类号" prop="bookCategoryID">
              <!-- <el-input v-model="form.bookCategoryID" autocomplete="off"></el-input> -->
              <el-cascader :props="props" :show-all-levels="false" v-model="form.bookCategoryID"></el-cascader>
            </el-form-item>
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="form.isbn"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form
              :model="form"
              :label-width="formLabelWidth"
              label-position="top"
              :rules="rules"
            >
              <el-form-item label="书籍封面" ref="uploadElement" prop="img">
                <el-upload
                  ref="upload"
                  action="http://120.26.177.203/news/picturesUpload"
                  accept="image/png, image/gif, image/jpg, image/jpeg"
                  list-type="picture-card"
                  :limit="limitNum"
                  :auto-upload="true"
                  :on-exceed="handleExceed"
                  :before-upload="handleBeforeUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-change="imgChange"
                  :class="{hide:hideUpload}"
                  :headers="token"
                  :on-success="handleAvatarSuccess"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" size="medium" @click=" onSubmit('form')">提交</el-button>
          <el-button size="medium" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    let _this = this;
    var checkNum = (rule, value, callback) => {
      console.log(value);
      if (value <= 0) {
        callback(new Error("必须大于0"));
      } else {
        callback();
      }
    };
    return {
      token: {},
      isImg: false,
      isSuccess: false,
      form: {
        bookName: "",
        author: "",
        isbn: "",
        price: 0,
        count: 0,
        bookCategoryID: "",
        remark: "",
        imageUrl: ""
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          let resdata = {};
          const id = node.root ? null : node.value;
          if (id != null) {
            resdata = { categoryId: id };
          }
          console.log(id);
          console.log(resdata);
          _this.$axios
            .get("book/categorise", {
              params: resdata
            })
            .then(res => {
              if (res.data.data.length == 0) {
                node.data.leaf = true;
                console.log(node.data.leaf);
              }
              const nodes = Array.from(res.data.data).map(item => ({
                value: item.id,
                label: item.bookCategoryName,
                leaf: false
              }));
              // console.log(nodes)
              resolve(nodes);
            })
            .catch(error => {});
        }
      },
      rules: {
        bookName: [{ required: true, message: "书名不能为空" }],
        author: [{ required: true, message: "作者不能为空" }],
        isbn: [{ required: true, message: "ISBN号不能为空" }],
        price: [
          { required: true, message: "价格不能为空" },
          { validator: checkNum, trigger: "blur" }
        ],
        bookCategoryID: [{ required: true, message: "分类号不能为空" }],
        count: [
          { required: true, message: "数量不能为空" },
          { type: "number", message: "数量必须为数字值" },
          { validator: checkNum, trigger: "blur" }
        ],
        img: [{ required: true, message: "请选择封面" }]
      },
      hideUpload: false,
      dialogImageUrl: "",
      dialogVisible: false, //图片预览弹窗
      formLabelWidth: "80px",
      limitNum: 1
    };
  },
  created() {
    this.getToken();
  },
  methods: {
    getToken: function() {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token["HEADER-TOKEN"] = localStorage.getItem("HEADER_TOKEN");
    },
    // 上传文件之前的钩子
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$notify.warning({
          title: "警告",
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片"
        });
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$notify.warning({
          title: "警告",
          message: "图片大小必须小于2M"
        });
      }
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log(file.url);
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = res.link;
      this.isSuccess = true;
    },
    imgChange(files, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
      if (fileList) {
        this.$refs.uploadElement.clearValidate();
      }
    },
    onSubmit(formName) {
      this.form.bookCategoryID=this.form.bookCategoryID[this.form.bookCategoryID.length-1]
      console.log(this.form.bookCategoryID)
      if (!this.isSuccess) {
        this.$message.error("请选择书籍封面");
        return;
      }
  
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.remark == "") {
            this.form.remark = null;
          }

          console.log(this.form.imageUrl);
          const { data: res } = await this.$http.post("book/", this.form);
          if (res.code != 200) {
            this.$message.error("提交失败");
          }
          this.$message.success("提交成功");
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");

          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style >
.el-input {
  width: 350px;
}
.form1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.hide .el-upload--picture-card {
  display: none;
}
</style>