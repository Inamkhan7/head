import { API_ENDPOINTS } from './client/api-endpoints';
import { HttpClient } from './client/http-client';

export async function ChatSubmit(ques:any, checkoutObject:any) {
  const validQuestions = ques
    ?.filter((item:any) => item !== undefined && item.content !== undefined)
    .map((item:any) => item.content);

  const recentQuestion = validQuestions.length > 0 ? validQuestions[validQuestions.length - 1] : undefined;
  const previousHistory = validQuestions.slice(0, -1);

  const data = await HttpClient.post('http://localhost:3000/api/chat', {
    history: previousHistory,
    lastQuestion: recentQuestion !== undefined ? recentQuestion : '',
    site: 'watts',
    checkoutObject: checkoutObject,
  });

  return data;
}

