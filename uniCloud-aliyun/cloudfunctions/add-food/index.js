'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const collection = db.collection('uni-id-users')
	
	
	
		
	let docList = await collection.doc(event._id).get()
	let item = docList.data[0]
	let index = item.food.length-1
	if(index<0){
		const res= await collection.doc(event._id).update({
			food:dbCmd.push(event.food)
		})
		return res
	}else{
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
