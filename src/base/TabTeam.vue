<template lang='pug'>
        .tab
          team( :user='user' )
</template>
<script>
import team from '@/components/Team.vue'
export default {
    props: [ 'user' ],
    components: {
         team
    }

}
</script>
<style scoped>
h1 {
    padding:50%
}
</style>