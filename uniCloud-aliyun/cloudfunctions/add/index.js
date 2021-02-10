'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const collection = db.collection('uni-id-users')
	//const res = await collection.add(event)
	const res= await collection.doc('6022396b20be4e0001e08efd').update({
		action:dbCmd.push({"date":'2077',"actionList":[{"name":"1123"}]})
	})
	return res
};
