
import config from '@/config/config'



const VantList=resolve=> require(['../view/vant/vantlist'],resolve)
const Button=resolve=> require(['../view/vant/button'],resolve)
const Badge=resolve=> require(['../view/vant/badge'],resolve)
const Cell=resolve=> require(['../view/vant/cell'],resolve)
const Circle=resolve=> require(['../view/vant/circle'],resolve)
const Collapse=resolve=> require(['../view/vant/collapse'],resolve)
const Icon=resolve=> require(['../view/vant/icon'],resolve)
const ImagePreview=resolve=> require(['../view/vant/imagePreview'],resolve)
const Lazyload=resolve=> require(['../view/vant/lazyload'],resolve)
const DatetimePicker=resolve=> require(['../view/vant/datetimePicker'],resolve)
const Switch = resolve => require(['../view/vant/switch'],resolve)
const AddressList = resolve => require(['../view/vant/addressList'],resolve)
const GoodsAction = resolve => require(['../view/vant/goodsAction'],resolve)
const Loading = resolve => require(['../view/vant/loading'],resolve)
const SelectAddrDemo = resolve => require(['../view/vant/selectAddrDemo'],resolve)
const Pagination = resolve => require(['../view/vant/pagination'],resolve)
const Popup = resolve => require(['../view/vant/popup'],resolve)

const Progress = resolve => require(['../view/vant/progress'],resolve)
const Rate = resolve => require(['../view/vant/rate'],resolve)
const Slider = resolve => require(['../view/vant/slider'],resolve)
const Stepper = resolve => require(['../view/vant/stepper'],resolve)
const Steps = resolve => require(['../view/vant/steps'],resolve)
const Swipe = resolve => require(['../view/vant/swipe'],resolve)
const Tab = resolve => require(['../view/vant/tab'],resolve)
const Tabbar = resolve => require(['../view/vant/tabbar'],resolve)
const Tag = resolve => require(['../view/vant/tag'],resolve)

const Form=resolve => require(['../view/vant/form'],resolve)
const Dialog=resolve => require(['../view/vant/dialog'],resolve)
const Toast=resolve => require(['../view/vant/toast'],resolve)

const LocationAddr=resolve => require(['../view/vant/locationAddr'],resolve)

export default [
    {
        path: config.neigouFallbackPath+'vantlist.html',
        name: 'vantlist',
        component: VantList,
    },
    {
        name:'button',
        path:config.neigouFallbackPath+'vantButton.html',
        component:Button
    },
    {
        name:'badge',
        path:config.neigouFallbackPath+'badge.html',
        component:Badge
    },
    {
        name:'cell',
        path:config.neigouFallbackPath+'cell.html',
        component:Cell
    },
    {
        name:'circle',
        path:config.neigouFallbackPath+'circle.html',
        component:Circle
    },
    {
        name:'collapse',
        path:config.neigouFallbackPath+'collapse.html',
        component:Collapse
    },
    {
        name:'icon',
        path:config.neigouFallbackPath+'icon.html',
        component:Icon
    },
    {
        name:'imagePreview',
        path:config.neigouFallbackPath+'imagePreview.html',
        component:ImagePreview
    },
    {
        name:'lazyload',
        path:config.neigouFallbackPath+'lazyload.html',
        component:Lazyload
    },
    {
        name:'datetimePicker',
        path:config.neigouFallbackPath+'datetimePicker.html',
        component:DatetimePicker
    },
    {
        name:'switch',
        path: config.neigouFallbackPath +'switch.html',
        component: Switch
    },
    {
        name:'addressList',
        path: config.neigouFallbackPath +'addressList.html',
        component: AddressList
    },
    {
        name:'goodsAction',
        path: config.neigouFallbackPath +'goodsAction.html',
        component: GoodsAction
    },
    {
        name:'loading',
        path: config.neigouFallbackPath +'loading.html',
        component: Loading
    },
    {
        name:'selectAddrDemo',
        path: config.neigouFallbackPath +'selectAddrDemo.html',
        component: SelectAddrDemo
    },
    {
        name:'pagination',
        path: config.neigouFallbackPath +'pagination.html',
        component: Pagination
    },
    {
        name:'popup',
        path: config.neigouFallbackPath +'popup.html',
        component: Popup
    },

    {
        name:'progress',
        path: config.neigouFallbackPath +'progress.html',
        component: Progress
    },
    {
        name:'rate',
        path: config.neigouFallbackPath +'rate.html',
        component: Rate
    },
    {
        name:'slider',
        path: config.neigouFallbackPath +'slider.html',
        component: Slider
    },
    {
        name:'stepper',
        path: config.neigouFallbackPath +'stepper.html',
        component: Stepper
    },
    {
        name:'steps',
        path: config.neigouFallbackPath +'steps.html',
        component: Steps
    },
    {
        name:'swipe',
        path: config.neigouFallbackPath +'swipe.html',
        component: Swipe
    },
    {
        name:'tab',
        path: config.neigouFallbackPath +'tab.html',
        component: Tab
    },
    {
        name:'tabbar',
        path: config.neigouFallbackPath +'tabbar.html',
        component: Tabbar
    },
    {
        name:'tag',
        path: config.neigouFallbackPath +'tag.html',
        component: Tag
    },
    {
        name:'form',
        path: config.neigouFallbackPath +'form.html',
        component: Form
    },
    {
        name:'dialog',
        path: config.neigouFallbackPath +'dialog.html',
        component: Dialog
    },
    {
        name:'toast',
        path: config.neigouFallbackPath +'toast.html',
        component: Toast
    },
    {
        name:'locationAddr',
        path: config.neigouFallbackPath +'locationAddr.html',
        component: LocationAddr
    },
    
]