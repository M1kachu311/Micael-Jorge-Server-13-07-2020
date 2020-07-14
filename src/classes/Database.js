import { db } from "../lib/mongo";
import { ObjectID } from "mongodb";

export default class Database {
  constructor(collection) {
    this.collection = collection;
  }
  async get(query = {}) {
    try {
      const items = await db
        .collection(this.collection)
        .find(query)
        .sort({ date_created: -1 })
        .toArray();
      return items;
    } catch (err) {
      throw err;
    }
  }
  async getSingle(id) {
    try {
      const newObjectId = new ObjectID(id);
      const items = await db
        .collection(this.collection)
        .find({ _id: newObjectId })
        .toArray();
      return items.length ? items[0] : null;
    } catch (err) {
      throw err;
    }
  }
  async insert(newRowData) {
    try {
      const newItem = await db
        .collection(this.collection)
        .insertOne(newRowData);
      return newItem.ops[0]._id.toString();
    } catch (err) {
      throw err;
    }
  }
  async update(id, data) {
    try {
      const newObjectId = new ObjectID(id);
      await db
        .collection(this.collection)
        .updateOne({ _id: newObjectId }, { $set: data });
      const updatedItem = await this.getSingle(newObjectId);
      return updatedItem;
    } catch (err) {
      throw err;
    }
  }
  async delete(id) {
    try {
      const newObjectId = new ObjectID(id);
      const deleteResponse = db
        .collection(this.collection)
        .deleteOne({ _id: newObjectId });
      return deleteResponse.deletedCount;
    } catch (err) {
      throw err;
    }
  }
}
