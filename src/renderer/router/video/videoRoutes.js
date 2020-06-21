import VideoView from '@views/video'
import store from '@store'

export default [
  {
    name: 'video',
    path: '/video/:key/:releaseName',
    meta: {
      layout: {
        hide_scroll: true,
        hide_toolbar: true,
      }
    },
    props: true,
    component: VideoView,
    beforeEnter(to, from, next) {

      // Check if it is allowed to show ads
      // Check if not form ads
      const ads = store.state.app.settings.system.ads.enabled === true;
      const ads_maximum = store.state.app.settings.system.ads.maximum === true;

      const from_ads = from && from.name === 'ads';
      const is_shown_this_time = Math.random() >= 0.5 || ads_maximum;

      console.log({ads, ads_maximum, is_shown_this_time, from_ads});

      // Redirect to ads view or to episode video
      if (ads && is_shown_this_time && !from_ads) {

        // Need to show ads this time
        // Push to video
        next({name: 'ads', params: {to}})

      } else {

        // This time without ads
        // Go to video
        next()
      }
    },
  }
]
