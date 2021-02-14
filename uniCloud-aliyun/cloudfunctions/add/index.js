'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const collection = db.collection('uni-id-users')
	
	let  isAction =false
	for(let item in event){
		if(item==='action'){
			isAction = true
		}
	}
	if(isAction){
		isAction=false
		let docList = await collection.doc(event._id).get()
		let item = docList.data[0]
		let index = item.action.length-1
		let lastDate = item.action[index].date
		let flag =  new Date(lastDate).toDateString() === new Date(event.action.date).toDateString()?true:false
		if(flag){
			const res= await collection.doc(event._id).update({
				['action.'+index]:event.action
			})
			return res
		}else{
			const res= await collection.doc(event._id).update({
				action:dbCmd.push(event.action)
			})
			return res
		}
		
	}else{
		let docList = await collection.doc(event._id).get()
		let item = docList.data[0]
		let index = item.food.length-1
		let lastDate = item.food[index].date
		let flag =  new Date(lastDate).toDateString() === new Date(event.food.date).toDateString()?true:false
		if(flag){
			const res= await collection.doc(event._id).update({
				['food.'+index]:event.food
			})
			return res
		}else{
			const res= await collection.doc(event._id).update({
				food:dbCmd.push(event.food)
			})
			return res
		}
	}
	
	
};
