<template>
  <div class="editor-wrap">
    <!--froala编辑框-->
    <froala id="froala-editor" :tag="'textarea'" :config="froalaConfig" v-model="content"></froala>
  </div>
</template>

<script>
export default {
  props: {
    // 显示的工具列表
    tool: {
      type: Array,
      default: function () {
        return [
          "undo",
          "redo",
          "clearFormatting",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "fontFamily",
          "fontSize",
          "textColor",
          "inlineClass",
          "backgroundColor",
          "formatOL",
          "formatUL",
          "align",
          "outdent",
          "indent",
          "quote",
          "paragraphStyle",
          "lineHeight",
          "insertLink",
          "insertImage",
          "insertTable",
          "emoticons",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "spellChecker",
          "html",
          "help",
          "fullscreen"
        ];
      }
    },
    placeholder: {
      type: String
      //   required: true
    },
    height: {
      type: Number
    },
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 1
    }
  },
  name: "froala-editor",
  data() {
    var that = this;
    return {
      editor: null,
      content: null,
      froalaConfig: {
        toolbarButtons: this.tool,
        // theme: "dark",//主题
        placeholderText: this.placeholder || "请在此输入公告内容",
        language: "zh_cn", //国际化
        imageMaxSize: 1024 * 1024 * 20,//文件大小
        imageUploadURL: "http://120.26.177.203/news/picturesUpload", //上传url
        imageUploadParams: { "HEADER-TOKEN": "" },//携带token参数
        quickInsertButtons: ["image", "table", "ul", "ol", "hr"], //快速插入项
        toolbarVisibleWithoutSelection: false, //是否开启 不能选中文字模式
        disableRightClick: true, //是否屏蔽右击
        colorsHEXInput: false, //关闭16进制色值
        toolbarSticky: false, //操作栏是否自动吸顶,
        zIndex: 2501,
        height: this.height || "500",
        autofocus: true,
        events: {
          initialized: function () {
            that.editor = this;
            that.content = that.value;
          },
          "image.beforeUpload": function () {
            this.opts.imageUploadParams["HEADER-TOKEN"] = localStorage.getItem(
              "HEADER_TOKEN"
            );
            return true;
          },
          blur: () => {
            this.$emit("blur");
          },
          contentChanged: () => { }
        }
      }
    };
  },
  watch: {
    content: function (newVal, old) {
      if (old !== newVal) {
        let val = this.getSimpleText(this.editor.html.get(true));
        this.$emit("input", val);
      }
    },
    label: function (newVal, old) {
      if (old !== newVal) {
        this.editor.html.set(newVal);
      }
    }
  },
  methods: {
    //富文本中提取纯文本
    getSimpleText: html => {
      var re1 = new RegExp('<p data-f-id="pbf".+?</p>', "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      var msg = html.replace(re1, ""); //执行替换成空字符
      return msg;
    },
    resetValue(val) {
      this.content = val || "";
    }
  }
};
</script>

<style>
.editor-wrap {
  width: 100%;
}

.editor-wrap > div {
  width: 100%;
}

.fr-wrapper > div[style*='z-index:9999;'],
.fr-wrapper > div[style*='z-index: 9999;'] {
  height: 0;
  overflow: hidden;
}

.fr-box .second-toolbar #logo {
  width: 0 !important;
  height: 0 !important;
  overflow: hidden;
}

.fr-box .fr-toolbar {
  border-radius: 4px 4px 0 0;
  border-color: #dcdfe6;
}

.fr-box .second-toolbar {
  border-radius: 0 0 4px 4px;
  border-color: #dcdfe6;
}

.fr-box .fr-wrapper {
  border-color: #dcdfe6 !important;
}
.fr-wrapper > div[style*='z-index: 9999'] {
  position: absolute;
  top: -10000px;
  opacity: 0;
}
.fr-element.fr-view {
  position: absolute;
  top: 0;
  width: 100%;
}
.fr-placeholder{
  z-index: -1;
}
a[href="https://froala.com/wysiwyg-editor"], a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
  position: absolute;
  top: -99999999px;
  opacity: 0;
 }
</style>
