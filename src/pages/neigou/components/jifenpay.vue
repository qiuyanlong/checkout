<template>
    <div class="jfp-layer" :class="{'jfp-in':mask}">
        <div class="jfp-backdrop" @click="hide"></div>
        <div class="pay-dialog alertPass-main" :class="{'up':animate}">
            <div class="alertPass-title">
              <h2>支付密码</h2>
            </div>
            <div class="alertPass-centent">
                <div class="alertPass-input clearfix">
                    <i v-for="(item,index) in dianarr" :class="{'ed':index+1 <= mimaarr.length}"></i>
                </div>
                <div class="alertPass-info clearfix">
                    <p class="fl js-passError">{{errorMsg}}</p>
                    <a class="fr" :href="goReback">忘记密码</a>
                </div>
                <div class="alertPass-keyboard">
                    <ul>
                        <li ref="int" v-for="(item,index) in intarr">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="pay-dialog alertPass-main" :class="{'up':animate_nopay}">
            <div class="suo">
                <div class="suo-img"><i></i><a href="javascript:;" @click="hide"></a></div>
                <p class="suo-p">为保证账户安全，请您设置支付密码</p>
                <a :href="goSet" class="suo-btn">立即设置</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dianarr:[0,0,0,0,0,0],
            intarr:[1,2,3,4,5,6,7,8,9,'返回',0,''],
            mask:false,
            animate:false,
            animate_nopay:false,
            mimaarr:[],
            errorMsg:'',
        }
    },
    props:['status'],
    watch:{
        mimaarr(cval){
            if(cval.length == 6){
                this.$emit('getMM',cval.join().replace(/\,/g,''));
            }
        }
    },
    methods:{
        showError(msg){
            this.errorMsg = msg;
        },
        clearEntry(){
            this.mimaarr = []
        },
        hide(){
            let Vm = this
            Vm.mimaarr = []
            Vm.animate = false
            Vm.animate_nopay = false
            Vm.errorMsg = ''
            Vm.$emit('getMM','')
            setTimeout(()=>{
                Vm.mask = !Vm.mask
            },500)
        },
        setEvent(){
            let Vm = this,_x,_y,_targetEl,GetPos = obj => {
                let pos = {}
                pos.x = obj.offsetLeft
                pos.y = obj.offsetTop
                while (obj = obj.offsetParent) {
                    pos.x += obj.offsetLeft;
                    pos.y += obj.offsetTop;
                }
                return pos;
            }
            Vm.$refs.int.forEach(item => {
                item.addEventListener('touchstart',ev=>{
                    ev.target.className = 'down'
                })
                item.addEventListener('touchend', ev => {
                    

                    let el = ev.target
                        ,curx = ev.changedTouches[0].clientX
                        ,cury = ev.changedTouches[0].clientY
                        ,width = el.offsetWidth
                        ,height = el.offsetHeight
                        ,top = GetPos(el).y
                        ,left = GetPos(el).x
                    ev.target.className = ''
                    if(curx >= left && curx <= ( left + width ) && cury >= top && cury <= ( top + height ) ){
                         let num = parseInt( el.innerText )
     
                         if(/[0-9]/.test(num)){
                            //记录密码
                            if(Vm.mimaarr.length >=6) return
                            Vm.mimaarr.push(num)

                        }else{
                            
                            if(el.innerText === ''){
                                //删除密码
                                Vm.mimaarr.pop()
                            }else{
                                //返回
                                Vm.mimaarr = []
                                Vm.hide()
                            }

                        }


                    }

                });
            })
        },
        showPay(){
            let Vm = this
            Vm.mask = !Vm.mask
            setTimeout(()=>{
                Vm.animate = true
            },100)
        },
        showNotPay(){
            let Vm = this
            Vm.mask = !Vm.mask
            setTimeout(()=>{
                Vm.animate_nopay = true
            },100)
        }
    },
    computed:{
        goReback(){
            return `jfsetting.html?operatetype=reset&origincheckout=${encodeURIComponent(window.location.href)}`
        },
        goSet(){
            return `jfsetting.html?operatetype=set&origincheckout=${encodeURIComponent(window.location.href)}`
        }
    },
    components:{},
    beforeCreate(){},
    created(){},
    beforeMount(){},
    mounted(){
        let Vm = this
        Vm.$nextTick(()=>{
            Vm.setEvent()
        })
    },
    beforeDestroy(){},
    destroyed(){},
    updated(){}
}
</script>
<style scoped lang="scss">
    $pole:75;
    .jfp-layer{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: 0 auto;
        z-index: 1050;
        outline: 0;
        display: none;
        overflow: hidden;
        &.jfp-in{
            display:block;
        }
    }
    .jfp-backdrop{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background-color: #000;
        opacity: .5;
        height: 100%;
    }
    .pay-dialog{
        position:absolute;
        left:0;
        bottom:0;
        width:100%;
        background:#fff;
        -webkit-transform:translateY(100%);
        transform:translateY(100%);
        -webkit-transition:transform 0.5s ease-in-out;
        transition:transform 0.5s ease-in-out;
        &.up{
            -webkit-transform:translateY(0);
            transform:translateY(0);
        }
        h1{
            height: 1.33333rem;
            line-height: 1.33333rem;
            text-align: center;
            font-size: 0.4rem;
            color: #ababab;
        }
        .describe{
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
            padding:0 30rem/$pole;
            max-height:690rem/$pole;
            overflow-y:auto;
            h3{
                text-align: left;
                color: #343434;
                font-size: 0.37333rem;
                padding-top: 0.26667rem;
                padding-bottom: 0.26667rem;
            }
            p{
                color: #858585;
                font-size: 0.32rem;
            }
        }
    }
    .alertPass-main{
        .suo{
            position:relative;
            padding-bottom:190rem/$pole;
            .suo-btn{
                position:absolute;
                left:0;
                bottom:0;
                width:100%;
                height:96rem/$pole;
                line-height:96rem/$pole;
                color:#fff;
                font-size:32rem/$pole;
                text-align:center;
                background-color:#44bbff;
                letter-spacing:2rem/$pole;
            }
            .suo-p{
                                color:#5d5d5c;
                font-size:30rem/$pole;
                letter-spacing:1rem/$pole;
                text-align:center;
            }
            .suo-img{
                position:relative;
                padding-top:50rem/$pole;
                padding-bottom:35rem/$pole;
                i{
                    display:block;
                    margin:0 auto;
                    width:120rem/$pole;
                    height:120rem/$pole;
                    background:url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwQTAxRTZGRkU5RDExRTc5OEUwRkVEQ0VBMjZFNTJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwQTAxRTcwRkU5RDExRTc5OEUwRkVEQ0VBMjZFNTJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBBMDFFNkRGRTlEMTFFNzk4RTBGRURDRUEyNkU1MkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBBMDFFNkVGRTlEMTFFNzk4RTBGRURDRUEyNkU1MkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAB4AHgDAREAAhEBAxEB/8QAeQABAAMBAQEAAAAAAAAAAAAAAAECAwUECAEBAQEBAQAAAAAAAAAAAAAAAAECBAMQAAIBAgQDBwMFAQAAAAAAAAABAhEDITESBEFRkWFxoVJTFBUycgWBsdEiM2IRAQEAAgIDAQEAAAAAAAAAAAABEQIDEzFREiFB/9oADAMBAAIRAxEAPwD6pAAAAFJXYrLE1NUyo7s32FwmVW282VEASm1kwLK7NdpMLleN2LzwJdVyuZUAAAAACJSUVj0LIlrGU3LPLkbkZtVAAAAAAAAtGbjllyFhK2jJSWHQxY1KkigACJSUVXoWRLWDbbqzbKAAADC5vbEHRPU+z+T0nHaxd4y+Sj5H1NdKdjW1vLFx0rpfJmduOxZvK3PNsAASm06oDeMlJV6mLGpUkUAwnLU68OB6SMWqgAAHO3W6lcloh9GWHE6dNMfteO22VrP4+UlW49P/ACsybcvpZo2+PsUzl1Mdta+IwvbCcE5QepLhxN68svli6G03bi1buOsXgm+A5OP+xddnQOd6gAC0JaXXhxFhK3PNtS7KkaczWsSsTTIAA82/uuFnSs54fpxPXi1zWN7+Mvx9lOt2Sywj/Jrl2/jOk/r3Hg9QABz9/ZUJq5HKWfedHFtn8eO8enZ3XcsKv1RwZ58muK3pcxuebYAA2tSrGnIztGopddZ9xYlUKgAA82721y9KLi0klxPXj3kY21y129t27MYPNZ07zG9zcrrMRoZaAAGW6su7a0xpWtVU3ptis7TMU2m3uWVJSadaUoXk2lTXXD0Hm2AAL2nSfeSrFW6tsqIAAAOZf3l2U3pk4xTwSOrXjkjxu1Z+4v8AqS6s18T0z9U9xf8AUl1Y+J6PqnuL/qS6sfE9H1T3F/1JdWPiej6p7i/6kurHxPR9VpY3l2M1qk5RbxTM7ccsam1dM5XsAAJTo0wIAAAAHFebO1zIKAG/s9xp1af04nn2Rr4rA9GQCVmiDtHE6QAAAlqjaAgAAA4rzZ2uZBRpt1W/b+5fuZ38VdfLrnG6HI3Cpfufc/3OzXxHPt5ZmkSs0Qdo4nSAAJSq0gLXVSfeSLVCoAAOK82drmQUabf/AHt/cjO/irr5dc43Q5G4/wB7n3M7NPEc+3lmaRKzRB2jidIAAvaVZ9xKsXuxrGvImtWsTTIAA4ss2drmQUTGTjJSWadUSwe35L+v0f278Dx6Xp2PFKTlJyebdWe0jzQUTHNEHaOJ0gADa1Gka8zO1ai5lWE46XThwPSVixUAB4734/VNyhJKuLTPbXlxP153Rn8dd80fE13Rnrp8dd80fEd0Ounx13zR8R3Q66fHXfNHxHdDrp8dd80fEd0OutLOw0zUpyTpikjO3LmfjU0ew8XoAWhHU6cOItJG55tgESipKnQsqWMGmnRm2UAAAAAAAAAAEpNuiA3jFRVOpi1qRJFAAESipLHqWVLGMoOOeXM3KzYqAAAAAAABaMHLLLmLSRtGKisOpi1qRJFAAAAAApK1F5YGpsmFHamu0uUwq01miogCUm8kBZWpvsJlcLxtRWeJLsuFzKgAAB//2Q==) no-repeat;
                    background-size:100% 100%;
                }
                a{
                    position:absolute;
                    top:0;
                    right:0;
                    display:block;
                    width:80rem/$pole;
                    height:80rem/$pole;
                    background:url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwQTAxRTczRkU5RDExRTc5OEUwRkVEQ0VBMjZFNTJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwQTAxRTc0RkU5RDExRTc5OEUwRkVEQ0VBMjZFNTJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBBMDFFNzFGRTlEMTFFNzk4RTBGRURDRUEyNkU1MkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBBMDFFNzJGRTlEMTFFNzk4RTBGRURDRUEyNkU1MkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAAXABgDAREAAhEBAxEB/8QAYwABAQEBAAAAAAAAAAAAAAAABgUHCAEBAAAAAAAAAAAAAAAAAAAAABAAAQMDAwMBCQAAAAAAAAAAAgEDBBESBQAhMVETBkHwweEyQlIzFBYRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOgZhT/G5zs5Ccl4KUanLbVVNyMZLu4Nd1BfVPTQX3MlAbgLkCfBISB3O/Wo2rwqLoIONTI5+ezlpCuRMTHK/HRUVRN1eO87T6acD7uQQzZMSNEdflmIRgFVdI/lt6L1r00GbNxHGybyj0N7+O/YV1uApKqgips8TdPx3b21+IaXHfYfYbeYMXGXBQmzFaiorxSmgMzYruQyJSvITbg4WI7bDiOuCIvuJw46qrRU+0fZQTn2eyV9vZtW66lttN612pTQGsVFfxs9ssIYT/HppqhtNuCSRj5UmyrRQ6joP//Z) no-repeat;
                    background-size:24rem/$pole 23rem/$pole;
                    background-position:center center;
                }
            }
        }
        
        .alertPass-title{
            position: relative;
            width: 100%;
            height: 1rem;
            border-bottom:1px solid #ccc;
            [data-dpr="3"] &{
                border-width:1.5px;
            }
            h2{
                font-size: .4rem;
                line-height: 1rem;
                font-weight: 500;
                color: #333;
                text-align: center;
            }
        }
        .alertPass-centent{
            width: 100%;
            .alertPass-input{
                width: 95%;
                height: 1.3rem;
                border: 1px solid #ccc;
                border-radius: 6rem/$pole;
                margin:.5rem auto .2rem;
                [data-dpr="3"] &{
                    border-width:1.5px;
                }
                i{
                    position: relative;
                    float: left;
                    display: block;
                    width: 16.6666666667%;
                    height:100%;
                    line-height: 100%;
                    font-size: 0.8rem;
                    border-right:1px solid #ccc;
                    [data-dpr="3"] &{
                        border-width:1.5px;
                    }
                    &:last-child{
                        border-right:0;
                    }
                }
                .ed{
                    &:before{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: block;
                        content: '•';
                        text-align: center;
                        line-height:1.3rem;
                    }
                }
            }
        }
        .alertPass-info{
            width: 95%;
            margin: auto;
            font-size: 26rem/$pole;
            p{
                text-align: left;
                max-width:7.5rem;
                color:#ff0000;
            }
            a{
                text-align: right;
                color:#44bbff;
                display: block;
            }
        }
        .alertPass-keyboard{
            width: 100%;
            background: #fff;
            margin-top: .3rem;
            &:after{
                display:table;
                content:"";
                clear:both;
            }
            &>ul{
                width: 100%;
                border-top: 1px solid #ccc;
                [data-dpr="3"] &{
                    border-width:1.5px;
                }
                li{
                    float:left;
                    width:33.33333333%;
                    height: 1.5rem;
                    border-bottom: 1px solid #ccc;
                    border-right:1px solid #ccc;
                    display:-webkit-flex;
                    display:flex;
                    -webkit-align-items:center;
                    align-items:center;
                    -webkit-justify-content:center;
                    justify-content:center;
                    transition:all .1s ease-out;
                    font-size:40rem/$pole;
                    color:#333;
                    [data-dpr="3"] &{
                        border-width:1.5px;
                    }
                    &:nth-child(3n+0){
                        border-right:0
                    }
                    &:nth-child(10){
                        background:#dfdfdf;
                        font-size:32rem/$pole;
                        color:#fff;
                    }
                    &:last-child{
                        background:#dfdfdf url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAiCAYAAAAge+tMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTMzNUFENThGNThFMTFFNjlFMEE5RURCRTUwNzJFNDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTMzNUFENTlGNThFMTFFNjlFMEE5RURCRTUwNzJFNDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFMzM1QUQ1NkY1OEUxMUU2OUUwQTlFREJFNTA3MkU0NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMzM1QUQ1N0Y1OEUxMUU2OUUwQTlFREJFNTA3MkU0NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvdX180AAAJQSURBVHja1JjPLwNBFMdn1W9FQvwDjvgn3JwcRVRciriLxMFFRCWNUI0fTVER0hIiUeEiPbmIU4mQ8E8IPZCg3iSzyXiddndndnbTl3wP3d2Z+XTnzXtvHyFqFgEVNekT9ARaAfUQl8wAxTVCY/2AEqAmFegAaNdDaF45UL0s9AGaLA2qJe5bENQPukDrrTudiMJl0CS77M/otjluzW9Qr92BdHtOEfQG83WvLMutvWoX+hxBRz2GJsxtzPWfrR5uAF0h6EXij7VyDF9Wb/oSQS8Qf41nKQt9pgg9Dtq06VL0gKdAIRVwOskJemheAvqXjd2ygKfr7XMRIyQDbgiSS0RiS5NojnLwPLSpQxnwJXQzrlASbFvAi6AzFnlBCD6DbqQUQ14leBloIfgA8y/z4pFLGVEEn5CELgHvBr25Ucg4gJeBLgG/5n68gto1xF8Kv6MI/Q+8hr1x015ABQ3gdJ06wfV3FjalbJCLuUWWNNw00UHEPm/IuAq1ZXRxViN0RuA2duFLwAOoAqQ7ENYEHagQbQyn4GYlmEMF+4iL0Gl0EGXgy2ZOWjreIvghCfCUBbRVkpIqsjpBeQQ/7BB8lEtoaYuQx8NTF51UKWu7QPcIfswhfIh9WNuJ0wYrzCZU63ET/gHBh4m/ZgvchM+jaDPlE3SQ4/iwM6ADdIfgp30A5z+WH+0OagPdKH4VudmeiDkZ2IwKMqo1j9oUuCHU53SCRkFLbE9TN6uFuUdW0IiSMlqrH1db05NP6UlSZW1mPmlENcIWWPSIiXz6T4ABAJMQ2BzbnP37AAAAAElFTkSuQmCC) no-repeat;
                        background-size:46rem/$pole 34rem/$pole;
                        background-position:center center;
                    }
                    &.down{
                        background-color:#f0eded;
                    }
                }
            }
        }
    }
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px)
    {
        .alertPass-main .suo .suo-btn{
            bottom:0.66667rem;
        }
        .alertPass-main .alertPass-keyboard{
            padding-bottom:0.66667rem;
        }
    }
</style>