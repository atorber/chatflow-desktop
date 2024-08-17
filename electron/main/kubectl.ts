import fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
// const k8s = require('@kubernetes/client-node');
import * as k8s from '@kubernetes/client-node';
import { KubeConfig, CoreV1Api, AppsV1Api, BatchV1Api, V1Job, V1ObjectMeta } from '@kubernetes/client-node';
import jsyaml from 'js-yaml';
import * as stream from 'stream';

const KUBECONFIG_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '', '.kube', 'config');

// 保存 kubeconfig 文件
async function saveKubeconfig(config: string): Promise<string> {
    // const yamlContent = yaml.stringify(config);
    const yamlContent = config;
    
    console.log('Saving kubeconfig:', yamlContent);
    await fs.writeFileSync(KUBECONFIG_PATH, yamlContent);
    return config;
}

// 读取 kubeconfig 文件
export async function getKubeconfig(): Promise<any> {
    const fileContent = await fs.readFileSync(KUBECONFIG_PATH, 'utf8');
    return fileContent;
}

// 更新 kubeconfig 文件
export async function updateKubeconfig(newConfig: string): Promise<any> {
    try {
        await saveKubeconfig(newConfig);
        console.log('Kubeconfig switched successfully.');
        return newConfig;
    } catch (err) {
        console.error('Error:', err);
        return err;
    }
}

// 获取集群节点列表
export async function listNodes() {
    console.debug('listNodes', KUBECONFIG_PATH);
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const coreV1Api = kc.makeApiClient(CoreV1Api);
        // 确保在调用 API 之前检查是否有活动的集群
        if (!kc.getCurrentCluster()) {
            throw new Error('No active cluster!');
        }
        const res = await coreV1Api.listNode();
        console.log('Nodes in the cluster:', JSON.stringify(res.body));
        return res
    } catch (err) {
        console.error('Error listing nodes:', err);
        return err;
    }
}

// 获取集群命名空间列表
export async function listNamespaces() {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const coreV1Api = kc.makeApiClient(CoreV1Api);

        const res = await coreV1Api.listNamespace();
        console.log('Namespaces in the cluster:', JSON.stringify(res.body));
        return res
    } catch (err) {
        console.error('Error listing namespaces:', err);
        return err;
    }
}

