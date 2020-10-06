<template>
<div class="siae-resource">
    <el-container>
        <el-header>
            <div class="content" :style="{width}">
                <span style="font-size:25px" @click="upOneLevel()">资料下载</span>
                <div class="search" ref="search" :style="{width:(searchWidth+25)+'px'}">
                    <input v-model="searchData" type="text" placeholder="请输入资源名称" :style="{width:searchWidth+'px'}" @keypress.enter="setResource(1)" />
                    <span @click="setResource(1)">
                        <icon name="search" ref="search-icon" scale="20" width="20"></icon>
                    </span>
                </div>
            </div>
        </el-header>
        <el-main>
            <siae-loading :isLoading="isOpenPageLoading" v-if="isOpenPageLoading"></siae-loading>
            <div v-else class="content" ref="main-content" :style="{width}">
                <tag-page :list="sort" @tagClick="tagClick"></tag-page>
                <resource-list :resource="resource.records" @download="download"></resource-list>
                <siae-paing :total="resource.total" :pageSize="resource.size" :currentPage="resource.current" :btnCount="3" @pageChange="setResource"></siae-paing>
            </div>
        </el-main>
    </el-container>
</div>
</template>

<script>
import SiaeLoading from '@/components/PageLoading/SiaeLoading'
import SiaePaing from '@/components/SiaePaing'
import TagPage from '@/components/TagPage'
import ResourceList from './components/ResourceList'
import {
    getActiveUserInfo
} from '@/api/active-user'
import {
    getResourceSort,
    getAllResource,
    download
} from '@/api/resource'
export default {
    components: {
        SiaePaing,
        TagPage,
        SiaeLoading,
        ResourceList
    },
    data() {
        return {
            resource: {},
            sort: [],
            myId: null,
            activeSortId: 0,
            searchData: '',
            isOpenPageLoading: false,
            current: 1,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '97%' : '65%'
        },
        searchWidth() {
            return this.size.isSmallSize ? 115 : 415
        },
    },
    watch: {
        $route(newVal) {
            //监听路由，检测是否展示详情
        },
        searchData(newVal) {
            if (!newVal) this.setResource(1)
        },
    },
    created() {
        this.setMyId()
        this.setSort()
        this.isOpenPageLoading = true
    },
    methods: {
        async setMyId() {
            const {
                data
            } = await getActiveUserInfo()
            if (data.code === 200) {
                this.myId = data.data.id
                // this.setResource()
            }
        },
        async setResource(current) {
            this.current = current
            const data = await getAllResource(current, 6, this.activeSortId, this.searchData)
            if (data.code === 200) {
                this.resource = data.data
            } else this.resource = {
                records: []
            }
            setTimeout(() => {
                this.isOpenPageLoading = false
            }, 500)
        },
        async setSort() {
            const data = await getResourceSort()
            if (data.code === 200) {
                this.sort = data.data.records
                this.activeSortId = this.sort[0].id
            } else this.$message.error(data.message)
            this.setResource()
        },
        tagClick(id) {
            this.activeSortId = id
            this.setResource(1)
        },
        async download(row) {
            const data = await download(row.id)
            if (data.code !== 200) {
                this.$message.error(data.message)
                return
            }
            const link = document.createElement('a')
            link.href = data.data
            link.download = `${row.resourceName}`
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.setResource(this.current)
        },
    },
}
</script>

<style lang="scss">
.siae-resource {
    .el-container {
        .el-header {
            color: white;
            display: flex;
            align-items: center;
        }

        .el-main {
            background-color: white;
        }

        .content {
            margin: auto;
            min-height: 300px;
        }
    }

    .search {
        border: 1px solid #999999;
        border-radius: 15px;
        padding: 3px 10px;
        float: right;
        width: 40%;

        input {
            background: none;
            border: none;
            color: #999999;
        }
    }

    .search-data_box {
        border-bottom: 1.2px solid #e0e0e0;
        text-align: center;
        padding: 10px 0;
    }

    .search-text {
        padding: 3px 10px;
    }
}
</style>
