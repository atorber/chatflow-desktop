export const cpuJobYaml = () => {
    return `apiVersion: batch/v1
kind: Job
metadata:
  name: aihc-helper-job-cpu
spec:
  template:
    metadata:
      name: aihc-helper-job-cpu
    spec:
      containers:
      - name: master
        image: registry.cn-hangzhou.aliyuncs.com/acs-sample/alpine
        command: ["sh", "-c", "echo Hello, Kubernetes Job! && sleep 30000000000"]
        volumeMounts:
         - name: data
           mountPath: /mnt/cluster
      restartPolicy: Never
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: pvc-pfs
  backoffLimit: 4`
}

export const gpuJobYamlOnePod = () => {
    return `apiVersion: "kubeflow.org/v1"
kind: PyTorchJob
metadata:
  name: megatron-llama2-7b-tp1-pp1-dp8-zero1-luyc
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
              image: registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v2.1.0.1_release
              imagePullPolicy: Always
              command:
                - bash
                - -c
                - sleep 1d
                # - /workspace/Megatron-LM/examples/launch.sh
              env:
                - name: CUDA_DEVICE_MAX_CONNECTIONS
                  value: "1"
                       
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
                - name: data
                  mountPath: /mnt/cluster
          volumes:
            - name: cache-volume
              emptyDir:
                medium: Memory
            - name: config-volume
              configMap:
                name: launch-cm-llama2-7b-tp1-pp1-dp8-zero1-luyc
            - name: data
              persistentVolumeClaim:
                claimName: pvc-pfs
`
}

