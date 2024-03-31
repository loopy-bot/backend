import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Type = 'qwen' | 'kimi' | string;
interface ModelParams {
  model?: Type;
  question?: string;
  personality?: string;
  config?: Record<Type, any>;
}
// const baseUrl = 'http://123.60.1.214:8080';
const baseUrl = 'http://localhost:8082/back';
@Injectable()
export class Model {
  static async genarate(params: ModelParams = { model: 'qwen' }) {
    return axios({
      url: baseUrl + '/model/generate',
      method: 'post',
      data: {
        ...params,
        config: {
          kimi: {},
          qwen: {
            model: 'qwen-turbo',
          },
        },
      },
    }).then(({ data: res }) => {
      return {
        type: 'text',
        text: res.data.content,
        file: null,
      };
    });
  }

  static async chat(params: ModelParams & { key?: string } = { model: 'qwen' }) {
    return axios({
      url: baseUrl + '/model/chat',
      method: 'post',
      data: params,
    }).then(({ data: res }) => {
      return {
        type: 'text',
        text: res.data.content,
        file: null,
      };
    });
  }
}
