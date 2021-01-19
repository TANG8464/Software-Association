<template>
<div class="my-experience">
    <ul v-if="JSON.stringify(myExperience)!=='{}'">
        <li v-for="(item,key) of myExperience" :key="key">
            <div style="font-size:16px">{{key}}</div>
            <span v-for="children of item" :key="children.id">
                {{children.experienceDes}}
            </span>
        </li>
    </ul>
    <span v-else style="text-align:center;">
        <p>
            <icon name='null' scale='50' width='50'></icon> 暂无经历
        </p>
    </span>
    <span class="color-gray">如有错误，请联系管理员更改</span>
</div>
</template>

<script>
import {
    searchMemberExperience
} from '@/api/member/experience'
import {
    getActiveUserInfo
} from '@/api/active-user'
export default {
    data() {
        return {
            myExperience: {},
        }
    },
    mounted() {
        this.searchMemberExperience()
    },
    methods: {
        async searchMemberExperience() {
            const {
                data: myInfo
            } = await getActiveUserInfo()
            if (myInfo.code === 200) {
                const myExperience = await searchMemberExperience(myInfo.data.id)
                this.myExperience = myExperience.data.experienceMap
            }
        },
    },
}
</script>
