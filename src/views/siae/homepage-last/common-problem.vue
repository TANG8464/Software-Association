<template>
  <div class="common-problem">
    <h1>常见问题</h1>
    <small
      >针对于大家对协会的了解可能不深，学长学姐们搜寻了一些常见的问题，并进行回答，如果还有不懂的问题可以
      <el-link type="primary" class="link" @click="$router.push('/homepage-last/contact-us')"
        >联系我们</el-link
      >
    </small>
    <ul class="problem">
      <li class="problem-item" v-for="(item, index) in problemList" :key="index">
        <h3>{{ item.question }}</h3>
        <p>{{ item.answer }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      problemList: [
        {
          question: '软件协会是一个怎样的团体？',
          answer: '软件协会是一个由软件方面兴趣的学生自发组织的学习团体。',
        },
        {
          question: '协会里的人能相互学习？',
          answer: '协会的学长学姐会热心的为大家答疑解难，培养大家自学成才的能力。',
        },
        {
          question: '协会要不要开会？',
          answer: '协会目前对于协会萌新是不需要开会的。',
        },
        {
          question: '一周能有多忙？',
          answer:
            '学长们会定期的让协会萌新超前学到专业知识，一般是周一到周五的晚间辅导和周六的自习。',
        },
        {
          question: '加入协会有什么好处？',
          answer:
            '加入协会的好处有:1.有协会学长辅助教学，答疑。2.可以根据学习近况适当超前学习本专业知识。3.可以有更多的机会实践自己的专业能力。',
        },
        {
          question: '软件协会主要起什么作用？',
          answer: '软件协会作用主要是学生课后时间复习和预习专业知识，交流解决问题。',
        },
        {
          question: '进入协会可以参加比赛吗？',
          answer: '进去协会想要参加比赛，必须本人专业水平够强，只有专业水平过硬的人才能参加比赛。',
        },
        {
          question: '协会对成员的有啥基本要求？',
          answer: '协会成员要勤学好问，刻苦钻研，要有足够的自学和自制能力。',
        },
        {
          question: '如果成绩不好会被踢出协会吗？',
          answer:
            '协会会分几个阶段辅导教学，然后针对性的考核，如果当前阶段学习未取得成效，可能会被踢出协会，但是所有考核面向协会内外学生，所以即使被踢，也可以用自己的能力考进协会。',
        },
        {
          question: '加入协会需要什么要求？',
          answer:
            '要求:软件方面感兴趣的学生，专业知识水平过关，有足够的自制力，然后提交纸质或者电子档申请表，进行面试和笔试，通过者可加入协会。',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.common-problem {
  padding: 0 30px;
  .problem {
    list-style: none;
  }
}
</style>
