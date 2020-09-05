<template>
  <div class="my-books" ref="my-books">
    <header>
      <span class="title" style="transition: all 0.5s;">我借的书</span>
      <span class="close" @click="$emit('update:isOpen',false)">
        <icon name="close" scale="20" width="20"></icon>
      </span>
    </header>
    <aside>
      <p
        class="aside-item"
        :data-active="index===currentIndex"
        v-for="(item,index) in aside"
        :key="index"
        @click="asideListClick(index)"
      >{{item}}</p>
    </aside>
    <main>
      <book-list :books="currentBooks" @backClick="backClick"></book-list>
    </main>
  </div>
</template>
<script>
import BookList from './BookList'
export default {
  components: { BookList },
  props: {
    isOpen: {
      type: Boolean,
      require: true,
    },
    myBooks: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      aside: ['未归还', '已归还'],
      currentIndex: 0,
      currentBooks: [],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    isOpen(newVal) {
      const myBooks = this.$refs['my-books']
      if (newVal) {
        myBooks.style.display = 'block'
        setTimeout(() => {
          if (this.size.isSmallSize) {
            myBooks.setAttribute('data-fullScreen', '')
            myBooks.removeAttribute('data-normalSize')
            myBooks.removeAttribute('data-notShow')
          } else {
            myBooks.setAttribute('data-normalSize', '')
            myBooks.removeAttribute('data-fullScreen')
            myBooks.removeAttribute('data-notShow')
          }
          this.asideListClick(0)
        }, 1)
      } else {
        setTimeout(() => {
          myBooks.style.display = 'none'
        }, 300)
        myBooks.setAttribute('data-notShow', '')
        myBooks.removeAttribute('data-fullScreen')
        myBooks.removeAttribute('data-normalSize')
      }
    },
  },
  mounted() {
    const myBooks = this.$refs['my-books']
    myBooks.style.display = 'none'
  },
  methods: {
    asideListClick(index) {
      console.log(this.myBooks)

      this.currentIndex = index
      if (index === 0) {
        this.currentBooks = this.myBooks.notReturn
      } else {
        this.currentBooks = this.myBooks.returned
      }
    },
    backClick(id, notReturnId) {
      this.$emit('backClick', id, notReturnId)
      setTimeout(() => {
        this.asideListClick(this.currentIndex)
      }, 500)
    },
  },
}
</script>
<style>
.my-books {
  background-color: white;
  position: fixed;
  margin: auto;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px #666666;
  z-index: 100;
  transition: all 0.5s;
  top: 90%;
  left: 90%;
}
.my-books header {
  padding: 10px;
}
.my-books aside {
  padding: 10px;
  text-align: center;
  width: 20%;
  position: absolute;
  border-right: 1px ridge #e0e0e0;
  height: 80%;
}
.my-books .aside-item {
  cursor: pointer;
  transition: all 0.1s;
  border-left: 0px solid #666666;
}
.my-books .aside-item:hover {
  border-width: 1px;
}
.aside-item[data-active] {
  border-left: 3px solid #666666;
}
.my-books main {
  position: absolute;
  left: 21%;
  padding: 20px;
  width: 75%;
  height: 80%;
  overflow: auto;
}
.my-books .title {
  font-weight: 600;
  color: #666666;
  font-size: 20px;
}
.my-books .close {
  color: #999999;
  float: right;
}
.my-books .el-main {
  padding: 0;
}
div[data-fullScreen] {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: all 0.5s;
  opacity: 1;
}
div[data-normalSize] {
  top: 10%;
  left: 15%;
  width: 70%;
  height: 80%;
  min-width: 500px;
  min-height: 500px;
  transition: all 0.5s;
  opacity: 1;
}
div[data-notShow] {
  width: 0;
  height: 0;
  transition: all 0.5s;
  opacity: 0;
}
</style>