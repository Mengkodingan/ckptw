import { getContentType, proto } from "@adiwajshing/baileys";

export const arrayMove = (
  arr: undefined[],
  old_index: number,
  new_index: number
) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

export const getContentFromMsg = (msg: { message: proto.IMessage | undefined }) => {
  let type = getContentType(msg.message);
  return type === "conversation" && msg.message?.conversation
    ? msg.message.conversation
    : type == "imageMessage" && msg.message?.imageMessage?.caption
    ? msg.message.imageMessage.caption
    : type == "documentMessage" && msg.message?.documentMessage?.caption
    ? msg.message.documentMessage.caption
    : type == "videoMessage" && msg.message?.videoMessage?.caption
    ? msg.message.videoMessage.caption
    : type == "extendedTextMessage" && msg.message?.extendedTextMessage?.text
    ? msg.message.extendedTextMessage.text
    : type == "listResponseMessage"
    ? msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
    : type == "buttonsResponseMessage" &&
      msg.message?.buttonsResponseMessage?.selectedButtonId
    ? msg.message.buttonsResponseMessage.selectedButtonId
    : type == "templateButtonReplyMessage" &&
      msg.message?.templateButtonReplyMessage?.selectedId
    ? msg.message.templateButtonReplyMessage.selectedId
    : "";
};

export const getSender = (msg: any, client: { user: { id: any } }) => {
  return msg.key.fromMe
    ? client.user.id
    : msg.participant
    ? msg.participant
    : msg.key.participant
    ? msg.key.participant
    : msg.key.remoteJid;
};
