import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Type = 'qwen' | 'kimi' | string;
interface ModelParams {
  model?: Type;
  question?: string;
  personality?: string;
  config?: Record<Type, any>;
}
@Injectable()
export class Model {
  static async genarate(params: ModelParams = { model: 'qwen' }) {
    return axios({
      url: 'http://127.0.0.1:8766/generate',
      method: 'post',
      params,
    }).then((res) => res.data);
  }

  static async chat(params: ModelParams & { key?: string } = { model: 'qwen' }) {
    return axios({
      url: 'http://127.0.0.1:8766/chat',
      method: 'post',
      params,
    }).then((res) => res.data);
  }
}
