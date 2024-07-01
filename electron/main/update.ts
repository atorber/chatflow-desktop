import AdmZip from 'adm-zip'
import fs from 'fs'
import https from 'https';

/**
 * 下载文件并保存到本地
 * @param {string} fileUrl - 文件的URL
 * @param {string} outputPath - 文件保存的本地路径
 * @returns {Promise<void>}
 */
export async function downloadFile(fileUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);

    https.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        fileStream.destroy();
        fs.unlink(outputPath, () => {}); // 删除文件
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // 删除文件
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // 删除文件
      reject(err);
    });
  });
}

// 解压文件
export const extractFile = (downloadPath: string, extractPath: string) => {

    try {
        const zip = new AdmZip(downloadPath);
        zip.extractAllTo(extractPath, true);
        console.log(`Files extracted to ${extractPath}`);
        return true;
    } catch (error) {
        console.log(`Error extracting files: ${error}`);
        return false;
    }
};
