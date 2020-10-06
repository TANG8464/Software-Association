<template>
<el-form :model="form" status-icon ref="form" label-width="100px" class="demo-form" label-position="left" :rules="rules">
    <el-form-item label="ID" prop="memberID" :rules="[{ required: true, message: '成员号不能为空' }]">
        <el-input @change="$emit('update:scoreForm', form)" type="text" v-model="form.memberID" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="考核名称" prop="testName" :rules="[{ required: true, message: '考核名称不能为空' }]">
        <el-input @change="$emit('update:scoreForm', form)" type="text" v-model="form.testName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="考核时间">
        <el-date-picker v-model="date" type="datetime" placeholder="选择考核时间" style="width: 100%"></el-date-picker>
    </el-form-item>
    <el-form-item label="成绩" prop="score">
        <el-input @change="$emit('update:scoreForm', form)" type="text" v-model.number="form.score" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
        <el-input @change="$emit('update:scoreForm', form)" type="textarea" :rows="5" resize="none" v-model="form.remark"></el-input>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    props: {
        scoreForm: {
            type: Object,
            require: true,
        },
        datetime: {
            type: Date,
            require: true,
        },
    },
    data() {
        const validateScore = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入成绩'))
            } else {
                if (value < 0 && value > 100) {
                    callback(new Error('成绩需在0-100之间'))
                }
                callback()
            }
        }
        return {
            form: {
                memberID: null,
                remark: '',
                score: null,
                testDateTimeStamp: null,
                testName: null,
            },
            date: null,
            rules: {
                score: [{
                    validator: validateScore,
                    trigger: 'blur',
                }, ],
            },
        }
    },
    watch: {
        scoreForm(newVal) {
            this.form = newVal
        },
        form(newVal) {
            this.$emit('update:scoreForm', newVal)
        },
        datetime(newVal) {
            this.date = newVal
        },
        date(newVal) {
            this.$emit('update:datetime', newVal)
        },
    },
    mounted() {
        this.form = this.scoreForm
        this.date = this.datetime
    },
    methods: {
        resetForm() {
            this.$refs.form.resetFields()
            this.date = null
        },
    },
}
</script>
