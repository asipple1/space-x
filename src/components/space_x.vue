<template>
  <div class="container">
    <div class="filters">
      <div class="field-group">
        <input type="checkbox" v-model="show_failed_rockets">
        <label>Show rockets that failed launch.</label>
      </div>
    </div>
    <transition-group name="fade" tag="div" class="cards-wrapper">>
      <div v-for="rocket in filterRockets" v-bind:key="rocket" class="card">
        <div class="card__inner">
          <div class="card__image">
            <img :src="rocket.links.mission_patch" />
          </div>
          <ul>
            <li>Flight Number: {{ rocket.flight_number }}</li>
            <li>Launch Date: {{ launch_date(rocket.launch_date_utc) }}</li>
            <li v-if="rocket.launch_success">
              Rocket Launch Successful.
            </li>
            <li v-else>
              Rocket Launch Failed.
            </li>
          </ul>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import axios from 'axios';
  import moment from 'moment';
  export default {
    name: 'space',
    data () {
      return {
          rockets: [],
          show_failed_rockets: false
      }
    },
    created () {
      axios.get('https://api.spacexdata.com/v2/launches/all').then(response => {
          this.rockets = response.data;
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
  .container {
    display: grid;
    grid-columns: auto minmax(min-content, 1fr);
  }
  .filters {
    grid-column: 1;
    min-width: 250px;
  }
  .cards-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 40px;
    grid-column: 2;
  }
  .card {
    padding: 20px;
    min-height: 320px;
    box-shadow: rgba(0, 0, 0, 0.19) 0 0 8px 0;
    &__image {
      width: 100%;
      text-align: center;
      img {
        object-fit: contain;
        max-height: 250px;
        max-width: 100%;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>