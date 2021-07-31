<template>
	<div class="operate-container">
		<span class="title">
			{{title}}
		</span>
		<div class="btns">
			<slot name="btns"></slot>
		</div>
	</div>
</template>

<script>
	export default{
		props:{
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style scoped lang="scss">
	.operate-container {
		display: flex;
		align-items: center;
		margin-bottom: 12px;

		.title {
			flex: 1;
			font-size: 16px;
			line-height: 24px;
			letter-spacing: .5px;
			color: #14151a;
			font-weight: 600;
		}
	}
</style>
