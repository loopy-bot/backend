import { UnsupportedMediaTypeException } from '@nestjs/common';

export function FileFilter(
  req,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  // 定义允许的 MIME 类型
  const allowedTypes = [
    'application/pdf',
    'application/msword', // 用于 .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // 用于 .docx
    'text/plain', // txt 文件
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new UnsupportedMediaTypeException('Unsupported file type'), false); // 抛出不支持的媒体类型异常
  }
}