export const gpuJobYamlManyPods = () => {
    return `apiVersion: "kubeflow.org/v1"
kind: PyTorchJob
metadata:
  name: mcore—llama3—70b—tp4—pp4-luyc
  namespace: default
  annotations:
    aitemplate.cce.baidu.com/data-source: |-
      [{
        "type": "pvc",
        "name": "pvc-pfs",
        "pvc": "pvc-pfs",
        "mountPath": "/mnt/cluster"
      }]
    scheduling.volcano.sh/queue-name: default
    aitemplate.cce.baidu.com/script: |-
      #! /bin/bash
      
      MEGATRON_PATH=\${MEGATRON_PATH:-"/workspace/AIAK-Megatron"}
      AIAK_TRAINING_PATH=\${AIAK_TRAINING_PATH:-"/workspace/AIAK-Training-LLM"}
      
      DATA_PATH=$DATA_PATH
      CHECKPOINT_LOAD_PATH=$CHECKPOINT_LOAD_PATH
      CHECKPOINT_SAVE_PATH=$CHECKPOINT_SAVE_PATH
      TOKENIZER_PATH=$TOKENIZER_PATH
      TENSORBOARD_PATH=$TENSORBOARD_PATH      
      
      GPUS_PER_NODE=8
      
      # Change for multinode config
      MASTER_ADDR=\${MASTER_ADDR:-"localhost"}
      MASTER_PORT=\${MASTER_PORT:-"6000"}
      NNODES=\${WORLD_SIZE:-"1"}
      NODE_RANK=\${RANK:-"0"}
      
      DISTRIBUTED_ARGS=(
      --nproc_per_node $GPUS_PER_NODE
      --nnodes $NNODES
      --node_rank $NODE_RANK
      --master_addr $MASTER_ADDR
      --master_port $MASTER_PORT
      )
      
      # you can setup llama3-70b maunally
      #MODEL_ARGS=(
      #    --model-name llama3
      #    --num-layers 80
      #    --hidden-size 8192
      #    --ffn-hidden-size 28672
      #    --num-attention-heads 64
      #    --position-embedding-type rope
      #    --normalization RMSNorm
      #    --swiglu
      #    --attention-dropout 0
      #    --hidden-dropout 0
      #    --disable-bias-linear
      #    --no-position-embedding
      #    --untie-embeddings-and-output-weights
      #    --group-query-attention
      #    --num-query-groups 8
      #)
      
      # or you can setup llama3-70b by using the following command
      MODEL_ARGS=(
      --model-name llama3-70b # options: llama3-8b, llama3-70b
      --rotary-base 500000
      )
      
      DATA_ARGS=(
      --tokenizer-type HFTokenizer
      --hf-tokenizer-path $TOKENIZER_PATH
      --data-path $DATA_PATH
      --split 949,50,1
      )
      
      TRAINING_ARGS=(
      --training-phase pretrain # options: pretrain, sft
      --seq-length 4096
      --max-position-embeddings 4096
      --init-method-std 0.02
      --micro-batch-size 1
      --global-batch-size 1024
      --lr 0.0002
      --min-lr 1.0e-5
      --clip-grad 1.0
      --weight-decay 0.01
      --optimizer adam
      --adam-beta1 0.9
      --adam-beta2 0.95
      --adam-eps 1e-05
      --norm-epsilon 1e-05
      --train-iters 50000
      --lr-decay-iters 50000
      --lr-decay-style cosine
      --lr-warmup-fraction 0.002
      --initial-loss-scale 65536
      --bf16
      --load $CHECKPOINT_LOAD_PATH
      --save $CHECKPOINT_SAVE_PATH
      --save-interval 5000
      --eval-interval 1000
      --eval-iters 10
      #--ckpt-step 0
      #--no-load-optim
      #--no-load-rng
      )
      
      MODEL_PARALLEL_ARGS=(
      --tensor-model-parallel-size 4
      --pipeline-model-parallel-size 4
      --context-parallel-size 1
      --use-distributed-optimizer
      --overlap-grad-reduce
      --overlap-param-gather
      --distributed-backend nccl
      --sequence-parallel
      #--tp-comm-overlap # require mpi envrionment
      )
      
      LOGGING_ARGS=(
      --log-interval 1
      --tensorboard-dir \${TENSORBOARD_PATH}
      --log-timers-to-tensorboard
      )
      
      if [ -n "\${WANDB_API_KEY}" ]; then
      LOGGING_ARGS+=(
      --wandb-project \${WANDB_PROJECT}
      --wandb-exp-name \${WANDB_NAME}
      )
      fi
      
      PYTHONPATH=$MEGATRON_PATH:$AIAK_TRAINING_PATH:$PYTHONPATH \
      torchrun \${DISTRIBUTED_ARGS[@]} \
      $AIAK_TRAINING_PATH/aiak_training_llm/train.py \
      \${MODEL_ARGS[@]} \
      \${DATA_ARGS[@]} \
      \${TRAINING_ARGS[@]} \
      \${MODEL_PARALLEL_ARGS[@]} \
      \${LOGGING_ARGS[@]}
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
              image: registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v2.0.1.2_release
              imagePullPolicy: Always
              command:
                - bash
                #- -c
                #- sleep 1d
                - /workspace/Megatron-LM/examples/launch.sh
              env:
                - name: CUDA_DEVICE_MAX_CONNECTIONS
                  value: "1"
                - name: NCCL_DEBUG
                  value: INFO
                - name: NCCL_IB_DISABLE
                  value: "0"
                # - name: NCCL_IB_GID_INDEX
                #   value: "0"
                - name: MASTER
                  value: "1"
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
                name: launch-cm-mcore—llama3—70b—tp4—pp4-luyc
            - name: data
              persistentVolumeClaim:
                claimName: pvc-pfs
    Worker:
      replicas: 7
      restartPolicy: Never
      template:
        spec:
          schedulerName: volcano
          containers:
            - name: pytorch
              image: registry.baidubce.com/aihc-aiak/aiak-training-llm:ubuntu22.04-cu12.3-torch2.2.0-py310_v2.0.1.2_release
              imagePullPolicy: Always
              command:
                - bash
                #- -c
                #- sleep 1d
                - /workspace/Megatron-LM/examples/launch.sh
              env:
                - name: CUDA_DEVICE_MAX_CONNECTIONS
                  value: "1"
                - name: NCCL_DEBUG
                  value: INFO
                - name: NCCL_IB_DISABLE
                  value: "0"
                # - name: NCCL_IB_GID_INDEX
                #   value: "0"
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
                name: launch-cm-mcore—llama3—70b—tp4—pp4
            - name: data
              persistentVolumeClaim:
                claimName: pvc-pfs`
}