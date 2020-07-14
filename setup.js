import url from 'url';
import { MongoClient } from 'mongodb';
import conf from './src/conf/conf';

const mongodbConnection = conf.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);
const CONNECT_OPTIONS = {
	useNewUrlParser: true
};

const createIndex = (db, collectionName, fields, options) =>
	db.collection(collectionName).createIndex(fields, options);

const createAllIndexes = async db => {
	const UserIndexes = await db
		.collection('users')
		.listIndexes()
		.toArray();

	if (UserIndexes.length === 1) {
		await createIndex(db, 'users', { username: 1 }, { unique: true });
		console.log('Created indexes for: Users');
	}
};
(async () => {
	let client = null;
	let db = null;
	try {
		client = await MongoClient.connect(mongodbConnection, CONNECT_OPTIONS);
		db = client.db(dbName);
		console.log(`Successfully connected to ${mongodbConnection}`);
	} catch (e) {
		console.log(`MongoDB connection was failed. ${e.message}`);
		return;
	}
	await db.createCollection('messages');
	await db.createCollection('users');
	await createAllIndexes(db);
	client.close();
})();
