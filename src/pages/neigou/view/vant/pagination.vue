<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>数字按钮72*80 上一页 下一页 文案可修改</h2>
            <h2>基础用法</h2>
            <van-pagination 
            v-model="currentPage1" 
            :total-items="24" 
            :items-per-page="5"
            />
            <h2>简单模式</h2>
            <van-pagination 
  v-model="currentPage2" 
  :page-count="12"
  mode="simple" 
/>
<h2>显示省略号</h2>
<van-pagination 
  v-model="currentPage3" 
  :total-items="125" 
  :show-page-size="3" 
  force-ellipses
/>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Pagination 分页",
            currentPage1:1,
            currentPage2:1,
            currentPage3:1,
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        
    },
    components: { },
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;

</style>


