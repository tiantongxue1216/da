<template>
    <Row :gutter="16">
      <Col :span="3">
        <module-list />
      </Col>
      <Col :span="18" class="middle_box">
        <workArea />
      </Col>
      <Col :span="3" class="right_box">
        <prop-list />
      </Col>
    </Row>
</template>
<script>
import moduleList from './moduleList'
import propList from './propList'
import workArea from './workArea'
  export default {
    components: {
      moduleList,
      propList,
      workArea
    },
    data () {
      return {
      }
    },

    methods: {

    }
  }
</script>

<style lang='less'>
  .middle_box {
    background: #00f;
  }
</style>
