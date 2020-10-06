<template>
<div class="secretKey_fromData">
    <div class="from-box" v-for="(item,index) in showKeys" :key="item.id">
        <el-form label-position="left" label-width="85px" :model="item">
            <el-form-item label="bucketName">
                <el-input v-model="item.configValue.bucketName"></el-input>
            </el-form-item>
            <el-form-item label="AK/SK">
                <template>
                    <div style="display: flex;align-items: center;width:100%;">
                        <div style="width:100%;">
                            <label style="margin:0 5px;">AK:</label>
                            <el-input v-model="item.configValue.accessKey" readonly></el-input>
                            <label style="margin:0 5px;">SK:</label>
                            <el-input v-model="item.configValue.securityKey" :key="skStatus" :type="item.skStatus" readonly></el-input>
                            <!--显示或隐藏sk-->
                            <el-button type="info" size="mini" class="pwd-show" @click="changeType(index,'text')" v-if="item.skStatus==='password'">显示</el-button>
                            <el-button type="info" size="mini" class="pwd-show" @click="changeType(index,'password')" v-else>隐藏</el-button>
                        </div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="状态">
                <template>
                    <span :class="item.state.style" v-html="item.state.title"></span>
                </template>
            </el-form-item>
            <el-form-item label="操作">
                <template>
                    <div v-if="item.configStatus">
                        <el-button size="mini" type="danger" @click="blockUp(index, item)">停用</el-button>
                    </div>
                    <div v-else>
                        <el-button size="mini" type="warning" plain @click="startUsing(index, item)">启用</el-button>
                        <el-button size="mini" type="danger" plain @click="handleDelete(index, item)">删除</el-button>
                    </div>
                </template>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            skStatus: 0,
            showKeys: [],
        }
    },
    props: {
        keys: {
            type: Array,
            deafults: [],
        },
    },
    watch: {
        keys(newVal) {
            this.showKeys = newVal
            this.showKeys.forEach((item) => {
                item.skStatus = 'password'
            })
        },
    },
    methods: {
        changeType(index, type) {
            this.showKeys[index].skStatus = type
            this.skStatus++
        },
        blockUp(index, row) {
            //禁用密钥
            this.$confirm('您确定禁用此密钥吗？禁用前请确认该密钥没有被使用。', ' ', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                // this.updateStatus(row.id, !row.configStatus)
                this.$emit('updateStatus', row.id, !row.configStatus)
            })
        },
        startUsing(index, row) {
            //启用密钥
            this.$emit('updateStatus', row.id, !row.configStatus)
        },
        handleDelete(index, row) {
            //删除密钥时弹出密码验证
            this.$prompt('请输入你的密码', '密码验证', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputType: 'password',
                customClass: 'fullScreen',
            }).then(({
                value
            }) => {
                // this.delKey(row.id, value)
                this.$emit('delKey', row.id, value)
            })
        },
    },
}
</script>

<style scoped>
.from-box {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    margin: 10px 0;
    padding: 20px 0;
}

.from-box:last-child {
    border-top: none;
}

.secretKey_fromData .el-input {
    margin: 5px 0;
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
    border-color: #c0c4cc !important;
    outline: 0;
}

.pwd-show {
    float: right;
    position: relative;
    top: -39px;
    left: -8px;
}

.run {
    color: #67c23a;
}

.over {
    color: #ff7373;
}

.update-status {
    background-color: white;
}
</style><style>
.el-icon-lock {
    font-size: 35px;
    text-align: center;
    display: block;
}

.fullScreen .el-message-box__title {
    font-weight: 600;
    font-size: 18px;
}

.fullScreen .el-message-box__content p,
.fullScreen .el-message-box__title,
.fullScreen .el-icon-lock,
.fullScreen .el-message-box__input,
.fullScreen .el-message-box__btns {
    text-align: center;
    line-height: 50px;
    margin: auto auto;
    box-sizing: content-box;
}

.fullScreen .el-message-box__input {
    width: 300px;
}

.fullScreen .el-message-box__close {
    font-size: 28px;
}
</style>
