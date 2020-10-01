import fs from 'fs';
import path from 'path';

const listFilesRecursive = (folderPath: string): readonly string[] => {
  return fs.readdirSync(folderPath).flatMap((file) => {
    const filePath = path.join(folderPath, file);
    return fs.statSync(filePath).isDirectory()
      ? listFilesRecursive(filePath)
      : filePath;
  });
};

export default listFilesRecursive;
