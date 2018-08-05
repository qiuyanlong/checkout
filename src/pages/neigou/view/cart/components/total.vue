<template>
	<div>
		<slot @click="xixi">123</slot>
	</div>
</template>
<script>
export default {
	name:'total',
	data(){
		return {}
	},
	props:{},
	watch:{},
	methods:{
		xixi(){
			alert('456')
		}
	},
	mounted(){}
}
</script>
<style lang="scss" scoped>
@import '../css/commen.scss';

</style>