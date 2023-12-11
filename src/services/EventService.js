import { db } from "../firebase"; // 确保这是正确的路径
import { addDoc, collection, getDocs } from "firebase/firestore";

class EventService {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async create(event) {
    const docRef = await addDoc(collection(db, "events"), event);
    return docRef.id; // 返回新创建文档的 ID
  }
}

export default new EventService();
