<template>
	<div>
		<van-popup v-model="visible">
			<slot name="areanostock"></slot>
		</van-popup>
	</div>
</template>
<script>
export default {
	name:'lowstocks',
	data(){
		return {
			visible:false
		}
	},
	props:{
		value: {
        	type: Boolean,
        	default:false
      	}
	},
	watch:{
		value(val) {
	        this.visible = val
	    },
	    visible(val) {
	        this.$emit('input', val)
	    }
	},
	mounted(){
		if (this.value) this.visible = true
	}
}
</script>
<style lang="scss" scoped>
@import '../css/commen.scss';
//区域无库存

</style>