<template>
  <div class="container">
    <div class="filters">
      <h3>Filters</h3>
      <div class="field-group">
        <input type="checkbox" v-model="show_failed_rockets">
        <label>Show rockets that failed launch.</label>
      </div>
    </div>
    <transition-group name="card" tag="div" class="cards-wrapper">>
      <div v-for="rocket in filterRockets.slice().reverse()" v-bind:key="rocket.flight_number" class="card">
        <div class="card__left">
          <div class="card__image">
            <img :src="rocket.links.mission_patch" />
          </div>
        </div>
        <div class="card__right">
          <ul>
          <li>Flight Number: {{ rocket.flight_number }}</li>
          <li>Launch Date: {{ launch_date(rocket.launch_date_utc) }}</li>
          <li v-if="rocket.launch_success">
          Rocket Launch Successful.
          </li>
          <li v-else-if="!rocket.details">
          Launch Pending
          </li>
          <li v-else >
          Rocket Launch Failed.
          </li>
          </ul>
          <p>{{ rocket.details }}</p>
          <a v-if="rocket.links.video_link" v-bind:href="rocket.links.video_link">Video Link</a>
          <router-link :to="{ name: 'rocket', params: { id: rocket.flight_number }}">
          Learn More
          </router-link>
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
      axios.get('https://api.spacexdata.com/v2/launches').then(response => {
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
    // display: grid;
    // grid-columns: auto minmax(min-content, 1fr);
    padding: 20px;
  }
  .filters {
    grid-column: 1;
    min-width: 250px;
  }
  .cards-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 40px;
    grid-column: 2;
  }
  .card {
    padding: 20px;
    min-height: 320px;
    box-shadow: rgba(0, 0, 0, 0.19) 0 0 8px 0;
    &__image {
      max-width: 250px;
      img {
        width: 100%;
        object-fit: contain;
      }
    }
    &-move {
      transition: all 600ms ease-in-out 50ms;
    }
    &-enter-active {
      transition: all 300ms ease-out;
    }

    &-leave-active {
      transition: all 200ms ease-out;
      opacity: 0;
      z-index: -10;
    }

    &-enter,
    &-leave-to {
      opacity: 0;
    }
    &-enter {
      transform: scale(0.4);
    }
  }
</style>
