<template>
<div class="book-list" ref="book-list" style="min-height:500px">
    <el-row :gutter="24" class="book" style="margin:0;overflow:auto;">
        <el-col class="book-item" :lg="5" :sm="8" :xs="12" v-for="(item,index) in bookList" :key="index">
            <div class="book-cover_box">
                <div class="page">
                    <div class="page-front">
                        <img class="book-cover" :src="item.imageUrl" alt />
                    </div>
                    <div class="page-back">
                        <div v-if="item.flag===0||item.isNotReturn">
                            <div v-if="item.isNotReturn">
                                <el-button round size="small" style="width:100px" @click="backClick(item)">还书</el-button>
                            </div>
                            <div v-else style="font-size:14px">
                                <p style="margin:5px 0">作者:{{item.author}}</p>
                                <p style="margin:5px 0">库存:{{item.count}}</p>
                                <el-button round size="small" style="width:100px" @click="backClick(item)">借书</el-button>
                            </div>
                        </div>
                        <div v-else>{{item.tagLabel}}</div>
                    </div>
                </div>
            </div>
            <div style="margin:5px">
                <p class="bookName" style="margin:0 3px">
                    <el-tag size="mini" :type="item.tagType" effect="plain">{{ item.tagLabel }}</el-tag>
                    <el-tooltip class="item" effect="dark" :content="item.bookName" placement="bottom">
                        <span>{{item.bookName}}</span>
                    </el-tooltip>
                </p>
            </div>
        </el-col>
    </el-row>
    <div v-if="bookList&&bookList.length===0" class="null">
        <icon name="null" scale="50" width="50"></icon>
        <span>什么也没有</span>
    </div>
</div>
</template>

<script>
export default {
    props: {
        books: {
            type: Array,
            require: true,
        },
    },
    data() {
        return {
            cut: 1,
            bookList: []
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        books(newVal) {
            this.$refs['book-list'].style.opacity = 0;
            this.$refs['book-list'].style.transform = 'translateX(-50px)';
            setTimeout(() => {
                this.bookList = newVal
            }, 300)
        },
        bookList() {
            this.$refs['book-list'].style.opacity = 1;
            this.$refs['book-list'].style.transform = 'translateX(0)';
        }
    },
    mounted() {
        this.bookList = this.books
    },
    methods: {
        backClick({
            flag,
            id,
            isNotReturn,
            tagLabel
        }) {
            if (isNotReturn) {
                this.$message({
                    message: '还书需要联系管理员哦~',
                    customClass: 'siae-msg',
                })
            } else if (flag === 0) {
                this.$emit('backClick', id)
            } else {
                this.$message.error(`书籍${tagLabel}`)
            }
        },
    },
}
</script>

<style lang="scss">
.book-list {
    transition: all 0.3s;

    .book-item {
        display: inline;
        margin: 0px 20px;
    }

    .book-cover {
        width: 100%;
        height: 100%;
    }

    .book-cover_box {
        min-width: 150px;
        min-height: 200px;
    }

    .page {
        transition: all 0.5s;
        box-shadow: 0px 0px 10px 1px #999999;
        width: 150px;
        height: 200px;
        position: absolute;
        transform-style: preserve-3d;
    }

    .book-cover_box:hover .page {
        transform: rotateY(-180deg);
    }

    .page-back {
        cursor: pointer;
        color: rgba(41, 42, 52, 0.82);
        font-size: 25px;
    }

    .page-back div {
        text-align: center;
        width: 100%;
    }

    .page-front {
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        transition: all 1s;
    }

    .page:hover .page-back {
        z-index: 2;
    }

    .page-back {
        width: 100%;
        height: 100%;
        background-color: white;
        transition: all 0.5s;
        position: absolute;
        transform: rotateY(-180deg);
        display: flex;
        align-items: center;
    }

    .page-back:active {
        background-image: radial-gradient(circle, transparent 10%, #fff 10%);
        background-color: rgb(168, 168, 168);
        transition: 0s;
    }

    .null {
        text-align: center;
        line-height: 500px;
        color: #666666;
        transition: all 0.5s;
    }

    .bookName {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
