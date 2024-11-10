/**
 * Chat
 */

"use strict";

// 预定义头像数组
const avatars = [
  "https://i.p-i.vip/30/20240920-66ed9a608c2cf.png",
  "https://i.p-i.vip/30/20240920-66ed9b0655cba.png",
  "https://i.p-i.vip/30/20240920-66ed9b18a56ee.png",
  "https://i.p-i.vip/30/20240920-66ed9b2c199bf.png",
  "https://i.p-i.vip/30/20240920-66ed9b3350ed1.png",
  "https://i.p-i.vip/30/20240920-66ed9b5181630.png",
  // 可以继续添加更多头像
];

// 用来记录已经分配头像的用户
const userAvatarMap = new Map();
let avatarIndex = 0;

// 生成聊天框的整体结构
function postChatBox(args, content) {
  const title = args[0] ? args[0].trim() : "群聊的聊天记录"; // 获取标题
  const titleHtml = title ? `<div class="chatBoxTitle"><i class="fa-solid fa-angle-left"></i><span class="chatTitleText">${title}</span><div class="chatBoxIcons"><i class="fa-solid fa-user"></i><i class="fa-solid fa-bars"></i></div></div>` : ""; // 生成标题 HTML
  const contentHtml = `<div class="chatBox">${content}</div>`
  return `<div class="chatContainer">${titleHtml}${contentHtml}</div>`;
}

// 生成单条聊天内容
function postChat(args) {
  if (!args || args.length === 0) {
    return ""; // 如果参数为空，返回空字符串
  }

  // 合并并拆分参数
  args = args.join(" ").split(",");

  // 确保 args[0] 存在
  let name = args[0] ? args[0].trim() : "未知";
  let content = args[1] ? args[1].trim() : "无内容";

  // 判断名字是否包含 QQ 号 (例如 June@3526514925)
  let qqNumber = null;
  if (name.includes("@")) {
    [name, qqNumber] = name.split("@"); // 分割名字和 QQ 号
  }

  // 判断是否是我的消息
  const isMe = name.toLowerCase() === "me";
  const chatName = isMe ? hexo.config.author : name;
  const chatClass = isMe ? "me" : "";

  // 固定的头像链接
  const myAvatar = "https://cdn.qyliu.top/i/2024/03/29/66061417537af.png";
  let avatarUrl;

  if (isMe) {
    avatarUrl = myAvatar;
  } else if (qqNumber) {
    // 如果有 QQ 号，拼接头像 URL
    avatarUrl = `https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=100`;
  } else {
    // 如果没有 QQ 号，从预定义的头像数组中分配
    if (!userAvatarMap.has(name)) {
      userAvatarMap.set(name, avatars[avatarIndex % avatars.length]);
      avatarIndex++;
    }
    avatarUrl = userAvatarMap.get(name);
  }

  // 生成 HTML 布局
  let result = "";
  result += `<div class="chatItem ${chatClass}">`;
  result += `<img class="chatAvatar no-lightbox" src="${avatarUrl}">`; // 添加头像
  result += `<div class="chatContentWrapper">`;
  result += `<b class="chatName">${chatName}</b>`;
  result += `<div class="chatContent">${content}</div>`;
  result += `</div>`;
  result += `</div>`;

  return result;
}

// 注册自定义标签
hexo.extend.tag.register("chat", postChat);
hexo.extend.tag.register("chatBox", postChatBox, { ends: true });
