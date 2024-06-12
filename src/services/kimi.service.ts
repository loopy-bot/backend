import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface ModelParams {
  messages: any[];
  use_search?: boolean;
}
// const baseUrl = 'http://47.121.142.148/model/kimi';
const baseUrl = 'http://127.0.0.1:8000'

@Injectable()
export class KimiModel {
  static async chat(params: ModelParams = { messages: [], use_search: false }) {
    try {
      return axios({
        url: baseUrl + '/v1/chat/completions',
        method: 'post',
        data: params,
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTcyNTc3MjU1MSwiaWF0IjoxNzE3OTk2NTUxLCJqdGkiOiJjcGo4bzFyM2Flc3VobzgzcjBpMCIsInR5cCI6InJlZnJlc2giLCJzdWIiOiJjbnVoMnJrdWR1NjFrMmVhYTIzMCIsInNwYWNlX2lkIjoiY251aDJya3VkdTYxazJlYWEyMmciLCJhYnN0cmFjdF91c2VyX2lkIjoiY251aDJya3VkdTYxazJlYWEyMjAifQ._CvvszYHkExencZBVY5qEk5dweEWafvuBcLjIaFsu1TQNQgQ3HG1fpSwv_xv1UW2iBYiXaRb1LY9JrJcujxu_Q',
        }
      }).then(({ data: res }) => {
        return res.choices[0].message.content;
      });
    } catch (error) {
        console.log(error)
        return 'error'
    }
  }
}
