import { defineComponent, toRefs } from 'vue'

const table = defineComponent({
	props:{
		columns:{
			type: Array,
			default: [],
			desc: '列'
		}
	},
	setup(props, {attrs, slots}){
		const { columns } = toRefs(props);
		const columnsList = columns.value.map((item) => {
			const slots = { ...item };
			delete slots.props;
			return (
			<el-table-column {...item.props} v-slots={slots}></el-table-column>
			);
		}); 
		return () => (
		      <el-table {...attrs} v-slots={{ ...slots, default: columnsList }}></el-table>
		    );
	},
})


export default table