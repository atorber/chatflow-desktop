
export const yamlCreate = (command:string, imageUrl:string, envs?:string) => {

return (`
apiVersion: v1
data:
  launch.sh: |-
${command}

kind: ConfigMap
metadata:
  name: launch-cm-llama2-7b-tp1-pp1-dp8-zero1
  namespace: default
---
apiVersion: "kubeflow.org/v1"
kind: PyTorchJob
metadata:
  name: megatron-llama2-7b-tp1-pp1-dp8-zero1
  namespace: default
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      restartPolicy: Never
      template:
        metadata:
        spec:
          schedulerName: volcano
          containers:
            - name: pytorch
              image: ${imageUrl}
              imagePullPolicy: Always
              command:
                - bash
                #- -c
                #- sleep 1d
                - /workspace/Megatron-LM/examples/launch.sh
              env:
${envs}                   
              resources:
                limits:
                  nvidia.com/gpu: 8
                  rdma/hca: 1
              securityContext:
                capabilities:
                  add: [ "IPC_LOCK" ]
              volumeMounts:
                - mountPath: /dev/shm
                  name: cache-volume
                - name: config-volume
                  mountPath: /workspace/Megatron-LM/examples/launch.sh
                  subPath: launch.sh
                - name: data
                  mountPath: /mnt/cluster
          volumes:
            - name: cache-volume
              emptyDir:
                medium: Memory
            - name: config-volume
              configMap:
                name: launch-cm-llama2-7b-tp1-pp1-dp8-zero1
            - name: data
              persistentVolumeClaim:
                claimName: pvc-pfs
`)
}