import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess({
    scss: {
      prependData: '@use "src/styles/variables.scss";'
   }
  }),
}

// import  sveltePreprocess from "svelte-preprocess";

// const config = {
//   preprocess: sveltePreprocess({
//     scss: {
//         prependData: '@use "src/styles/variables.scss";'
//      }
//   })
// }

// export default config;