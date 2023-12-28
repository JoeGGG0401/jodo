// services/MessageService.js
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, where } from "firebase/firestore";

class MessageService {
  async createMessage(userId, messageData) {
    console.log(messageData)
    await addDoc(collection(db, "users", userId, "messages"), messageData);
  }

  async getUserMessages(userId) {
    const q = query(
      collection(db, "users", userId, "messages"),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    let groupedMessages = {};

    querySnapshot.forEach((doc) => {
      const message = { id: doc.id, ...doc.data() };
      const date = message.date.split('T')[0]; // 假设日期格式为 'YYYY-MM-DDTHH:mm:ss'

      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }

      groupedMessages[date].push(message);
    });

    return groupedMessages;
  }

  async getUserMessagesForDate(userId, date) {
    // 确保 date 是字符串形式 'YYYY-MM-DD'
    const q = query(
      collection(db, "users", userId, "messages"),
      where("date", "==", date),
      orderBy("date", "desc")
    );
  
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  
}

export default new MessageService();
