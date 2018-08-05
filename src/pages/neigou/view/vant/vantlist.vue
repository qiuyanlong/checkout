<template>
    <div class="vant">
        <van-cell-group>
            <router-link :to="{name:'button'}"><van-cell title="Button 按钮" is-link /></router-link> 
            <router-link :to="{name:'cell'}"><van-cell title="Cell 单元格" is-link /></router-link> 
            <router-link :to="{name:'collapse'}"><van-cell title="Collapse 折叠面板" is-link /></router-link> 
            <router-link :to="{name:'goodsAction'}">
                <van-cell is-link>
                    <template slot="title">
                        <span class="van-cell-text">GoodsAction 商品页行动点</span>
                        <van-icon class="cell-icon" name="edit-data" />
                    </template>
                </van-cell>
            </router-link> 
            <router-link :to="{name:'loading'}"><van-cell title="Loading 加载" is-link /></router-link> 
            <router-link :to="{name:'pagination'}"><van-cell title="Pagination 分页" is-link /></router-link> 
            <router-link :to="{name:'popup'}"><van-cell title="Popup 弹出层" is-link /></router-link> 
            <router-link :to="{name:'stepper'}"><van-cell title="Stepper 步进器" is-link /></router-link> 
            <router-link :to="{name:'form'}"><van-cell title="表单组件" is-link /></router-link> 
            <router-link :to="{name:'dialog'}"><van-cell title="Dialog 弹出框" is-link /></router-link> 
            <router-link :to="{name:'toast'}"><van-cell title="Toast 轻提示" is-link /></router-link> 
            <router-link :to="{name:'swipe'}"><van-cell title="Swipe 轮播" is-link /></router-link> 
            <router-link :to="{name:'tab'}"><van-cell title="Tab 标签页" is-link /></router-link> 
            <router-link :to="{name:'tag'}"><van-cell title="Tag 标记" is-link /></router-link> 
            <router-link :to="{name:'steps'}"><van-cell title="Steps 步骤条" is-link /></router-link> 
            <router-link :to="{name:'tabbar'}"><van-cell title="Tabbar 标签栏" is-link /></router-link> 
            
            


            <router-link :to="{name:'badge'}"><van-cell title="Badge 徽章" is-link /></router-link> 
            <!-- <router-link :to="{name:'circle'}">
                <van-cell is-link>
                    <template slot="title">
                        <span class="van-cell-text">Circle 环形进度条</span>
                        <van-tag type="danger">不能使用</van-tag>
                    </template>
                </van-cell>
            </router-link>  -->
            <router-link :to="{name:'icon'}"><van-cell title="Icon 图标" is-link /></router-link> 
            <router-link :to="{name:'imagePreview'}">
                <van-cell is-link>
                    <template slot="title">
                        <span class="van-cell-text">ImagePreview 图片预览</span>
                        <van-icon class="cell-icon" name="edit-data" />
                    </template>
                </van-cell>
            </router-link> 
            <router-link :to="{name:'lazyload'}">
                <van-cell is-link>
                    <template slot="title">
                        <span class="van-cell-text">Lazyload 图片懒加载</span>
                        <van-icon class="cell-icon" name="edit-data" />
                    </template>
                </van-cell>
            </router-link> 
            <router-link :to="{name:'datetimePicker'}"><van-cell title="DatetimePicker 时间选择" is-link /></router-link> 
            
            <router-link :to="{name:'addressList'}">
                <van-cell is-link>
                    <template slot="title">
                        <span class="van-cell-text">AddressList 地址列表</span>
                        <van-icon class="cell-icon" name="edit-data" />
                    </template>
                </van-cell>
            </router-link> 
            
            

            <router-link :to="{name:'progress'}"><van-cell title="Progress 进度条" is-link /></router-link> 
            <router-link :to="{name:'rate'}"><van-cell title="Rate 评分" is-link /></router-link> 
            <router-link :to="{name:'slider'}"><van-cell title="Slider 滑块" is-link /></router-link> 
            
            
            



            <!-- <router-link :to="{name:'popup'}"><van-cell title="Popup 弹出层" is-link /></router-link> 
            <router-link :to="{name:'popup'}"><van-cell title="Popup 弹出层" is-link /></router-link> 
            <router-link :to="{name:'popup'}"><van-cell title="Popup 弹出层" is-link /></router-link> 
            <router-link :to="{name:'popup'}"><van-cell title="Popup 弹出层" is-link /></router-link>  -->


        
            <router-link :to="{name:'selectAddrDemo'}"><van-cell title="selectAddr Demo" is-link /></router-link> 
            <router-link :to="{name:'locationAddr'}"><van-cell title="locationAddr 定位地址" is-link /></router-link> 
            <!-- <router-link :to="{name:'lazyload'}"><van-cell title="Lazyload 图片懒加载" is-link /></router-link>  -->
        </van-cell-group>
    </div>
</template>


<script>
import './css/vant.scss'
export default {
    name: "Vant",
    data() {
        return {
            
        };
    },
    mounted() {

    },
    methods:{
        
    },
    components: {  },
    computed:{

    }
};
</script>
<style scoped lang="scss">
$pole:75;
.cell-icon{
    color:#38f ;
    font-size: 32rem/$pole;
}
</style>


