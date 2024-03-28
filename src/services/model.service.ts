import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Type = 'qwen' | 'kimi' | string;
interface ModelParams {
  model?: Type;
  question?: string;
  personality?: string;
  config?: Record<Type, any>;
}
const baseUrl = 'http://123.60.1.214:8080';
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
    }).then((res) => res.data);
  }

  static async chat(params: ModelParams & { key?: string } = { model: 'qwen' }) {
    return axios({
      url: baseUrl + '/model/chat',
      method: 'post',
      data: params,
    }).then((res) => res.data);
  }
}
