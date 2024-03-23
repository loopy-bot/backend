export class CreatePluginDto {
  url: string;
  method: 'POST' | 'GET';
  responseType: 'json' | 'arraybuffer';
  name: string;
  type: string;
  description: string;
  params: any;
}
