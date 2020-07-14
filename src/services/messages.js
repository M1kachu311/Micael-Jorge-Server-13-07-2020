import db from "../classes/Database";
import Message from "../classes/Message";

class messageService {
  constructor() {
    this.db = new db("messages");
  }

  async getMessages(query = {}) {
    let data = await this.db.get(query);
    data = data.map((dataItem) => {
      return new Message(dataItem);
    });
    return data;
  }

  async insertNewMessage(username, data) {
    let parsedData = new Message({ ...data, sender: username });
    let insertedId = await this.db.insert(parsedData);
    return insertedId;
  }

  async deleteForUser(id, userid) {
    let message = await this.db.getSingle(id);
    if (message) {
      if (message.sender == userid) {
        let updatedItem = await this.db.update(id, { senderDeleted: true });
        return updatedItem;
      } else if (message.recipient == userid) {
        let updatedItem = await this.db.update(id, { recipientDeleted: true });
        return updatedItem;
      }
    }
    return null;
  }

  async getUserInbox(id) {
    let getMessages = await this.getMessages({
      recipient: id,
      recipientDeleted: false,
    });
    return getMessages;
  }
  async getUserOutbox(id) {
    let getMessages = await this.getMessages({
      sender: id,
      senderDeleted: false,
    });
    return getMessages;
  }
  async getUserEmails(id) {
    const inbox = await this.getUserInbox(id);
    const outbox = await this.getUserOutbox(id);
    return { inbox, outbox };
  }
}

export default new messageService();
