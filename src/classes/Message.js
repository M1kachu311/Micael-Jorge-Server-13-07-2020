
export default class Message {
  constructor(data) {
    this.sender = data.sender || null;
    this.recipient = data.recipient || null;
    this.content = data.content || null;
    this.subject = data.subject || null;
    this.senderDeleted= data.senderDeleted ||false;
    this.recipientDeleted= data.recipientDeleted ||false;
    this.date_created = data.date_created || new Date();
    if(data._id){
      this.id=data._id.toString();
    }
  }
}
