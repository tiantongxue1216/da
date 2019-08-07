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
          id: 'nodeo',
          name: '节点o',
          inPorts: [{
            id: 'node1_1',
            isConnected: false
          },
          {
            id: 'node1_2',
            isConnected: false
          }],
          outPorts: [{
            id: 'node1_3',
            isConnected: false
          }]
        },
        {
          id: '12',
          name: 'SQL',
          inPorts: [{
            id: 'node2_1',
            isConnected: false
          }],
          outPorts: [{
            id: 'node2_2',
            isConnected: false
          }]
        },
        {
          id: '13',
          name: 'WorkData',
          inPorts: [{
            id: 'node3_1',
            isConnected: false
          }],
          outPorts: [{
            id: 'node3_2',
            isConnected: false
          }]
        },
        {
          id: '14',
          name: 'TableToTV',
          inPorts: [{
            id: 'node4_1',
            isConnected: false
          }],
          outPorts: [{
            id: 'node4_2',
            isConnected: false
          }]
        },
        {
          id: '15',
          name: '增加系列',
          inPorts: [{
            id: 'node4_1',
            isConnected: false
          }],
          outPorts: [{
            id: 'node4_2',
            isConnected: false
          }]
        }
      ],
    }
  }
}
</script>

<style>

</style>


