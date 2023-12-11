import { db } from "../firebase"; // Firebase配置
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

class UserService {
  // 获取所有用户
  async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // 添加新用户
  async createUser(userData) {
    const docRef = await addDoc(collection(db, "users"), userData);
    return docRef.id;
  }

  // 获取用户的观察者列表
  async getObservers(userId) {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDocs(userRef);
    return userSnapshot.data().observers;
  }

  // 搜索用户
  async searchUsersByName(name) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

export default new UserService();