// 获取集群中所有的Namespace
export async function getNamespacePods(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const coreV1Api = kc.makeApiClient(CoreV1Api);

    try {
        const res: any = namespace ? await coreV1Api.listNamespacedPod(namespace) : await coreV1Api.listPodForAllNamespaces()
        console.log('listNamespacedPod', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listing pods:', err);
        return err;
    }

}

// 获取集群中所有的Job
export async function getNamespaceJobs(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const batchV1Api = kc.makeApiClient(BatchV1Api);
    try {
        const res: any = namespace ? await batchV1Api.listNamespacedJob(namespace) : await batchV1Api.listJobForAllNamespaces()
        console.log('listNamespacedJob', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listing jobs:', err);
        return err;
    }

}

// 获取集群中所有的PytorchJob
export async function getNamespacePytorchJobs(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    try {
        const res: any = await k8sApi.listNamespacedCustomObject(
            'kubeflow.org',
            'v1',
            namespace || 'default',
            'pytorchjobs'
        )
        console.log('listNamespacedCustomObject', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listNamespacedCustomObject:', err);
        return err;
    }

}

// 获取集群中所有的MPIJob
export async function getNamespaceMPIJobs(namespace?: string): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

    try {
        const res: any = await k8sApi.listNamespacedCustomObject(
            'kubeflow.org',
            'v1',
            namespace || 'default',
            'mpijobs'
        )
        console.log('listNamespacedCustomObject', JSON.stringify(res.body));
        return res;
    } catch (err) {
        console.error('Error listNamespacedCustomObject:', err);
        return err;
    }

}

// 创建 Namespace
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

// 创建 PytorchJob
export async function createPytorchJob(yamlString: string) {
    try {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);

        // 读取 YAML 文件
        // const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const yamlContent = yamlString

        // 解析 YAML 内容
        const pytorchJob: any = jsyaml.load(yamlContent);

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

// 在指定Pod中执行命令
export async function execCommandInPod(namespace: string, podName: string, containerName: string, command: string[]): Promise<{ command: string[], stdout: string, stderr: string }> {
    // 加载 Kubernetes 配置
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    // 创建 API 客户端
    const exec = new k8s.Exec(kc);
    const stdout = new stream.PassThrough();
    const stderr = new stream.PassThrough();

    let stdoutData = '';
    let stderrData = '';

    stdout.on('data', (chunk) => {
        stdoutData += chunk.toString();
    });

    stderr.on('data', (chunk) => {
        stderrData += chunk.toString();
    });

    try {
        const execPromise = new Promise<void>((resolve, reject) => {
            exec.exec(
                namespace,
                podName,
                containerName,
                command,
                stdout,
                stderr,
                null, // stdin
                false, // tty
                (status) => {
                    console.log(`Process exited with status: ${status.status}`);
                    if (status.status === 'Success') {
                        resolve();
                    } else {
                        reject(new Error(`Process exited with status: ${status.status}`));
                    }
                }
            ).catch((error) => {
                console.error('Exec command error:', error);
                reject(error);
            });
        });

        await execPromise.catch((err) => {
            console.error('Error executing command:', err);
        })

        // 等待数据流完成
        stdout.end();
        stderr.end();

        const res = { command, stdout: stdoutData, stderr: stderrData };
        // console.log('Command executed successfully:', res);
        return res;
    } catch (err) {
        console.error('Error executing command:', err);
        return { command: command, stdout: '', stderr: err.message };
    }
}

// 获取指定Pod指定路径下的文件夹列表
export async function listPodFolders(namespace: string, podName: string, containerName: string, path?: string): Promise<{ stdout: string, stderr: string }> {
    let command = ['ls', '-l', '/'];

    if (path) {
        command = ['sh', '-c', `cd ${path} && ls -l | grep '^d'`]
    }
    return await execCommandInPod(namespace, podName, containerName, command);
}

// 获取指定Pod指定路径下的文件/目录列表
export async function listPodFiles(namespace: string, podName: string, containerName: string, path: string = '/', filter?: undefined | 'd' | '-'): Promise<any> {
    let command = ['ls', '-l', path];

    if (filter) {
        command = ['sh', '-c', `ls -l ${path} | grep '^${filter}'`]
    }
    const res = await execCommandInPod(namespace, podName, containerName, command);
    // console.log('listPodFiles', JSON.stringify(res, null, 2));
    const filesList = {
        parent: path,
        files: []
    }

    if (res.stdout !== '') {
        const files = res.stdout.split('\n').map((file: string) => {
            const fileParts = file.split(/\s+/);
            return {
                permissions: fileParts[0],
                type: fileParts[0].charAt(0) === 'd' ? 'directory' : 'file',
                owner: fileParts[2],
                group: fileParts[3],
                size: fileParts[4],
                date: fileParts[5] + ' ' + fileParts[6] + ' ' + fileParts[7],
                name: fileParts.slice(8).join(' ')
            }
        });
        filesList.files = files.filter((file: any) => {
            return file.name !== '';
        });
    }

    return filesList;
}

// 获取指定Pod中的文件列表
export async function listPodFilesInMasterContainer(podName?: string, path: string = '/'): Promise<{ stdout: string, stderr: string }> {
    if (!podName) {
        const pod = await getSystemPod();
        if (pod.stdout === '') {
            return { stdout: '', stderr: 'Pod not found' };
        }
        podName = pod.metadata.name;
    }
    return await listPodFiles('default', podName, 'master', path);
}

// 获取所有系统Pod
export async function getSystemPod() {
    const pods = await getNamespacePods('default');
    const pod = pods.body.items.find((item: any) => item.metadata.name.includes('aihc-helper-job-cpu'));
    // console.log('pod', JSON.stringify(pod, null, 2));
    if (!pod) {
        return { stdout: '', stderr: 'Pod not found' };
    }
    return pod;
}