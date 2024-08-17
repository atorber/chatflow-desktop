import { dataBox } from "js-tool-big-box";
import {
    ElMessage,
} from "element-plus";

export const go2copy = (text: string) => {
    dataBox.copyText(
        text,
        () => {
            ElMessage.success("复制成功");
        },
        () => {
            ElMessage.error("复制失败");
        }
    );
};

export function send2ipc(method: string, params: string | object) {
  window.ipcRenderer.send("createTraining", JSON.stringify({ method, params }));
}