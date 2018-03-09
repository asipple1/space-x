
<template id="post-template">
  <div>
    <router-link :to="{ name: 'space' }">Homepage</router-link>
    <img :src="rocket.links.mission_patch"  class="image"/>
    <!-- {{ rocket }}

    <p>Flight Number: {{ rocket.flight_number }}</p>
    <p>Launch Date: {{ launch_date(rocket.launch_date_utc) }}</p>
    <h2>Rocket Used {{ rocket.rocket.rocket_name }}</h2>
    <b>First Stage Data</b>
    <div v-for="(data, key, index)  in rocket.rocket.first_stage.cores">
      <div v-for="(core, key1, index)  in data" class="link">
        <p>{{ key1 }} - {{ core }}</p>
      </div>
    </div>
    <br>
    <b>Second Stage Data</b>
    <div v-for="(data, key, index)  in rocket.rocket.second_stage.payloads">
      <div v-for="(core, key1, index)  in data" class="link">
        <p>{{ key1 }} - {{ core }}</p>
      </div>
    </div> -->
    <div v-for="(link, key, index)  in rocket.links" class="link">
      <a v-bind:href="link" target="_blank">{{ key }}</a>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';
  export default {
    name: 'rocket',
    data () {
      return {
          rocket: [],
          mission_patch: '',
          show_failed_rockets: false
      }
    },
    created () {
      var id = this.$route.params.id;
      axios.get(`https://api.spacexdata.com/v2/launches/?flight_number=${id}`).then(response => {
          this.rocket = response.data[0];
      });
    },
    methods: {
      launch_date: function (date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
      }
    },
    computed: {
      filterRockets: function() {
        let showRocketFailed = this.show_failed_rockets;
        return this.rockets.filter((rocket) => {
          if(showRocketFailed) {
            if(rocket.launch_success == false) {
              return rocket;
            }
          }
          else {
            return rocket;
          }
        });
      }
    }
  }
</script>

<style lang='scss' scoped>
  .image {
    max-width: 350px;
  }
</style>
