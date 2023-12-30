import MessageService from "./MessageService";
import LogService from "./LogService";
import { auth } from "../firebase";
import moment from "moment";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.VUE_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  
async function generateFeedbackIfNecessary() {
  const user = auth.currentUser;
  if (!user) return;

  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const logs = await LogService.getLogsByDate(user.uid, yesterday);
  console.log(logs);
  const messages = await MessageService.getUserMessagesForDate(
    user.uid,
    yesterday
  );
  console.log(messages);

  // 检查昨天是否有日志且没有 AI 反馈
  const hasLogs = logs.length > 0;
  console.log(hasLogs);
  const hasFeedback = messages.some((message) => message.user === "jodo");
  console.log(hasFeedback);

  if (hasLogs && !hasFeedback) {
    const feedback = await getFeedback(logs);
    await MessageService.createMessage(user.uid, {
      date: yesterday,
      user: "jodo",
      content: feedback,
    });
  }
}

async function getFeedback(logs) {
  // 构建提示
  const prompt = generatePrompt(logs);
  console.log(prompt);
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    // 返回 AI 的回复
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in generating feedback:", error);
    return "无法生成反馈。";
  }
}

// 根据日志生成提示
function generatePrompt(logs) {
  let prompt = "这是用户昨天的活动日志:\n";
  logs.forEach((log, index) => {
    prompt += `${index + 1}. ${log.title} (类别: ${log.class}, 开始: ${
      log.start
    }, 结束: ${log.end})\n`;
  });
  prompt += "基于这些活动，请给用户一些反馈和建议。请指出问题，然后给予鼓励，字数控制在 50 字内。\n";
  return prompt;
}

export { generateFeedbackIfNecessary };
