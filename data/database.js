const mongodb = require("mongodb");

require("dotenv").config();

const MongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017"; //localhost is 127.0.0.1.
let database;

async function connect() {
	const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
	//.db connect to specific database on server
	database = client.db(process.env.database);
}

function getDb() {
	if (!database) {
		throw { message: "database connection not established!" };
	}
	return database;
}

module.exports = {
	connectToDatabase: connect,
	getDb: getDb,
};
