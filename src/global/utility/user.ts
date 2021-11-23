import { setCurrentAnonymousUser, setAccessToken } from '../store/setters'
import { getCurrentCommunityProfile, getCurrentAnonymousUser } from '../store/getters'
import { user } from '../API/apicalls'

export const addNewUserToCommunity = async (data: emmited_profile_data, locale: string) => {
  const newUser: anonymousUserProfile = {
    nickname: data.nickname,
    country_cd: data.selectedCountry.alpha_2,
    lang_cd: locale,
  }
  setCurrentAnonymousUser(newUser)
  const accessToken = await (await user.getAnonymousUserToken(newUser)).access_token
  await user.userJoinCommunity(getCurrentCommunityProfile().community_id, accessToken)
  setAccessToken(accessToken)
  localStorage.setItem('user', JSON.stringify(newUser))
}

export const checkIfUser = () => {
  const user = getCurrentAnonymousUser()
  if (user.nickname.length < 1) {
    return false
  }
  return true
}

export const checkForLocalUser = () => {
  const localCheck = localStorage.getItem('user')
  if (localCheck) {
    const localUser: anonymousUserProfile = JSON.parse(localCheck)
    console.log('localUser', localUser)
    if (localUser.nickname && localUser.country_cd && localUser.lang_cd) {
      setCurrentAnonymousUser(localUser)
    }
    return true
  }
  return false
}
