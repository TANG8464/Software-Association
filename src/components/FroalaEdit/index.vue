<template>
<div class="editor-wrap">
    <!--froala编辑框-->
    <froala id="froala-editor" :tag="'textarea'" :config="froalaConfig" v-model="content"></froala>
</div>
</template>

<script>
import token from '@/utils/token'
export default {
    props: {
        toolbarButtons: {
            type: Array,
            require: true
        },
        height: {
            type: String,
            default: '600'
        },
        placeholderText: {
            type: String,
            default: '请输入内容'
        }
    },
    data() {
        return {
            editor: null,
            content: null,
            froalaConfig: {
                zIndex: 2501,
                height: this.height,
                toolbarSticky: false,
                toolbarButtons: this.toolbarButtons,
                autofocus: true,
                placeholderText: this.placeholderText,
                textAlign: 'left',
                language: 'zh_cn',
                imageDefaultWidth: 500,
                imageMaxSize: 1024 * 1024 * 20, //文件大小
                imageUploadURL: 'http://120.26.177.203/news/picturesUpload', //上传url
                imageUploadParams: {
                    'HEADER-TOKEN': token.getHeaderToken()
                }, //携带token参数
                videoUploadURL: 'xxxxxxx',
                fileUploadURL: 'xxxxxxx',
                imageManagerLoadURL: 'xxxxxx',
                // requestHeaders: { Authorization: localStorage.eleToken },

                events: {
                    'froalaEditor.initialized': (e, editor) => {
                        this.editor = editor
                    },
                    'froalaEditor.contentChanged': (e, editor) => {
                        this.$emit('on-change', editor.html.get(true))
                    },
                    'froalaEditor.video.linkError': function (e, editor, link) {
                        // Do something here.
                        // this is the editor instance.
                        alert('暂不支持链接上传')
                    },
                    'froalaEditor.video.codeError': function (e, editor, code) {
                        // Do something here.
                        // this is the editor instance.
                        editor.video.insert(code)
                    }
                }
            }
        }
    },
    watch: {
        content: function (newVal, old) {
            if (old !== newVal) {
                let val = this.getSimpleText(this.editor.html.get(true))
                this.$emit('input', val)
            }
        }
    },
    methods: {
        //富文本中提取纯文本
        getSimpleText: html => {
            var re1 = new RegExp('<p data-f-id="pbf".+?</p>', 'g') //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
            var msg = html.replace(re1, '') //执行替换成空字符
            return msg
        },
        tip(message, type) {
            this.$message.error({
                message,
                type
            })
        },
        setHtml(html) {
            this.content = html || ''
        }
    }
}
</script>

<style>
a[href="https://froala.com/wysiwyg-editor"],
a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
    position: absolute;
    top: -99999999px;
    opacity: 0;
}

.fr-toolbar {
    border: 1px solid #e0e0e0;
    box-shadow: none !important;
}

.fr-box.fr-basic.fr-top .fr-wrapper {
    border: 1px solid #e0e0e0;
    box-shadow: none;
    border-top: none;
}

.fr-counter {
    width: 100%;
    box-sizing: border-box;
    text-align: right;
    border-left: none;
}
</style>
