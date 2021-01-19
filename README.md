# siae

## Project setup

npm install

## 运行项目

npm run serve

## 关联远程仓库

git remote add origin git@github.com:TANG8464/Software-Association.git

## 推送到主分支

git push origin master

## 安装插件

## icon
npm install vue2-svg-icon --save-dev

### main.js
import Icon from 'vue2-svg-icon/Icon';
Vue.component('icon', Icon);

### 全局使用
<icon name='' scale='' width=''></icon>
注：svg文件必须放在src/assets/svg文件夹下 vue2-svg-icon只在这个目录查询

