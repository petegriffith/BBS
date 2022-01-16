# BBS
> A pooled BBS-style comment board built for mounting in iFrames


## Contents

------
- [Built With](#Built-With)
- [Getting Started](#Getting-Started)
    - [Installation](#installation)
    - [Dev](#development)
    - [Build](#build)
- [Notes](#Notes)
	- [Language selector](#Language-Selector)
	- [App sizing](#App-Sizing)
	- [Vite and .env variables](#Vite)
	- [Google Analytics](#Google-Analytics)
------

## Built With

BBS was written in [TypeScript](https://www.typescriptlang.org/) using [Vue 3](https://v3.vuejs.org/) on top of [Vite](https://vitejs.dev/).

BBS uses: 
- [Axios](https://axios-http.com/) for data fetching
- [Vue-i18n](https://vue-i18n.intlify.dev/) for internationalization
- [Vue-Select](https://vue-select.org/) to help with a customized country select menu
- [Vue-Country-Flag](https://github.com/P3trur0/vue-country-flag/blob/master/packages/vue-country-flag-next/README.md) for responsive country flag icons
- [Vue-Loading-Overlay](https://github.com/ankurk91/vue-loading-overlay) for the loading spinner 

NOTE: While Vite makes development lightning-fast, it does introduce the following [complication](#Vite) 
  
## Getting Started

### Installation
Install the required depenencies via
```
npm install
```

Create a .env file with the following values
```
VITE_API_URL=<KTZN API domain>

VITE_GA_MEASUREMENT_ID=<Google analytics measurement ID>
```

### Development
Start the development server (`http://localhost:3000/`) with
```
npm run dev
```

## Build
Build this project for staging and production with
```
npm run build
```

## Notes

### Language Selector
BBS comes with a language selector that is by default turned *off*.
To use the language selector, simply set

const languageSelectIsDisabled = false

in MainView.vue
  

### iFrame specific notes:

BBS should be mobile responsive, but it is not built for desktop mounting in small iFrames. For mounting on desktop, it is recommended that the app be sized no smaller than 400 x 400px

### About Vite and env variables:

- Vite has replaced `process.env` with `import.meta.env` and env variables must start with `VITE_`, so `API_URL` becomes `VITE_API_URL`. Env vars that don't begin with `VITE_` will always return undefined!

### Google Analytics

- GA measurement Id is read in env as `VITE_GA_MEASUREMENT_ID`
