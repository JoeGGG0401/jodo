import { db } from "../firebase"; // 确保这是正确的路径
import { addDoc, collection, getDocs, doc } from "firebase/firestore";

class LogService {
  // 获取特定用户的所有日志
  async getUserLogs(userId) {
    const querySnapshot = await getDocs(collection(db, "users", userId, "logs"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 为特定用户创建新日志
  async createLog(userId, logData) {
    const docRef = await addDoc(collection(db, "users", userId, "logs"), logData);
    return docRef.id; // 返回新创建日志的 ID
  }
}

export default new LogService();
