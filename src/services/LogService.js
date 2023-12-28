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
  deleteDoc,
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

  // 删除日志并更新统计数据
  async deleteLog(userId, logId) {
    // 首先获取日志数据
    const logRef = doc(db, "users", userId, "logs", logId);
    const logSnap = await getDoc(logRef);
    if (!logSnap.exists()) {
      console.error("Log not found");
      return;
    }

    const logData = logSnap.data();
    const duration = this.calculateDuration(logData.start, logData.end);

    // 删除日志
    await deleteDoc(logRef);

    // 更新统计数据
    await this.updateStatsAfterDeletion(userId, logData, duration);
  }

  // 计算日志的持续时间
  calculateDuration(start, end) {
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    return (endDateTime - startDateTime) / (1000 * 60 * 60); // 将毫秒转换为小时
  }

  // 在日志删除后更新统计数据
  async updateStatsAfterDeletion(userId, logData, duration) {
    const date = new Date(logData.start).toISOString().split("T")[0];
    const statsRef = doc(db, "users", userId, "stats", date);

    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      const currentStats = statsSnap.data();
      currentStats[logData.class] =
        (currentStats[logData.class] || 0) - duration;
      if (currentStats[logData.class] < 0) {
        currentStats[logData.class] = 0; // 防止负数
      }
      await updateDoc(statsRef, currentStats);
    }
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
    const endDate = today.toISOString().split("T")[0];

    console.log(`Querying stats from ${startDate} to ${endDate}.`); // 调试信息

    const q = query(
      collection(db, "users", userId, "stats"),
      where("date", ">=", startDate),
      where("date", "<=", endDate), // 添加截止日期条件
      orderBy("date", "desc")
    );

    try {
      const querySnapshot = await getDocs(q);
      const statsData = querySnapshot.docs.map((doc) => doc.data());
      console.log(statsData); // 打印获取到的数据
      return statsData;
    } catch (error) {
      console.error("Error fetching stats:", error);
      return [];
    }
  }
}

export default new LogService();
