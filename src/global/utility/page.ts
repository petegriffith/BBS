import { setErrorCode, toggleIsError } from '../store/setters'

export const checkURL = () => {
  let communityId: number, langFromURL: string | undefined
  // I think this should work for getting the URL from the iframe. We need to check for sure.
  const siteURLString = document.location.href
  // this first if check and it's else block are for dev only and need to be deleted once the app is hosted
  if (siteURLString.length > 1) {
    const codedURL = new URL(siteURLString)
    const communityParam = codedURL.searchParams.get('bbsid')
    const langParam = codedURL.searchParams.get('to_lang_cd')
    if (communityParam) {
      communityId = +communityParam
      console.log('community ID set with param')
    } else if (import.meta.env.DEV) {
      console.log('dev mode: community ID statically set')
      communityId = 21
    } else {
      triggerErrorView(2)
      communityId = 0
    }
    if (langParam) {
      langFromURL = langParam
      console.log('language ID set with param')
    } else {
      langFromURL = undefined
    }
  } else {
    communityId = 20
    langFromURL = undefined
  }
  return { communityId, langFromURL }
}

export const addGtagScript = () => {
  // these functions are done with DOM manipulation (rather than hard coding) in order to use .env variables for the GA_MEASUREMENT_ID
  // if this is unnecessary, it can be done more easily in index.html statically
  const gtagScriptA = document.createElement('script')
  gtagScriptA.async = true
  gtagScriptA.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`

  const gtagScriptB = document.createElement('script')
  const code = `window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${import.meta.env.VITE_GA_MEASUREMENT_ID}')`
  gtagScriptB.innerHTML = code

  document.head.appendChild(gtagScriptA)
  document.head.appendChild(gtagScriptB)
}

export const setPageTitle = (lang: string): void => {
  let pageTitle = ''
  if (lang === 'en') pageTitle = 'Agency for Cultural Affairs'
  if (lang === 'ja') pageTitle = '文化庁'
  document.title = pageTitle
}

export const triggerErrorView = (errorCode: number): void => {
  setErrorCode(errorCode)
  toggleIsError()
}
