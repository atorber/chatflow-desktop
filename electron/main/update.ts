import AdmZip from 'adm-zip'

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
