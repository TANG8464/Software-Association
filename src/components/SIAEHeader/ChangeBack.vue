<template>
<div class="login-change_back">
    <div class="changeBackBtn" @click="centerDialogVisible = true">
        <icon name="skin-peeler" scale="20" width="20"></icon>
    </div>
    <el-dialog title="设置背景" v-dialogDrag :visible.sync="centerDialogVisible" :fullscreen="size.isSmallSize">
        <div style="margin: 10px 0">
            <span style="padding-right: 20px">是否开启背景</span>
            <el-switch v-model="isOpenBack" :active-value="true" :inactive-value="false"></el-switch>
        </div>
        <div style="overflow: auto" :style="{ height: size.isSmallSize ? size.maxH - 200 + 'px' : '350px' }">
            <div class="backSmall" v-for="item in backs" :key="item.id" style="width: 320px; height: 180px; float: left" @click="select = item.id">
                <img :src="item.url" alt style="width: 100%; height: 100%" />
                <div style="float: right; position: relative; top: -180px" v-if="select === item.id">
                    <icon name="pitch-on" scale="25" width="25"></icon>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align: right !important">
            <el-button @click="setBack(false)">取 消</el-button>
            <el-button type="primary" @click="setBack(true)">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    getAllBackgroundFrontDesk
} from '@/api/background'
import {
    detailedInformation,
    updatePersonInfo
} from '@/api/active-user'
export default {
    data() {
        return {
            select: null,
            centerDialogVisible: false,
            backs: [],
            activeBack: null,
            isOpenBack: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        isOpenBack(newVal) {
            if (newVal) this.select = null
        },
    },
    created() {
        this.init()
    },
    mounted() {
        this.setBacks()
    },
    methods: {
        async init() {
            const {
                data: res
            } = await detailedInformation()
            this.isOpenBack = Boolean(res.code === 200 && res.data && res.data.customBackground)
            if (this.isOpenBack) {
                this.select = res.data.customBackground
            }
        },
        async setBack(isSet) {
            this.centerDialogVisible = false
            if (isSet) {
                this.select = this.isOpenBack ? this.select : null
                const data = await updatePersonInfo({
                    customBackground: this.select ? this.select : 0,
                })
                if (data.code === 200) {
                    this.$store.commit('changeBack', !this.$store.state.isChangeBack)
                } else this.$message.error(data.message)
            } else {
                this.select = this.activeBack
            }
        },
        async setBacks() {
            const data = await getAllBackgroundFrontDesk(1, 1000)
            if (data.code === 200) {
                this.backs = data.data.records
            } else this.$message.error(data.message)
            this.update = !this.update
        },
    },
}
</script>

<style scoped>
.changeBackBtn {
    padding: 10px 14px;
}

.changeBackSvg {
    fill: white;
}

.backSmall {
    margin: 5px;
    padding: 5px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
}
</style><style>
.login-change_back .el-dialog {
    text-align: left;
}

.login-change_back .el-dialog__header {
    text-align: center;
}
</style>
