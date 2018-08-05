<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                适用于入口连接：默认单条 高度90，
                统一个入口列表分割线不是100%，距离左侧30，有图标的情况 文字距离左侧42，距离左侧图标10，图标大小32
                右箭头距离右侧30
            </h2>
        </div>
        <van-cell-group>
            <van-cell title="单元格" value="内容" />
            <van-cell title="单元格" value="内容" label="描述信息" />
        </van-cell-group>
        <van-cell-group>
            <van-cell title="单元格" icon="location" />
        </van-cell-group>
        <van-cell-group>
            <van-cell title="单元格" is-link />
            <van-cell title="单元格" is-link value="内容" />
        </van-cell-group>
        <van-cell-group>
            <van-cell value="内容" icon="shop" is-link>
            <template slot="title">
                <span class="van-cell-text">单元格</span>
                <van-tag type="danger">标签</van-tag>
            </template>
        </van-cell>
        <van-cell title="单元格" icon="location" is-link />
            <van-cell title="单元格">
                <van-icon slot="right-icon" name="search" class="van-cell__right-icon" />
            </van-cell>
        </van-cell-group>
    </div>
</template>
<script>
import './css/vant.scss'
export default {
    data() {
        return {
            name: "Cell 单元格",
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})}
    },
    components: {  },
    computed:{

    }
};
</script>

