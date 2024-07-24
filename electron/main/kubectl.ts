import fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
// const k8s = require('@kubernetes/client-node');
import * as k8s from '@kubernetes/client-node';
import { KubeConfig, CoreV1Api, AppsV1Api, BatchV1Api, V1Job, V1ObjectMeta } from '@kubernetes/client-node';
import jsyaml from 'js-yaml';

const KUBECONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '', '.kube', 'config');

async function loadKubeconfig(newConfigString: string): Promise<any> {
    // const fileContent = await fs.readFileSync(filePath, 'utf8');
    return yaml.parse(newConfigString);
}

async function saveKubeconfig(config: any): Promise<void> {
    const yamlContent = yaml.stringify(config);
    await fs.writeFileSync(KUBECONFIG_PATH, yamlContent);
    return config;
}

async function switchKubeconfig(newConfigString: string): Promise<void> {
    const newConfig = await loadKubeconfig(newConfigString);
    const config = await saveKubeconfig(newConfig);
    return config;
}

export async function updateKubeconfig(newConfig: string): Promise<any> {

    try {
        const config = await switchKubeconfig(newConfig);
        console.log('Kubeconfig switched successfully.');
        return { config };
    } catch (err) {
        console.error('Error:', err);
        return err;
    }
}

export async function listNodes() {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const coreV1Api = kc.makeApiClient(CoreV1Api);

        const res = await coreV1Api.listNode();
        console.log('Nodes in the cluster:', JSON.stringify(res.body));
        return res
    } catch (err) {
        console.error('Error listing nodes:', err);
        return err;
    }
}

export async function getNamespacePods(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const coreV1Api = kc.makeApiClient(CoreV1Api);

    try {
        const res: any = await coreV1Api.listNamespacedPod(namespace || 'default')
        console.log('listNamespacedPod', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listing pods:', err);
        return err;
    }

}

export async function getNamespacePytorchJobs(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    try {
        const res: any = await k8sApi.listNamespacedCustomObject(
            'kubeflow.org',
            'v1',
            namespace||'default',
            'pytorchjobs'
          )
        console.log('listNamespacedCustomObject', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listNamespacedCustomObject:', err);
        return err;
    }

}

export async function getNamespaceMPIJobs(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    try {
        const res: any = await k8sApi.listNamespacedCustomObject(
            'kubeflow.org',
            'v1',
            namespace||'default',
            'mpijobs'
          )
        console.log('listNamespacedCustomObject', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listNamespacedCustomObject:', err);
        return err;
    }

}

export async function createNamespace(name: string) {
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
export async function createDeployment(yamlString: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const appsV1Api = kc.makeApiClient(AppsV1Api);

        // 读取 YAML 文件
        // const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlContent = yamlString;

        // 解析 YAML 内容
        const deployment = jsyaml.load(yamlContent);

        // 创建 Deployment
        const res = await appsV1Api.createNamespacedDeployment('default', deployment);
        console.log('Deployment created:', res.body.metadata.name);
        return res
    } catch (err) {
        console.error('Error creating deployment:', err);
        return err;
    }
}

// 创建 Job
export async function createJob(yamlString: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const batchV1Api = kc.makeApiClient(BatchV1Api);

        // 读取 YAML 文件
        // const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlContent = yamlString

        // 解析 YAML 内容
        const job = jsyaml.load(yamlContent);

        // 创建 Job
        const res = await batchV1Api.createNamespacedJob('default', job);
        console.log('Job created:', res.body.metadata.name);
        return res;
    } catch (err) {
        console.error('Error creating job:', err);
        return err;
    }
}

export async function createPytorchJob(yamlString: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

        // 读取 YAML 文件
        // const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlContent = yamlString

        // 解析 YAML 内容
        const pytorchJob = jsyaml.load(yamlContent);

        // 创建 Job
        const res = await k8sApi.createNamespacedCustomObject(
            'kubeflow.org',
            'v1',
            'default',
            'pytorchjobs',
            pytorchJob
        );
        console.log('Job created:', res.body);
        return res;
    } catch (err) {
        console.error('Error creating job:', err);
        return err;
    }
}