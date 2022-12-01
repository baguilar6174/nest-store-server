/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const extension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];
  if (validExtensions.includes(extension)) return callback(null, true);
  callback(null, false);
};
