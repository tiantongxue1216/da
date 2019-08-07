<template>
  <task-common-node :key="node.id" :node="node" v-on:on-add-path="addPath" v-on:on-select="selectlMethod" v-on:on-drag-start="dragStart" v-on:on-drag-ging="dragGing" v-on:on-drag-end="dragEnd" :updateTem="updateCompleted" v-on:on-mouse="mouseNodeMenu"></task-common-node>
</template>
<script>
import { NodeMix } from 'vue-task-node'//步骤4:必需混入NodeMix，因为<task-node>中的方法都存放在此js中
export default {
  components: {},
  mixins: [ NodeMix ],//混入NodeMix
  name: 'node-erhombus',//自己取的节点名称
  props: {
    node: {
      type: Object,
      required: true,
      default() {
        return {
          id: 'node1',
          name: '节点1',
          positionX: 115,
          positionY: 180,
          state: 'success',
          inPorts: [{
            id: 'node1_1',
            isConnected: true
          }],
          outPorts: [{
            id: 'node1_4'
          }]
        }
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    addPath(event, outputId, inputId) {
      console.log('addPath', event, outputId, inputId)
    },
    selectlMethod(event, node, ref) {
      console.log('selectEvent', event, node, ref)
    },
    dragStart(event, node) {
      console.log('dragStart', event, node)
    },
    dragGing(event) {
      console.log('dragGing', event)
    },
    dragEnd(event, node) {
      console.log('dragEng', event, node)
    },
    updateCompleted() {
      console.log('updateCompleted')
    },
    mouseNodeMenu() {
      console.log('右击节点事件')
    }
  }
}
</script>
<style>
  .top-in{
    clear: both;
    margin-top: -5px;
    float: left;
    width: 30px;
    height: 30px;
  }
  .left-out{
    clear: both;
    float: left;
    margin-left: -5px;
    height: 30px;
  }
  .right-out{

  }
  .bottom-out{
    clear: both;
    float: left;
    width: 30px;
  }
  .node-erhombus-class{
    height: 60px;
    width: 60px;
    border: 1px solid #289de9;
  }
</style>
