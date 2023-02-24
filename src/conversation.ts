import { ChatGPTUnofficialProxyAPI ,ChatMessage} from 'chatgpt';
import { env } from './utils/env';

// store conversation
const memory = new Map<string, ChatGPTUnofficialProxyAPI>();
const chathistory = new Map<string, any>();

const api = {
  apiReverseProxyUrl: 'https://chat.duti.tech/api/conversation',
  // apiReverseProxyUrl: 'https://gpt.pawan.krd/backend-api/conversation',
  accessToken: env.CHATGPT_TOKEN,
};

/**
 * send message to chatGPT
 */
export const send = async (
  id: number | string,
  context: string,
) => {
  const sId = id.toString();
  let conversation = memory.get(sId);
  let history = chathistory.get(sId);

  if (!conversation) {
    conversation = await create(sId);
  }
  let response;
  if (history) {
    response = await conversation.sendMessage(context, {
      timeoutMs: 2 * 60 * 1000,
      conversationId: history.conversationId,
      parentMessageId: history.id
    });
  }else{
    response = await conversation.sendMessage(context, {
      timeoutMs: 2 * 60 * 1000,
    });
  }

  chathistory.set(sId, response);

  return response.text;
};

/**
 * create a new conversation
 */
export const create = async (id: number | string) => {
  const sId = id.toString();
  const conversation = new ChatGPTUnofficialProxyAPI(api);
  memory.set(sId, conversation);
  return conversation;
};
