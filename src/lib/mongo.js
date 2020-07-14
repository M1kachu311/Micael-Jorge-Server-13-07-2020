import url from "url";
import { MongoClient } from "mongodb";
import conf from "../conf/conf";

const mongodbConnection = conf.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf("/") + 1);

const RECONNECT_INTERVAL = 1000;
const CONNECT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const onClose = () => {
  console.log("MongoDB connection was closed");
};

const onReconnect = () => {
  console.log("MongoDB reconnected");
};
export let db = null;

const connectWithRetry = () => {
  MongoClient.connect(mongodbConnection, CONNECT_OPTIONS, (err, client) => {
    if (err) {
      console.log(`MongoDB connection was failed: ${err.message}`, err.message);
      setTimeout(connectWithRetry, RECONNECT_INTERVAL);
    } else {
      db = client.db(dbName);
      db.on("close", onClose);
      db.on("reconnect", onReconnect);
      console.log("MongoDB connected successfully");
    }
  });
};

connectWithRetry();
