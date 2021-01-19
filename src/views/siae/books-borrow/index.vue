<template>
  <div class="siae-books">
    <el-container>
      <el-header>
        <div class="content" :style="{ width }">
          <span style="font-size: 25px" @click="upOneLevel()">图书借阅</span>
          <div class="search" ref="search" :style="{ width: searchWidth + 25 + 'px' }">
            <input
              v-model="searchData"
              type="text"
              placeholder="请输入图书名称"
              :style="{ width: searchWidth + 'px' }"
              @keypress.enter="setBooks(1)"
            />
            <span @click="setBooks(1)">
              <icon name="search" ref="search-icon" scale="20" width="20"></icon>
            </span>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="content" ref="main-content" :style="{ width, height: size.maxH - 180 + 'px' }">
          <siae-loading :isLoading="isOpenPageLoading" v-if="isOpenPageLoading"></siae-loading>
          <div v-else>
            <tag-page :list="sort" @tagClick="tagClick"></tag-page>
            <book-list :books="books.records" @backClick="backClick"></book-list>
            <siae-paing
              :total="books.total"
              :pageSize="books.size"
              :currentPage="books.current"
              :btnCount="3"
              @pageChange="setBooks"
            ></siae-paing>
            <my-books
              :isOpen.sync="isOpenMyBooks"
              :myBooks="myBooks"
              @backClick="backClick"
            ></my-books>
          </div>
        </div>
      </el-main>
      <span class="bookcase">
        <span @click="isOpenMyBooks = true">
          <icon name="bookcase" scale="40" width="40"></icon>
        </span>
        <span>{{ notReturnLength }}</span>
      </span>
    </el-container>
  </div>
</template>

<script>
import SiaeLoading from '@/components/PageLoading/SiaeLoading'
import BookList from './components/BookList'
import MyBooks from './components/MyBooks'
import SiaePaing from '@/components/SiaePaing'
import TagPage from '@/components/TagPage'
import { getAllBooks } from '@/api/book'
import { getAllCategory } from '@/api/book/category'
import { memberBookBorrow, bookReturn, borrowSearch } from '@/api/book/borrow'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  components: {
    BookList,
    SiaePaing,
    TagPage,
    MyBooks,
    SiaeLoading,
  },
  data() {
    return {
      books: {},
      sort: [],
      myBooks: {
        returned: [],
        notReturn: [],
      },
      myId: null,
      activeSortId: 0,
      searchData: '',
      isOpenPageLoading: false,
      isOpenMyBooks: false,
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
      return this.size.isSmallSize ? 110 : 415
    },
    notReturnLength() {
      return this.myBooks.notReturn.length >= 10
        ? this.myBooks.notReturn.length
        : '0' + this.myBooks.notReturn.length
    },
  },
  watch: {
    $route(newVal) {
      //监听路由，检测是否展示详情
    },
    searchData(newVal) {
      if (!newVal) this.setBooks(1)
    },
  },
  created() {
    this.setMyId()
    this.setSort()
    this.isOpenPageLoading = true
  },
  methods: {
    async setMyId() {
      const { data } = await getActiveUserInfo()
      if (data.code === 200) {
        this.myId = data.data.id
        this.setMyBooks()
      }
    },
    async setBooks(current) {
      this.current = current
      const data = await getAllBooks({
        author: '',
        bookCategoryID: this.activeSortId,
        bookName: this.searchData,
        curPage: current,
        flag: -1,
        size: 8,
      })
      if (data.code === 200) {
        this.books = data.data
      } else
        this.books = {
          records: [],
        }
      setTimeout(() => {
        this.isOpenPageLoading = false
      }, 500)
    },
    async setSort() {
      const data = await getAllCategory()
      if (data.code === 200) {
        this.sort = data.data
        this.activeSortId = this.sort[0].id
        this.setBooks(1)
      } else this.$message.error(data.message)
    },
    async setMyBooks() {
      const returnedData = await borrowSearch({
        flag: 1,
        memberId: this.myId,
        size: 1000,
      })
      const notReturnData = await borrowSearch({
        flag: 2,
        memberId: this.myId,
        size: 1000,
      })
      const returnedRecords = returnedData.data ? returnedData.data.records : []
      const notReturnRecords = notReturnData.data ? notReturnData.data.records : []

      if (returnedData.code === 200) {
        let returned = []
        returnedRecords.forEach((item) => {
          returned.push(item.book)
        })
        this.myBooks.returned = returned
      }
      if (notReturnData.code === 200) {
        let notReturn = []
        notReturnRecords.forEach((item) => {
          notReturn.push(
            Object.assign(item.book, {
              isNotReturn: true,
              notReturnId: item.id,
            })
          )
        })
        this.myBooks.notReturn = notReturn
      }
    },
    tagClick(id) {
      this.activeSortId = id
      this.setBooks(1)
    },
    async backClick(bookId) {
      let data, msg
      if (bookId) {
        data = await memberBookBorrow({
          bookId,
        })
        msg = '借书成功，看完后请尽快归还'
        if (data.code === 200) {
          this.$message.success(msg)
          this.setBooks(this.current)
          this.setMyBooks()
        } else this.$message.error(data.message)
      }
    },
  },
}
</script>

<style>
.siae-books .el-container .el-header {
  color: white;
  display: flex;
  align-items: center;
}

.siae-books .el-container .el-main {
  background-color: white;
  min-height: 600px;
}

.siae-books .el-container .content {
  margin: auto;
  position: relative;
}

.siae-books .search {
  border: 1px solid #999999;
  border-radius: 15px;
  padding: 3px 10px;
  float: right;
  width: 40%;
}

.siae-books .search input {
  background: none;
  border: none;
  color: #d2d2d2;
}

.siae-books .top .plane .icon-top {
  transform: rotate(180deg);
}

.siae-books .top .icon-cloud2 {
  position: relative;
  top: 10px;
  left: 5px;
}

.siae-books .top .cloud {
  position: absolute;
  animation: slide 1s infinite;
}

@keyframes slide {
  0% {
    top: 30px;
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    top: 80px;
  }
}

.siae-books .search-data_box {
  border-bottom: 1.2px solid #e0e0e0;
  text-align: center;
  padding: 10px 0;
}

.siae-books .search-text {
  padding: 3px 10px;
}

.siae-books .bookcase {
  position: absolute;
  right: 100px;
  bottom: 100px;
  border-bottom: 1px solid #797979;
}
input::-webkit-input-placeholder {
  color: #444444;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #444444;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #444444;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #444444;
}
</style>
