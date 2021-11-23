export const checkURL = () => {
  let communityId: number, langFromURL: string | undefined
  const siteURLString = window.location.pathname
  // this first if check and it's else block are for dev only and need to be deleted once the app is hosted
  if (siteURLString.length > 1) {
    const codedURL = new URL(siteURLString)
    const communityParam = codedURL.searchParams.get('bbsid')
    const langParam = codedURL.searchParams.get('to_lang_cd')
    if (communityParam) {
      communityId = +communityParam
    } else {
      // how do we handle this else block in PROD?
      communityId = 20
    }
    if (langParam) {
      langFromURL = langParam
    } else {
      langFromURL = undefined
    }
  } else {
    communityId = 20
    langFromURL = undefined
  }
  return { communityId, langFromURL }
}
