/*
 * @Author: your name
 * @Date: 2021-01-07 17:30:30
 * @LastEditTime: 2021-03-18 17:36:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\store\modules\app1.js
 */
export default {
    namespaced: true,
    state: {
		editInfo: null,   //编辑的详情
    },
    mutations: {
        SET_EDIT_INFO(state, info) {
           state.editInfo = info;
        },
	},
    actions: {
		set_edit_info({commit}, info){
			commit('SET_EDIT_INFO', info)
		}
    }
};
