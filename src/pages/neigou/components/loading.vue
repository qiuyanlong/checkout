<template>
	<div class="gLoading" v-show="loadingswitch">
		<van-loading type="circular" color="white"/>
	</div>
</template>
<script>
export default {
	name:'loading',
	props:['loadingswitch'],
	created(){}
}
</script>
<style lang="scss">
$pole:75;
@function rem($px){
  	@return ($px/$pole)+rem;
}
.gLoading{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999998;
    .van-loading{
		position: fixed;
		top:50%;
		left:50%;
		margin-top:rem(-140);
		margin-left:rem(-70);
		z-index:9999999;
	}
	.van-loading--white{
		width:rem(140);
		height:rem(140);
		padding:rem(30);
	    border-radius: rem(10);
	    background-color: rgba(0, 0, 0, .6);
	}
}
</style>