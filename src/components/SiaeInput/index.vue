<template>
<div :class="{'isfocus':value||isFocus}" class="siae-input" :style="{'width':width+'%','height':height+'px'}">
    <input class="input" :type="inputType" :value="value" @change="$emit('change', $event.target.value)" @focus="isFocus=true" @blur="isFocus=false" />
    <label :class="{'input_label_up':value||isFocus}" class="input_label" @click="labelClick($event)">
        <span>{{label}}</span>
    </label>
    <div v-if="lock" class="lock" style="color:#2c2c2c">
        <span :key="inputType" v-if="inputType==='password'" @click="inputType='text'">
            <icon name="lock" scale="20" width="20"></icon>
        </span>
        <span :key="inputType" v-if="inputType==='text'" @click="inputType='password'">
            <icon name="unlocking" scale="20" width="20"></icon>
        </span>
    </div>
</div>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: {
            type: String,
            require: true,
        },
        label: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            require: true,
            validator: function (value) {
                return ['text', 'textarea', 'password'].indexOf(value) !== -1
            },
        },
        lock: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: 100,
            validator: function (value) {
                return value <= 100
            },
        },
        height: {
            type: Number,
            default: 40,
        },
    },
    data() {
        return {
            inputType: null,
            isFocus: false,
        }
    },
    watch: {
        value(newVal) {
            console.log(newVal)
        },
    },
    mounted() {
        this.inputType = this.type
    },
    methods: {
        labelClick(e) {
            e.path.forEach((item) => {
                if (item.classList && item.classList.contains('siae-input')) {
                    item.children[0].focus()
                    return
                }
            })
        },
    },
}
</script>

<style>
</style><style lang="scss">
.isfocus {
    border-color: #409eff !important;
}

.siae-input {
    position: relative;
    border: 1px solid #e0e0e0;
    color: #999999;
    background: white;
    border-radius: 5px;
    padding: 0 10px;
    transition: all 0.5s;
    display: inline-block;
    box-sizing: border-box;

    .input_label {
        position: absolute;
        top: 0;
        bottom: 0px;
        left: 10px;
        margin: auto;
        color: #cccccc;
        transition: all 0.5s;

        height: 40px;
    }

    .input_label_up {
        margin: 0;
        top: -20px;
        bottom: 0;
        left: 15px;
        color: #409eff;
        font-size: 12px;
        background: none;
    }

    .input_label_up span {
        background-color: white;
        padding: 0 3px;
    }

    .input {
        display: block;
        height: 100% !important;
        border: none;
        outline: none;
        background: none;
    }

    .lock {
        position: absolute;
        right: 10px;
        top: 0;
    }
}
</style>
