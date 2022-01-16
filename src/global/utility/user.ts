import { setCurrentAnonymousUser, incrementContainerKey } from '../store/setters'
import { getCurrentCommunityProfile, getCurrentAnonymousUser, getRefreshToken } from '../store/getters'
import { user } from '../API/apicalls'

export const addNewUserToCommunity = async (data: emmited_profile_data, locale: string) => {
  const datetime = new Date().toString()
  const newUser: localAnonymousUserProfile = {
    nickname: data.nickname,
    country_cd: data.selectedCountry.alpha_2,
    lang_cd: locale,
    access_token: '',
    refresh_token: '',
    community_id: 0,
    last_refreshed: datetime,
  }
  const { access_token, refresh_token } = await user.getAnonymousUserToken(newUser)
  newUser.access_token = access_token
  newUser.refresh_token = refresh_token
  try {
    const community_id = getCurrentCommunityProfile().community_id
    await user.userJoinCommunity(community_id, access_token)
    setCurrentAnonymousUser(newUser)
    newUser.community_id = community_id
    localStorage.setItem(`user.${getCurrentCommunityProfile().community_id}`, JSON.stringify(newUser))
  } catch (err) {
    alert(err)
    return
  }
  incrementContainerKey()
}

export const refreshUserToken = async () => {
  const currentUser = getCurrentAnonymousUser()
  const refreshBody: apiRefreshRequestObject = {
    refresh_token: currentUser.refresh_token,
  }
  try {
    // console.log('old access token:', currentUser.access_token)
    // console.log('old refresh token:', currentUser.refresh_token)

    const { access_token, refresh_token } = await user.refreshAccessToken(refreshBody)
    // console.log('new access token:', access_token)
    // console.log('new refresh token:', refresh_token)
    if (access_token.length > 1 && refresh_token.length > 1) {
      currentUser.access_token = access_token
      currentUser.refresh_token = refresh_token
      currentUser.last_refreshed = new Date().toString()
      setCurrentAnonymousUser(currentUser)
      localStorage.setItem(`user.${getCurrentCommunityProfile().community_id}`, JSON.stringify(currentUser))
      console.log('successfully refreshed access token')
      return true
    } else {
      alert('Recieved invalid access or refresh token. Logging out user.')
      logoutUserFromApp()
      return false
    }
  } catch (err) {
    console.log(err)
    alert('User expired, please create a new user.')
    logoutUserFromApp()
    return false
  }
}

export const checkIfUser = () => {
  const user = getCurrentAnonymousUser()
  if (user.nickname.length < 1) {
    return false
  }
  return true
}

export const checkForLocalUser = () => {
  checkIfUserNeedsRefreshing()
  const localCheck = localStorage.getItem(`user.${getCurrentCommunityProfile().community_id}`)
  if (localCheck) {
    const localUser: localAnonymousUserProfile = JSON.parse(localCheck)
    // check if a local user's codes
    if (localUser.nickname && localUser.country_cd && localUser.lang_cd && localUser.access_token && localUser.refresh_token) {
      setCurrentAnonymousUser(localUser)
    }
    return true
  }
  return false
}

export const logoutUserFromApp = () => {
  localStorage.removeItem(`user.${getCurrentCommunityProfile().community_id}`)
  setCurrentAnonymousUser({ nickname: '', country_cd: '', lang_cd: '', access_token: '', refresh_token: '', community_id: 0, last_refreshed: null })
}

export const checkIfUserNeedsRefreshing = (): void => {
  const check = getCurrentAnonymousUser().last_refreshed
  if (check) {
    const currentUserLastRefreshedDate = new Date(check).getTime()
    const now = new Date().getTime()
    const differenceInDays: number = (now - currentUserLastRefreshedDate) / (1000 * 3600 * 24)
    if (differenceInDays > 1) {
      console.log('refreshing user...')
      refreshUserToken()
    } 
  } else {
    console.log("No user found")
  }
}
