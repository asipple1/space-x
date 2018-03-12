<template>
  <div class="container is-fluid">
    <section class="hero">
      <div class="hero-body">
        <div class="container is-fluid">
        <h1 class="title">SpaceX API Data</h1>
        <div class="buttons">
          <button class="button button-filter" @click="filterRockets($event, 'launch_success=true')">Successful Launches {{successful_rockets}}</button>
          <button class="button button-filter" @click="filterRockets($event, 'launch_success=false')">Failed Launches {{ failed_rockets}}</button>
          <button class="button button-filter" @click="filterRockets($event, 'land_success=true')">Landing Successful {{ land_success }}</button>
          <button class="button button-filter" @click="filterRockets($event, 'land_success=false')">Landing Failed {{ land_failed }}</button>
          <button class="button button-filter" @click="filterRockets($event, 'reused=true')">Cores Reused {{ cores_reused }}</button>
          <button class="button" @click="filterRockets($event, 'clear')">Clear</button>
        </div>
        </div>
      </div>
    </section>
    <transition-group name="card" tag="div" class="columns is-multiline is-variable is-3">
      <div v-for="rocket in rockets.slice().reverse()" v-bind:key="rocket.flight_number" class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd">
        <div class="card">
          <div class="card-image">
            <figure class="image is-128x128">
              <img :src="rocket.links.mission_patch" />
            </figure>
          </div>
          <div class="card-content">
            <time>Launch Date: {{ launch_date(rocket.launch_date_utc) }}</time>
            <p>Flight Number: {{ rocket.flight_number }}</p>
            <p v-if="rocket.launch_success">Rocket Launch Successful.</p>
            <p v-else> Rocket Launch Failed.</p>
            <div v-for="(core, index) in rocket.rocket.first_stage.cores">
              <p v-if="core.land_success">Core {{ index + 1 }} landing successful.</p>
              <p v-else>Core {{index + 1 }} landing failed.</p>
            </div>
          </div>
          <footer class="card-footer">
              <a v-bind:href="rocket.links.video_link" class="card-footer-item button is-primary">Watch Launch</a>
              <router-link :to="{ name: 'rocket', params: { id: rocket.flight_number }}" class="card-footer-item button is-primary">
              Learn More
              </router-link>
          </footer>
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
          successful_rockets: 0,
          failed_rockets: 0,
          cores_reused: 0,
          land_success: 0,
          land_failed: 0,
          filter_data: [],
      }
    },
    created () {
      axios.get('https://api.spacexdata.com/v2/launches').then(response => {
          this.rockets = response.data;
          for (let rocket of response.data) {
            if(rocket.launch_success) {
              this.successful_rockets++;
            }
            else {
              this.failed_rockets++;
            }
            if(rocket.reuse.core) {
              this.cores_reused++;
            }
            if(rocket.rocket.first_stage.cores) {
              for (let core of rocket.rocket.first_stage.cores) {
                if(core.land_success) {
                  this.land_success++;
                }
                else {
                  this.land_failed++;
                }
              }
            }
          }
      });
    },
    methods: {
      launch_date: function (date) {
        return moment(date).format('MMM Do YYYY');
      },
      filterRockets: function($event, options) {
        $event.target.classList.toggle('is-active');
        let button_filters = document.getElementsByClassName('button-filter');
        if($event.target.classList.contains('is-active')) {
          if(!this.filter_data.includes(options)) {
              this.filter_data.push(options);
          }
        }
        else {
          this.filter_data = removeArrayItem(this.filter_data, options);
        }
        if(options === 'clear') {
          this.filter_data = [];
          for (let button of button_filters) {
            if(button.classList.contains('is-active')) {
              button.classList.remove('is-active');
            }
          }
        }
        let query = Object.keys(this.filter_data).map(k => this.filter_data[k]).join('&');
        axios.get(`https://api.spacexdata.com/v2/launches?${query}`).then(response => {
            this.rockets = response.data;
            this.successful_rockets = 0;
            this.failed_rockets = 0;
            this.cores_reused = 0;
            this.land_success = 0;
            this.land_failed = 0;
            for (let rocket of response.data) {
              if(rocket.launch_success) {
                this.successful_rockets++;
              }
              else {
                this.failed_rockets++;
              }
              if(rocket.reuse.core) {
                this.cores_reused++;
              }
              if(rocket.rocket.first_stage.cores) {
                for (let core of rocket.rocket.first_stage.cores) {
                  if(core.land_success) {
                    this.land_success++;
                  }
                  else {
                    this.land_failed++;
                  }
                }
              }
            }
        });
      }
    },
    computed: {
    }
  }
  const removeArrayItem = (arr, itemToRemove) => {
    return arr.filter(item => item !== itemToRemove)
  }
</script>

<style lang='scss' scoped>
  .card {
    display: flex;
    flex-direction: column;
    height: 100%;
    &-image {
      padding: 40px 0;
      .image {
        margin: auto;
      }
      img {
        max-height: 100%;
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
  .card-footer {
    margin-top: auto;
    &-item {
      border-radius: 0;
      &:not(:last-child) {
        border: none;
        margin-right: 5px;
      }
    }
  }
</style>
