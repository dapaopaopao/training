import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		actionList:[]
	},
	mutations:{
		addAction(state,actionName){
			state.actionList.push(actionName)
		},
		
		deleteAction(state,actionIndex){
			state.actionList.splice(actionIndex,1)
		},
		
		resetActionList(state){
			state.actionList=[]
		}
	},
	getters:{
		getLength(state){
			return state.actionList.length
		}
	}
	
})
