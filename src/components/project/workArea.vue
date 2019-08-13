<template>
  <!-- <task-work-area width='100%' height='100%' id="areaID" @on-drag-over="dragOver" @on-mouse="mouseMenu" @on-add-nodemodel="addNodeModel" ref="area" :ini='ini'> -->
  <task-work-area width='100%' height='100%' :id="work_id" @on-mouse="mouseMenu" @on-add-nodemodel="addNodeModel" ref="area" :ini='ini'>
    <!--节点间连线依赖<task-curve-path>组件，所以该组件必需添加的，之后我会使用其他方法替代此组件-->
    <!-- <task-curve-path :class="{'pathIsSelected': pathIsSelected}" :areaid="work_id" :paths="paths" ref="curve" @on-mouse="mouseFn" @on-mouse-over="mouseOverFn" @on-mouse-out="mouseOutFn" @click="handlePathClick"></task-curve-path> -->
    <task-curve-path :areaid="work_id" :paths="paths" ref="curve" @on-mouse="mouseFn" @on-mouse-over="mouseOverFn" @on-mouse-out="mouseOutFn" @on-click="pathClickFn"></task-curve-path>
    <task-common-node v-for="item in nodes" :class="{'nodeIsSelected': (selected_node_ids.indexOf(item.id)!==-1)}" :ref="'node'+item.id" :node='item' :key="item.id" @on-add-path="addPath" @on-select="selectMethod" @on-drag-start="dragStart" @on-drag-ging="dragGing" @on-drag-end="dragEnd" :updateTem="updateCompleted" @on-mouse="mouseNodeMenu"></task-common-node>
  </task-work-area>
</template>

<script>
import { timeout } from 'q';

export default {
  components: {
  },
  data() {
    return {
      work_id: 'work_id',//工作区id
      curr_selected_path: [],//当前选中连接线
      selected_paths: [],//选中连线的[startPor, endPort]
      selected_node_ids: [],//储选中的节点的id
      IsShiftOrCtrDown: false,//是否按下shift或者ctr键
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
      paths:[
        {
          dotted: false,
          ptype: "Q",
          startPort: "node1_4",
          endPort: "node2_1",
        }
      ],
      nodes: [],
      startNode: {}
    }
  },
  computed: {
    //当前连接线的数据信息
    vconfig() {
      return this.$store.getters.getViConfig;
    },
    pathIsSelected() {
      let pathIsSelected = false
      for(let item of this.selected_paths) {
        if(item[0] === this.curr_selected_path[0] && item[1] === this.curr_selected_path[1]) {
          pathIsSelected = true
          break
        }
      }
      return pathIsSelected
    }
  },
  mounted() {
    document.addEventListener('keydown',this.checkKeyDown)
    document.addEventListener('keyup', this.checkKeyUp)
  },
  methods: {
    //节点选中事件
    selectMethod(event, node, ref) {
      if(this.IsShiftOrCtrDown) {
        this.selected_node_ids.push(node.id)
      }else {
        this.selected_node_ids = []
        this.selected_node_ids[0] = node.id
      }
    },
    //删除选中节点以及节点周围的连线
    delete() {
      for(let item of this.selected_node_ids) {
        let delIndex = this.findIndexOfArr(this.nodes, item)
        if(delIndex !== -1) {
          this.nodes.splice(delIndex, 1)
          this.paths = this.paths.filter(pathItem => {
            return (pathItem.startPort.indexOf(item) === -1 && pathItem.endPort.indexOf(item) === -1)
          })
        }
      }
    },
    //查找相应id在array中的index
    findIndexOfArr(array,id) {
      let resIndex = -1
      for(let index in array) {
        if(array[index].id === id) {
          resIndex = index
          break
        }
      }
      return resIndex
    },

    //点击连接线事件
    pathClickFn(event, portData) {
      this.curr_selected_path = portData
      if(this.IsShiftOrCtrDown) {
        this.selected_paths.push(portData)
      }else {
        this.selected_paths = []
        this.selected_paths[0] = portData
      }
      console.log('左击连线事件', event, portData)
    },
    //删除连线
    deletePaths() {
      for(let item of this.selected_paths) {
        let delIndex = this.findPathIndexOfArr(this.paths, item)
        if(delIndex !== -1) {
          this.paths.splice(delIndex, 1)
        }
      }
    },
    //查找[startPort, endPort]在paths中的index
    findPathIndexOfArr(array ,item) {
      let resIndex = -1
      for(let index in array) {
        if((array[index].startPort === item.startPort) && (array[index].endPort === item.endPort)) {
          resIndex = index
          break
        }
      }
      return resIndex
    },
    checkKeyDown(e) {
      let event = window.event || e
      let code = event.which || event.keyCode
      if(code === 46) {//按delete键
        // this.delete()
        this.deletePaths()
      }
      if(code === 16 || code === 17) {//按shift或者ctrl键
        this.IsShiftOrCtrDown = true
      }
    },
    checkKeyUp(e) {
      let event = window.event || e
      let code = event.which || event.keyCode
      if(code === 16 || code === 17) {
        this.IsShiftOrCtrDown = false
      }
    },
    //拖拽组件到画布
    addNodeModel (event, node) {
      let newNode = {}
      newNode = node
      newNode.id = 'node' + (new Date()).getTime()//最终使用由后端返回id
      //生成锚点id
      newNode.inPorts.forEach(item => {
        item.id =  `${newNode.id}_in_${item.type}`
      })
      newNode.outPorts.forEach(item => {
        item.id =  `${newNode.id}_out_${item.type}`
      })
      newNode.positionX = node.positionX - 90 // -15 -90 定位到节点的终点
      newNode.positionY = node.positionY - 15
      // newNode.state = "success",
      this.nodes.push(newNode)
    },
    mouseFn (event, portData) {
      console.log('mouseFn', 'on-mouse', '鼠标右击路径事件', event, portData)
    },
    //鼠标划入路径事件
    mouseOverFn (event, portData) {
      console.log('mouseFn', 'on-mouse-over', '鼠标划入路径事件', event, portData)
    },
    mouseOutFn (event, portData) {
      console.log('mouseFn', 'on-mouse-out', '鼠标划出路径事件', event, portData)
    },
    dragStart (event, node) {
      let nodeData = event.dataTransfer.getData("nodedata")
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
      if(startData.split('_')[2] === endData.split('_')[2]) {
      //   this.nodes.forEach(item => {
      //   item.inPorts.forEach(ins => {
      //     if (ins.id === endData) {
      //       ins.isConnected = true
      //     }
      //   })
      // })
      setTimeout(() =>  {
        this.paths.push({
          dotted: this.vconfig.dotted,
          ptype: this.vconfig.pathType,
          startPort: startData,
          endPort: endData
        });
      }, 200);
      }
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
    },

  }
}
</script>

<style lang="less" scoped>

</style>

<style lang="less">
  @import "./style/customStyle.less";
</style>



