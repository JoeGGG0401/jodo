import { db } from "../firebase"; // 确保这是正确的路径
import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

class LogService {
  // 获取特定用户的所有日志
  async getUserLogs(userId) {
    const querySnapshot = await getDocs(
      collection(db, "users", userId, "logs")
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // 更新或创建统计数据
  async updateStats(userId, logData) {
    // 确保 logData 中的 start 和 end 都已定义
    if (!logData.start || !logData.end) {
      console.error("Invalid log data: start or end time missing");
      return; // 如果数据无效，则提前退出函数
    }

    const startDateTime = new Date(logData.start);
    const endDateTime = new Date(logData.end);
    const duration = (endDateTime - startDateTime) / (1000 * 60 * 60); // 将毫秒转换为小时

    const date = startDateTime.toISOString().split("T")[0]; // 获取日期
    const statsRef = doc(db, "users", userId, "stats", date);

    try {
      const statsSnap = await getDoc(statsRef);
      if (statsSnap.exists()) {
        // 更新统计数据
        const currentStats = statsSnap.data();
        currentStats[logData.class] =
          (currentStats[logData.class] || 0) + duration; // 累加时间
        await updateDoc(statsRef, currentStats);
      } else {
        // 创建新的统计文档
        const newStats = {
          date: date, // 添加日期字段
          work: 0,
          rest: 0,
          sleep: 0,
        };
        newStats[logData.class] = duration;
        await setDoc(statsRef, newStats);
      }
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  }

  // 为特定用户创建新日志
  async createLog(userId, logData) {
    const docRef = await addDoc(
      collection(db, "users", userId, "logs"),
      logData
    );

    // 更新统计数据
    await this.updateStats(userId, logData);

    return docRef.id; // 返回新创建日志的 ID
  }

  // 获取特定用户最近一周的统计数据
  async getUserStatsForLastWeek(userId) {
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const startDate = lastWeek.toISOString().split("T")[0];

    console.log(`Start Date for Query: ${startDate}`); // 调试：打印开始日期

    const q = query(
      collection(db, "users", userId, "stats"),
      where("date", ">=", startDate),
      orderBy("date", "desc")
    );

    console.log(`Query: ${JSON.stringify(q)}`); // 调试：打印查询对象

    try {
      const querySnapshot = await getDocs(q);
      console.log(`Number of docs found: ${querySnapshot.docs.length}`); // 调试：打印找到的文档数

      const statsData = querySnapshot.docs.map((doc) => doc.data());
      console.log("Retrieved stats:", statsData); // 调试：打印检索到的数据
      return statsData;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return [];
    }
  }
}

export default new LogService();
