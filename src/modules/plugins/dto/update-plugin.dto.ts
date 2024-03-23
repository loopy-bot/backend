export class UpdatePluginDto {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  method: 'POST' | 'GET';
  responseType: 'json' | 'arraybuffer';
  params: any;
}
