<template>
  <!-- <task-work-area width='100%' height='100%' id="areaID" @on-drag-over="dragOver" @on-mouse="mouseMenu" @on-add-nodemodel="addNodeModel" ref="area" :ini='ini'> -->
  <task-work-area width='100%' height='100%' :id="work_id" @on-mouse="mouseMenu" @on-add-nodemodel="addNodeModel" ref="area" :ini='ini'>
    <!--节点间连线依赖<task-curve-path>组件，所以该组件必需添加的，之后我会使用其他方法替代此组件-->
    <task-curve-path :areaid="work_id" :paths="paths" ref="curve" @on-mouse="mouseFn" @on-mouse-over="mouseOverFn" @on-mouse-out="mouseOutFn"></task-curve-path>
    <task-common-node v-for="item in nodes" :node='item' :key="item.id" @on-add-path="addPath" @on-select="selectlMethod" @on-drag-start="dragStart" @on-drag-ging="dragGing" @on-drag-end="dragEnd" :updateTem="updateCompleted" @on-mouse="mouseNodeMenu"></task-common-node>
  </task-work-area>
</template>

<script>
import node from './node'

export default {
  components: {
    node,
  },
  data() {
    return {
      work_id: 'work_id',//工作区id
      ini: {
        lineType: {
          type: [String],
          default: 'Q'
        },
        isDotted: {
          type: [Boolean],
          default: false
        },
        scaling: {
          type: [Object],
          default: {ZoomX: 1, ZoomY: 1}
        }
      },
      paths:[],
      nodes: [],
      startNode: {}
    }
  },
  computed: {
    //当前连接线的数据信息
    vconfig() {
      return this.$store.getters.getViConfig;
    }
  },
  mounted() {

  },
  methods: {
    addNodeModel (event, node) {
      console.log('添加节点', event, event.clientX, event.clientY)
      let newNode = {}
      newNode = node
      newNode.id = 'node' + Math.floor(Math.random() * 100)
      newNode.positionX = node.positionX - 90 // -15 -90 定位到节点的终点
      newNode.positionY = node.positionY - 15
      // newNode.state = "success",
      this.nodes.push(newNode)
    },
    mouseFn (event, portData) {
      console.log('mouseFn', 'on-mouse', '鼠标右击路径事件', event, portData)
    },
    mouseOverFn (event, portData) {
      console.log('mouseFn', 'on-mouse-over', '鼠标划入路径事件', event, portData)
    },
    mouseOutFn (event, portData) {
      console.log('mouseFn', 'on-mouse-out', '鼠标划出路径事件', event, portData)
    },
    selectlMethod (event, data, node) {
      console.log('selectlMethod', 'on-select', '节点左键点击事件', event, data, node)
    },
    dragStart (event, node) {
      let nodeData = event.dataTransfer.getData("nodedata")
      // console.log(
      //   "节点开始移动",
      //   event.clientX,
      //   event.clientY,
      //   node,
      //   JSON.parse(nodeData)
      // )
      this.startNode = {
        id: node.id,
        positionX: event.clientX,
        positionY: event.clientY
      }
    },
    dragGing (event) {
      console.log("节点移动中...", event.clientX, event.clientY)
    },
    dragEnd (event, node) {
      // console.log("节点移动结束", event.clientX, event.clientY, node);
      this.nodes.forEach(item => {
        if (item.id === node.id) {
          item.positionX = node.positionX + (event.clientX - this.startNode.positionX);
          item.positionY = node.positionY + (event.clientY - this.startNode.positionY);
        }
      })
    },
    addPath (event, startData, endData) {
      console.log('添加路径', event, startData, endData)
      this.nodes.forEach(item => {
        item.inPorts.forEach(ins => {
          if (ins.id === endData) {
            ins.isConnected = true;
          }
        });
      });
      setTimeout(() =>  {
        this.paths.push({
          dotted: this.vconfig.dotted,
          ptype: this.vconfig.pathType,
          startPort: startData,
          endPort: endData
        });
      }, 200);
    },
    updateCompleted () {
      console.log('updateCompleted!!')
      // 重新加载路径
      this.$refs.curve.vReload()
    },
    //工作区右击事件
    mouseMenu (event, id) {
      console.log('mouseMenu', 'on-mouse', '工作区右击事件', event, id)
    },
    mouseNodeMenu (event, node) {
      console.log('mouseNodeMenu', 'on-mouse', '节点右击事件', event, node)
    }
  }
}
</script>

<style>

</style>


