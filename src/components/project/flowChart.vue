<template>
  <div>
    <ul class="shuiguo">
      <li draggable="true" data-name="ps1">ps1</li>
      <li draggable="true" data-name="ps2">ps2</li>
      <li draggable="true" data-name="ps3">ps3</li>
      <li draggable="true" data-name="ps4">ps4</li>
      <li draggable="true" data-name="switch">switch</li>
    </ul>
    <div id="d1" ondragover="event.preventDefault()">
      <svg>

      </svg>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      dragData: [],
      dWidth: 0, //流程图展示区域宽度
      dHeight: 0, //流程图展示区域高度
      dClient: 0, //流程图展示区偏移位置top
      dLeft: 0, //流程图展示区偏移位置left
    }
  },
  mounted() {
      let self = this
      let shuiguo = $(".shuiguo li")
      for (let i = 0; i < shuiguo.length; i++) {
        shuiguo[i].ondragstart = function() {
          console.log("开始拖动了")
          self.drag(this.innerHTML, this.dataset.name, "outside")
        }
      }

      $("svg").mouseup(function(e) {
        $("svg").unbind("mousemove");
        for (let i = 0; i < self.dragData.length; i++) {
          self.dragData[i].draw = false;
        }
        console.log("起来了");
      });
    },
    methods: {
      init() {
        self.dWidth = Number($("#d1").css("width").slice(0, -2))
        self.dHeight = Number($("#d1").css("height").slice(0, -2))
        self.dClient = $("#d1").offset().top
        self.dLeft = $("#d1").offset().left
      },

      //重置拖拽后流程图展示
      reload(isend) {
        let self = this
        $(function() {
          self.init()

          var html = ""
          var g = `
                    <defs>
                        <marker id="markerArrow1" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,1 L0,5 L3,3 z" fill="#CCCCCC"></path>
                        </marker>
                        <marker id="markerArrow2" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,1 L0,5 L3,3 z" fill="#cccdff"></path>
                        </marker>
                        <marker id="markerArrow3" markerWidth="10" markerHeight="10" refX="3" refY="2.6" orient="auto" markerUnits="strokeWidth">
                            <path fill="#f00" d="m6.75848,4.22161c-0.13193,0.12924 -0.3468,0.12924 -0.47903,0l-3.03436,-2.97252c-0.13193,-0.12953 -0.13223,-0.33974 0,-0.46927c0.13163,-0.12953 0.3465,-0.12953 0.47933,0l3.03406,2.97223c0.13193,0.13012 0.13253,0.34003 0,0.46956l0,0l0,0zm-0.00361,-2.974l-3.03406,2.97223c-0.13253,0.12983 -0.3471,0.12983 -0.47933,0c-0.13223,-0.12924 -0.13223,-0.33915 0.0003,-0.46927l3.03406,-2.97193c0.13253,-0.12953 0.3474,-0.12953 0.47903,-0.0003c0.13253,0.12953 0.13193,0.33974 0,0.46927l0,0l0,0z"/>
                        </marker>
                    </defs>
                  `
          if ($("svg").siblings()) {
            //清除$('svg')范围外的所有元素
            var prev = $("svg").siblings();
            for (var i = 0; i < prev.length; i++) {
              prev[i].remove();
            }
          }
          for (var i = 0; i < self.dragData.length; i++) {
            //循环self.dragData，重置流程图所有dom节点
            if (self.dragData[i] != undefined) {
              let data = self.dragData[i];
              console.log('dragdata',data)
              html += `
                        <div class = "${data.name}" data-drag="1" data-id = "${data.id}" data-inx = "${data.inx}" data-iny = "${data.iny}" data-label = "${data.label}" ondragstart = "insideDrag(this)"  draggable = "true" style = "transform:translate(${data.x}px,${data.y}px)">
                            <span class = "${data.icon}" data-id = "${data.id}"></span>
                            <span data-id = "${data.id}">${data.label}</span>
                            <div class = "output">
                                <span class = "circle" title = "输出" onmousedown = "noDrag(this)" onmouseup = "addDrag(this)" onmouseleave = "draw(this)" onmouseenter = "noMove()" data-id = "${data.id}"></span>
                            </div>
                        </div>
                    `
              if (data.link.length > 0) {
                for (var j = 0; j < data.link.length; j++) {
                  g += `
                      <g id="${data.link[j].name}">
                          <path style="cursor:pointer" d = "M${data.outx} ${data.outy} Q${data.link[j].mx1} ${data.link[j].my1} ${data.link[j].mx2} ${data.link[j].my2} T${data.link[j].dx} ${data.link[j].dy}" stroke = "#CCCCCC" fill = "none" stroke-width="4" marker-end="url(#markerArrow1)"/>
                      </g>
                      `
                }
              }
            }
          }
          $("svg").before(html);
          $("svg").html(g);
          if (isend) {
            $("svg")
              .on("mouseenter", "path", function() {
                $(this).attr({
                  stroke: "#cccdff",
                  "marker-end": "url(#markerArrow2)",
                  "marker-mid": "url(#markerArrow3)"
                });
              })
              .on("mouseleave", "path", function() {
                $(this).attr({
                  stroke: "#cccccc",
                  "marker-end": "url(#markerArrow1)",
                  "marker-mid": ""
                });
              })
              .on("click", "path", function() {
                var $p = $(this).parent();
                var id = $p[0].id;
                for (var i = 0; i < self.dragData.length; i++) {
                  var data = self.dragData[i];
                  for (var j = 0; j < data.link.length; j++) {
                    if (id == data.link[j].name) {
                      data.link.splice(j, 1);
                    }
                  }
                  for (var j = 0; j < data.linked.length; j++) {
                    if (id == data.linked[j].name) {
                      data.linked.splice(j, 1);
                    }
                  }
                }
                $p.remove();
              });
          } else {
            $("svg").off("mouseenter mouseleave", "path");
          }
          console.log($("svg").siblings());
        });
      },

      //模块拖进流程图后，初始化拖拽方法
      /*
      * word：模块名称
      * name:模块数据名称
      * type:拖拽事件类型，用于判断来执行不同拖拽事件，"outside"：拖拽完成，"inside"：开始拖拽
      * id:模块id
      */
      drag(word, name, type, id) {
        let self = this
        //在可拖动元素放置在 <div> 元素中时执行事件ondrop
        document.getElementById("d1").ondrop = function(e) {
          // console.log('放下了')
          let sTop = $(document).scrollTop() //文档滚动条偏移量top
          let sLeft = $(document).scrollLeft() //文档滚动条偏移量left
          let x, y
          if (self.dWidth - e.clientX + self.dLeft + 65 - sLeft >= 132) {
            x = e.clientX - 65 - self.dLeft + sLeft;
          } else {
            x = self.dWidth - 133;
          }
          if (e.clientX - self.dLeft < 65) {
            x = 1;
          }
          if (self.dHeight - e.clientY + self.dClient + 15 - sTop >= 33) {
            y = e.clientY - 15 - self.dClient + sTop;
          } else {
            y = self.dHeight - 33;
          }
          if (e.clientY - 15 - self.dClient + sTop < 0) {
            y = 1;
          }
          if (type == "outside") {
            console.log("放下了")
            self.dragData.push({
              id: self.dragData.length,
              label: word,
              name: name,
              x: x, //模块相对展示区域的位移x
              y: y, //模块相对展示区域的位移y
              outx: x + 68, //模块输出点位置x/贝塞尔曲线起点x
              outy: y + 30, //模块输出点位置y/贝塞尔曲线起点y
              inx: x + 65, //模块输入点位置x
              iny: y - 1, //模块输入点位置y
              link: [], //存放由该模块连接的关联线数据数组
              linked: [], //存放由其他模块连接该模块的关联线数据数组
              dx: 0,
              dy: 0,
              mx1: 0,
              my1: 0,
              mx2: 0,
              my2: 0,
              style: name,
              draw: false,
              icon: name + "Icon"
            });
            console.log(self.dragData);
            self.reload(1);
          }
          if (type == "inside") {
            console.log(word, name, type, id);
            for (var i = 0; i < self.dragData.length; i++) {
              if (id == self.dragData[i].id) {
                self.dragData[i].x = x;
                self.dragData[i].y = y;
                self.dragData[i].outx = self.dragData[i].x + 68;
                self.dragData[i].outy = self.dragData[i].y + 30;
                self.dragData[i].inx = self.dragData[i].x + 65;
                self.dragData[i].iny = self.dragData[i].y - 1;
                console.log("self.dragData[i].link", self.dragData[i].link);
                for (let j = 0; j < self.dragData[i].link.length; j++) {
                  self.dragData[i].link[j].linkId = parseFloat(
                    self.dragData[i].link[j].name.split("|")[1]
                  );
                }
                for (var k = 0; k < self.dragData[i].linked.length; k++) {
                  console.log("self.dragData[i].linked[k]", self.dragData[i].linked[k]);
                  for (let j = 0; j < self.dragData.length; j++) {
                    if (self.dragData[i].linked[k].linkedNum == self.dragData[j].id) {
                      console.log("ID一样了啊");
                      for (let m = 0; m < self.dragData[j].link.length; m++) {
                        if (self.dragData[i].linked[k].name == self.dragData[j].link[m].name) {
                          console.log("名字一样了啊");
                          self.dragData[j].link[m].dx = self.dragData[i].inx;
                          self.dragData[j].link[m].dy = self.dragData[i].iny - 10;
                          self.dragData[j].link[m].mx1 = self.dragData[j].outx;
                          self.dragData[j].link[m].my1 =
                            self.dragData[j].link[m].dy > self.dragData[j].outy
                              ? self.dragData[j].outy +
                                (self.dragData[j].link[m].dy - self.dragData[j].outy) / 3
                              : self.dragData[j].outy -
                                (self.dragData[j].link[m].dy - self.dragData[j].outy) / 3;
                          (self.dragData[j].link[m].mx2 =
                            self.dragData[j].outx +
                            (self.dragData[j].link[m].dx - self.dragData[j].outx) / 2),
                            (self.dragData[j].link[m].my2 =
                              self.dragData[j].outy +
                              (self.dragData[j].link[m].dy - self.dragData[j].outy) / 2);
                        }
                      }
                    }
                  }
                }
                if (self.dragData[i].link.length > 0) {
                  for (var j = 0; j < self.dragData[i].link.length; j++) {
                    self.dragData[i].link[j].mx1 = self.dragData[i].outx;
                    self.dragData[i].link[j].my1 =
                      self.dragData[i].link[j].dy > self.dragData[i].outy
                        ? self.dragData[i].outy +
                          (self.dragData[i].link[j].dy - self.dragData[i].outy) / 3
                        : self.dragData[i].outy -
                          (self.dragData[i].link[j].dy - self.dragData[i].outy) / 3;
                    (self.dragData[i].link[j].mx2 =
                      self.dragData[i].outx +
                      (self.dragData[i].link[j].dx - self.dragData[i].outx) / 2),
                      (self.dragData[i].link[j].my2 =
                        self.dragData[i].outy +
                        (self.dragData[i].link[j].dy - self.dragData[i].outy) / 2);
                  }
                }
              }
            }
            self.reload(1);
          }
        }
        document.getElementById("d1").onclick = function(e) {
          console.log('click', e)
        }
      },

      insideDrag(item) {
        let self = this
        if (item.getAttribute("draggable")) {
          self.drag(item.dataset.label, item.className, "inside", item.dataset.id);
        }
      },

      noDrag(item) {
        let self = this
        event.preventDefault();
        event.stopPropagation();
        var parent = item.parentNode.parentNode;
        parent.setAttribute("draggable", false);
        for (var i = 0; i < self.dragData.length; i++) {
          for (var d = 0; d < self.dragData[i].link.length; d++) {
            if (!~self.dragData[i].link[d].name.indexOf("|")) {
              self.dragData[i].link.splice(d, 1);
            }
          }
          if (parent.dataset.id == self.dragData[i].id) {
            self.dragData[i].draw = true;
            self.dragData[i].link.push({
              name: parent.dataset.id + parent.className,
              dx: 0,
              dy: 0,
              mx1: 0,
              my1: 0,
              mx2: 0,
              my2: 0
            });
            $("body").on("mouseup", function(e) {
              for (var j = 0; j < self.dragData.length; j++) {
                if (parent.dataset.id == self.dragData[j].id) {
                  console.log("页面抬起了");
                  self.dragData[j].draw = false;
                  var $dom = $(e.target).data("drag")
                    ? $(e.target)
                    : $(e.target).closest("div[data-drag]");
                  if ($dom.length) {
                    if ($dom.data("drag") && $dom[0].dataset.id != self.dragData[j].id) {
                      //判断是否关联另外模块，非自己
                      $("svg").unbind("mousemove");
                      var name =
                        self.dragData[j].link[self.dragData[j].link.length - 1].name +
                        "|" +
                        $dom[0].dataset.id +
                        $dom[0].className;
                      var isontbe = 0; //判断是否存在关联
                      for (let i = 0; i < self.dragData.length; i++) {
                        if ($dom[0].dataset.id == self.dragData[i].id) {
                          for (let c = 0; c < self.dragData[i].linked.length; c++) {
                            if (name == self.dragData[i].linked[c].name) {
                              isontbe = 1;
                            }
                          }
                          if (!isontbe) {
                            //不存在时候存入linked
                            self.dragData[i].linked.push({
                              name: name,
                              linkedNum: parseFloat(name)
                            });
                          }
                        }
                      }
                      if (!isontbe) {
                        //不存在时候生成link数据
                        self.dragData[j].link[self.dragData[j].link.length - 1].name = name;
                        self.dragData[j].link[self.dragData[j].link.length - 1].dx = Number(
                          $dom[0].dataset.inx
                        );
                        self.dragData[j].link[self.dragData[j].link.length - 1].dy =
                          Number($dom[0].dataset.iny) - 10;
                      } else {
                        self.dragData[j].link.splice(self.dragData[j].link.length - 1, 1);
                      }
                    } else {
                      self.self.dragData[j].link.splice(self.dragData[j].link.length - 1, 1);
                    }
                  } else {
                    self.dragData[j].link.splice(self.dragData[j].link.length - 1, 1);
                  }
                  $("svg").unbind("mousemove");
                  self.reload(1);
                }
              }
              $("body").unbind("mouseup");
            });
            //self.reload();
          }
        }
      },

      addDrag(item) {
        let self = this
        var parent = item.parentNode.parentNode;
        parent.setAttribute("draggable", true);
        for (var i = 0; i < self.dragData.length; i++) {
          if (parent.dataset.id == self.dragData[i].id) {
            self.dragData[i].draw = false;
          }
        }
      },

      draw(item) {
        let self = this
        var parent = item.parentNode.parentNode;
        parent.setAttribute("draggable", true);
        for (var i = 0; i < self.dragData.length; i++) {
          if (parent.dataset.id == self.dragData[i].id) {
            if (self.dragData[i].draw == true) {
              $("svg").mousemove(function(e) {
                for (var i = 0; i < self.dragData.length; i++) {
                  if (parent.dataset.id == self.dragData[i].id) {
                    if (self.dragData[i].link[self.dragData[i].link.length - 1]) {
                      self.dragData[i].link[self.dragData[i].link.length - 1].dx = e.offsetX;
                      self.dragData[i].link[self.dragData[i].link.length - 1].dy =
                        e.offsetY - 10;
                      self.dragData[i].link[self.dragData[i].link.length - 1].mx1 =
                        self.dragData[i].outx;
                      self.dragData[i].link[self.dragData[i].link.length - 1].my1 =
                        self.dragData[i].dy > self.dragData[i].outy
                          ? self.dragData[i].outy + (self.dragData[i].dy - self.dragData[i].outy) / 3
                          : self.dragData[i].outy -
                            (self.dragData[i].dy - self.dragData[i].outy) / 3;
                      (self.dragData[i].link[self.dragData[i].link.length - 1].mx2 =
                        self.dragData[i].outx + (self.dragData[i].dx - self.dragData[i].outx) / 2),
                        (self.dragData[i].link[self.dragData[i].link.length - 1].my2 =
                          self.dragData[i].outy + (self.dragData[i].dy - self.dragData[i].outy) / 2);
                    }
                    //////////////////////////////////////////////
                    self.dragData[i].dx = e.offsetX;
                    self.dragData[i].dy = e.offsetY - 10;
                    self.dragData[i].mx1 = self.dragData[i].outx;
                    if (self.dragData[i].dy > self.dragData[i].outy) {
                      self.dragData[i].my1 =
                        self.dragData[i].outy + (self.dragData[i].dy - self.dragData[i].outy) / 3;
                    } else {
                      self.dragData[i].my1 =
                        self.dragData[i].outy - (self.dragData[i].dy - self.dragData[i].outy) / 3;
                    }
                    self.dragData[i].mx2 =
                      self.dragData[i].outx + (self.dragData[i].dx - self.dragData[i].outx) / 2;
                    self.dragData[i].my2 =
                      self.dragData[i].outy + (self.dragData[i].dy - self.dragData[i].outy) / 2;
                  }
                }
                self.reload();
              });
            } else {
              $("svg").unbind("mousemove");
            }
          }
        }
      },

      noMove() {
        let self = this
        $("svg").unbind("mousemove");
      }
    }
  }
</script>

<style scoped>
#d1 {
  width: 800px;
  height: 800px;
  border: 1px solid #ccc;
  position: relative;
  background: #fafafa;
}

#d1 > div {
  width: 130px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: absolute;
  z-index: 2;
  text-align: center;
  line-height: 30px;
  background: #fff;
}

#d1 > svg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.input .point {
  position: absolute;
  border: 6px solid transparent;
  border-top: 6px solid #ccc;
  top: 0px;
  left: 58px;
}

.input .circle {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #ccc;
  top: -7px;
  left: 60px;
  border-radius: 50%;
  background: #fff;
}

.output .circle {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 1px solid #ccc;
  bottom: -10px;
  left: 57px;
  border-radius: 50%;
  background: #fff;
  cursor: crosshair;
  z-index: 10;
}

.output .circle:hover {
  background: #fc9901;
}
</style>

