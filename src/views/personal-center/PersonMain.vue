<template>
  <div class="person-main">
    <div class="back" :style="{'background':`url(${background})`,height}"></div>
    <div class="content" :style="{'margin':`0 ${margin}`,'margin-top':marginTop}">
      <div class="username-box">
        <span @click="isOpenAvatarInfo=true">
          <personal-avatar :avatarSize="avatarSize"></personal-avatar>
        </span>

        <span
          class="username"
          :style="{'margin-left': (4+size.maxW*0.01)+'px','font-size': (16+size.maxW*0.01)+'px'}"
        >{{activeUser}}</span>
      </div>
      <div style="text-align:right;">
        <el-button plain @click="isOpenUpdate=true">编辑资料</el-button>
      </div>
      <personal-data></personal-data>
    </div>
    <avatar-info :isOpenAvatarInfo.sync="isOpenAvatarInfo"></avatar-info>
    <update-info :isOpenUpdate.sync="isOpenUpdate"></update-info>
  </div>
</template>
<script>
import PersonalAvatar from '@/components/PersonalAvatar'
import PersonalData from './components/PersonalData'
import AvatarInfo from './components/AvatarInfo'
import UpdateInfo from './components/UpdateInfo'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  name: 'personMain',
  components: {
    PersonalAvatar,
    PersonalData,
    AvatarInfo,
    UpdateInfo,
  },
  data() {
    return { isOpenAvatarInfo: false, activeUser: null, isOpenUpdate: false }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    background() {
      return require('@/assets/img/personalCenter/back.jpg')
    },
    height() {
      return this.size.isSmallSize ? '200px' : '400px'
    },
    margin() {
      return this.size.isSmallSize ? '20px' : `${this.size.maxW * 0.2}px`
    },
    marginTop() {
      return this.size.isSmallSize ? '90px' : '250px'
    },
    avatarSize() {
      return this.size.isSmallSize ? 80 : 120
    },
    isChangeMyInfo() {
      return this.$store.state.myInfo
    },
  },
  watch: {
    isChangeMyInfo() {
      this.setActiveUser()
    },
  },
  mounted() {
    this.setActiveUser()
  },
  methods: {
    setActiveUser() {
      getActiveUserInfo().then((res) => {
        this.activeUser = res.data.data.memberName
      })
    },
  },
}
</script>
<style>
.person-main .back {
  position: absolute;
  top: 0;
  margin: 0;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  z-index: -1;
}
.person-main .content .el-avatar {
  /*
    border: 3px solid white;
  */
  box-shadow: rgb(229, 229, 229) 0px 0px 5px 1px;
}
.person-main .content .username-box {
  display: flex;
  align-items: flex-start;
}
.person-main .content .username-box .username {
  color: white;
  text-shadow: rgb(101, 101, 101) 0.1em 0.1em 0.2em;
}
.person-main .content .el-collapse {
  margin-top: 15px;
}
</style>