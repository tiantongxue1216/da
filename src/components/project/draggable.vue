<template>
  <div class="draggable" v-on:mousedown="onMousedown"  v-bind:style="[style, computedStyle]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    revert: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    }
  },
  data () {
    return {
      initial: {
        x: 0,
        y: 0
      },
      mouse: {
        down: false
      },
      log: null,
      position: {
        x: 0,
        y: 0
      },
      style: {

      }
    }
  },
  computed: {
    computedStyle() {
      return {
        transform: "translate3d(" + this.position.x + "px, " + this.position.y + "px, 0)"
      }
    }
  },
  mounted() {
    console.log(333333333333,this.$el)
    let that = this;
    document.body.addEventListener("mousemove", function (event) {
      if (that.mouse.down) {
        that.position.x = event.pageX - that.initial.x
        that.position.y = event.pageY- that.initial.y
        that.style.transition = "none"
        this.log = event
      }
    })
    this.loop()
  },
  methods: {
    loop() {
      let that = this;
      window.requestAnimationFrame(function () {
        that.loop();
      })
    },
    onMousedown() {
      this.mouse.down = true;
      this.initial.x = event.offsetX;
      this.initial.y = event.offsetY;
      let that = this;
      document.body.addEventListener("mouseup", function () {
        that.mouse.down = false;
        if (that.revert) {
        that.position.x = 0;
        that.position.y = 0;
        that.style.transition = "all 0.2s";
      }
      })
    }
  }
}
</script>

<style>
  .draggable {
    z-index: 100;
    position: relative;
  }

  .box {
    margin: 0rem;
    padding: 0;
    cursor: pointer;
    display: block;
    width: 100px;
    height: 100px;
    background: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    transition: all 0.15s;
    position: absolute;
  }

  .box:hover {
    transform: scale(1.05);
  }
</style>


