<template>
  <div>
    <!-- <div class="modules">
      <module-list />
    </div> -->
    <div class="flowChart">
      <flow-chart />
    </div>
    <div class="properties">
      <!-- <prop-list /> -->
    </div>
  </div>
</template>

<script>
import moduleList from './moduleList'
import flowChart from './flowChart'
import propList from './propList'
export default {
  name: 'index',
  components: {
    moduleList,
    flowChart,
    propList
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
