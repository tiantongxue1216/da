<template>
  <ul>
    <li style="border-bottom: 2px solid aliceblue;" v-for="item in nodeModels" :key="item.id">
      <task-node-model :node="item">
        <span class="task-node-model-label">{{item.name}}</span>
      </task-node-model>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      nodeModels: [
        {
          id: 'node0',
          name: '节点0',
          inPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }],
          outPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }]
        },
        {
          id: 'node1',
          name: '节点1',
          inPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }],
          outPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }]
        },
        {
          id: 'node2',
          name: '节点2',
          inPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }],
          outPorts: [
            {
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }]
        },
        {
          id: 'node3',
          name: '节点3',
          inPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }],
          outPorts: [{
            type: '1',
            isConnected: false
          },
          {
            type: '2',
            isConnected: false
          },
          {
            type: '3',
            isConnected: false
          }]
        },
      ],
    }
  }
}
</script>

<style>

</style>


