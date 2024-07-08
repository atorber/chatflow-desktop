import fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
import { KubeConfig, CoreV1Api, AppsV1Api } from '@kubernetes/client-node';

const KUBECONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '', '.kube', 'config');

async function loadKubeconfig(filePath: string): Promise<any> {
    const fileContent = await fs.readFileSync(filePath, 'utf8');
    return yaml.parse(fileContent);
}

async function saveKubeconfig(config: any): Promise<void> {
    const yamlContent = yaml.stringify(config);
    await fs.writeFileSync(KUBECONFIG_PATH, yamlContent);
    return config;
}

async function switchKubeconfig(newConfigPath: string): Promise<void> {
    const newConfig = await loadKubeconfig(newConfigPath);
    const config = await saveKubeconfig(newConfig);
    return config;
}

export async function updateKubeconfig(newConfigPath: string): Promise<any> {

    try {
        const config = await switchKubeconfig(newConfigPath);
        console.log('Kubeconfig switched successfully.');
        return config;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
}

export async function listNodes() {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const coreV1Api = kc.makeApiClient(CoreV1Api);

        const res = await coreV1Api.listNode();
        console.log('Nodes in the cluster:');
        return JSON.stringify(res.body, null, 2);
    } catch (err) {
        console.error('Error listing nodes:', err);
        return `Error listing nodes:${err}`;
    }
}

export async function getNamespacePods(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const coreV1Api = kc.makeApiClient(CoreV1Api);

    try {
        const res: any = coreV1Api.listNamespacedPod(namespace || 'default')
        console.log('listNamespacedPod', JSON.stringify(res.body, null, 2));
        return JSON.stringify(res.body, null, 2);
    } catch (err) {
        console.error('Error listing pods:', err);
        return `Error listing pods:${err}`;
    }

}

async function createNamespace(name: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const coreV1Api = kc.makeApiClient(CoreV1Api);

        const namespace = {
            metadata: {
                name
            }
        };

        const res = await coreV1Api.createNamespace(namespace);
        console.log('Namespace created:', res.body.metadata.name);
    } catch (err) {
        console.error('Error creating namespace:', err);
    }
}

// 创建 Deployment
async function createDeployment(yamlPath: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const appsV1Api = kc.makeApiClient(AppsV1Api);

        // 读取 YAML 文件
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');

        // 解析 YAML 内容
        const deployment = require('js-yaml').load(yamlContent);

        // 创建 Deployment
        const res = await appsV1Api.createNamespacedDeployment('default', deployment);
        console.log('Deployment created:', res.body.metadata.name);
    } catch (err) {
        console.error('Error creating deployment:', err);
    }
}
