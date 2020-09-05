<template>
<div class="notice_list">
    <ul class="notice">
        <li class="notice-item" v-for="(item,index) in notice" :key="item.id" @click="itemClick(item.id,index)">
            <el-row :gutter="24">
                <el-col :lg="20" :sm="24">
                    <h3 class="notice-item_title">
                        <span>
                            <el-tag size="mini" v-if="item.top!==0" :type="item.tagType" effect="plain">{{ item.tagLabel }}</el-tag>
                        </span>
                        <span>{{item.title}}</span>
                    </h3>
                    <p class="notice-item_content" v-html="item.text"></p>
                    <div class="notice-item_footer">
                        <p v-if="item.member">
                            <span>
                                <img :src="item.member.avatarUrl" height="30px" width="30px" style="border-radius:50%" alt />
                            </span>
                            <span>{{item.member.memberName}}</span>
                        </p>
                        <p>
                            <span>
                                <icon name="time" scale="14" width="14"></icon>
                                {{item.deplDate|dataFormatter}}
                            </span>
                            <span>
                                <icon name="footer" scale="15" width="15"></icon>
                                {{item.count}}
                            </span>
                        </p>
                    </div>
                </el-col>
                <el-col :lg="4" :sm="24" style="text-align:right;">
                    <div style="height:150px">
                        <img :src="item.cover" style="width: 100%;height: 100%;border-radius: 5px;object-fit: cover;" class="cover" />
                    </div>
                </el-col>
            </el-row>
        </li>
    </ul>
</div>
</template>

<script>
import {
    dataFormatter
} from '@/filters'
export default {
    props: {
        notice: {
            type: Array,
            require: true,
        },
    },
    data() {
        return {}
    },
    mounted() {
        console.log(this.notice)
    },
    methods: {
        itemClick(id, index) {
            this.$emit('itemClick', id, index)
        },
    },
    filters: {
        dataFormatter,
    },
}
</script>

<style>
.notice_list .notice {
    list-style: none;
}

.notice_list .notice-item {
    padding: 10px 15px;
    margin: 15px 0;
    transition: all 0.5s;
    border-bottom: 1px dashed #aaaaaa;
}

.notice_list .notice-item_footer {
    color: #666666;
    font-size: 13px;
}

.notice_list .notice-item_footer p {
    display: flex;
    align-items: center;
}

.notice_list .notice-item_footer span {
    margin: 0 5px;
}

.notice-item:hover .notice-item_title span:nth-child(2) {
    border-bottom: 2px solid #666666;
}

.notice-item:hover .cover {
    transform: scale(1.02);
}

.notice_list .notice-item_content {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>
