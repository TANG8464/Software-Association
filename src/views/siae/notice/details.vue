<template>
<div class="details" v-if="notice">
    <div class="notice-details">
        <h3>{{notice.title}}</h3>
        <p class="author" v-if="notice.member">
            <span>
                <img :src="notice.member.avatarUrl" height="30px" width="30px" style="border-radius:50%" alt />
            </span>
            <span>{{notice.member.memberName}}</span>
        </p>
        <p class="tip">
            <span>
                <icon name="time" scale="14" width="14"></icon>
                {{notice.deplDate|dateFormatter}}
            </span>
            <span>
                <icon name="footer" scale="15" width="15"></icon>
                {{notice.count}}
            </span>
        </p>
        <div class="content" style="min-height:150px;font-size:18px" v-html="notice.content"></div>
        <div class="tag">
            <notice-tag :tag="notice.label"></notice-tag>
        </div>
    </div>
    <notice-cut :otherNotice="otherNotice"></notice-cut>
    <div class="share" :style="{'position': size.isSmallSize?'relative':'absolute','top': size.isSmallSize?0:'150px','left': size.isSmallSize?0:'150px'}">
        <share-other :title="notice.title" :pics="notice.cover"></share-other>
    </div>
</div>
</template>

<script>
import {
    dateFormatter
} from '@/filters'
import {
    receptionSearchNoticeById,
    noticeMaxId
} from '@/api/notice'
import NoticeTag from '@/components/NoticeTag'
import NoticeCut from './components/NoticeCut'
import ShareOther from '@/components/ShareOther'
export default {
    components: {
        NoticeTag,
        NoticeCut,
        ShareOther,
    },
    data() {
        return {
            notice: null,
            otherNotice: [],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        $route() {
            const id = this.$route.query.id
            this.setNotice(id)
        },
    },
    created() {
        const id = this.$route.query.id
        this.setNotice(id)
    },
    methods: {
        async setNotice(id) {
            const data = await receptionSearchNoticeById(id)
            if (data.code === 200) {
                this.notice = data.data
                this.$store.commit('setCurrentTitle', this.notice.title)
                this.otherNotice = []
                if (this.notice.lastId) this.setOtherNotice(this.notice.lastId)
                if (this.notice.nextId) this.setOtherNotice(this.notice.nextId)
            } else this.$message.error(data.message)
        },
        async setOtherNotice(id) {
            const data = await receptionSearchNoticeById(id)
            if (data.code === 200) {
                this.otherNotice.push(data.data)
            } else this.$message.error(data.message)
        },
    },
    filters: {
        dateFormatter,
    },
}
</script>

<style lang="scss">
.notice-details {
    padding: 20px 0;
    font-size: 20px;
    padding-bottom: 40px;
}

.notice-details .author {
    display: flex;
    align-items: center;
    font-size: 16px;
}

.notice-details .author span {
    margin: 0 5px;
}

.notice-details .tip {
    font-size: 14px;
}

.notice-details .tip span {
    margin: 0 5px;
}

.notice-details .el-tag {
    margin: 0 3px;
}

.notice-details .content img {

    max-width: 80%;
    max-height: 50%;
    display: block;
    margin: auto;
}

.notice-details .fr-img-wrap {
    text-align: center;
    display: block;
}

.notice-details .fr-inner {
    display: block;
    text-align: center;
}

a {
    color: #00a1ff;
}
</style>
