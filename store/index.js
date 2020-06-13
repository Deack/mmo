import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
	},
	mutations: {
		login(state, provider) {
			
			// console.log(provider);
			let userInfo = {
				id: provider.id,
				username: provider.username,
				portrait: provider.portrait,
			};
			state.userInfo = userInfo; 
			
			// 登录时修改token
			state.Authorization = provider.Authorization;
			
			//缓存token
			uni.setStorage({
			    key: 'Authorization',  
			    data: provider.Authorization  
			});
			//利用localStorage缓存用户信息到浏览器，在token失效前减少登录请求
			uni.setStorage({
				key:'userInfo',
				data: userInfo,
			});
			
			// 修改登陆状态
			state.hasLogin = true;

		},
		logout(state) {
			state.hasLogin = false;
			
			uni.removeStorage({
				key: 'Authorization',
			});
			uni.removeStorage({
				key: 'userInfo',
			})
		}
	},
	actions: {
	
	}
})

export default store
