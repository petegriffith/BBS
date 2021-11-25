<template>
  <div>
    <div class="main-container">
      <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"> </loading>
      <div class="header">
        <div class="community-user-info">{{ $t('community_users') }}: {{ communityUsersNumber }}</div>
        <div v-if="userNickname" class="user-container">
          <p class="username">{{ userNickname }}</p>
          <country-flag class="flag" :country="userCountry" :shadow="true" />
        </div>
        <div class="button-container">
          <div v-if="userNickname" class="logout button" role="button" @click="handleLogoutUser"><i class="material-icons md-18 icon-align">logout</i></div>
          <div class="refresh button" role="button" @click="handleRefreshBBS"><i class="material-icons md-18 icon-align">refresh</i></div>
          <div v-if="!languageSelectIsDisabled" class="language button" role="button" @click="showLangSelect = true"><i class="material-icons icon-align">language</i>{{ localeLabel }}</div>
        </div>
      </div>
      <div class="post-container" :key="containerKey">
        <!-- These interior divs are for the sole purpose of attaching a class and id to each SinglePost (for scrollToBottom) without making Vue mad -->
        <div v-for="(message, index) in messages" class="single_post" :id="`id ${index}`">
          <SinglePost :key="index" :message="message" @showSetUserModal="showSetUserModal = true" />
        </div>
      </div>
      <PostInput
        v-if="!postsDisabled"
        @postMessage="handlePostMessage($event)"
        @postReply="handlePostReply($event)"
        @openImageModal="showImageModal = true"
        @showSetUserModal="showSetUserModal = true"
      />
      <SetUserProfileModal v-if="showSetUserModal" @closeModal="showSetUserModal = false" @setProfile="handleSetProfile($event)" />
      <LangSelectModal v-if="showLangSelect" @closeModal="showLangSelect = false" @closeModalAndResetLocale="handleResetLanguage($event)" />
      <ImagePostModal v-if="showImageModal" @closeModal="showImageModal = false" @uploadPhotoAndCloseModal="handlePostImage($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SinglePost from '../components/SinglePost.vue'
  import PostInput from '../components/PostInput.vue'
  import LangSelectModal from '../components/modals/LangSelectModal.vue'
  import ImagePostModal from '../components/modals/ImagePostModal.vue'
  import SetUserProfileModal from '../components/modals/SetUserProfileModal.vue'

  import { setMessages, resetMessageLanguage, scrollToBottom } from '../global/utility/messages'
  import { postMessageAndResetMessages, postReplyAndResetMessages, postImageandResetMessages } from '../global/utility/post'
  import { getContainerKey, getCurrentCommunityProfile, getCurrentCommunityMessages, getCurrentAnonymousUser } from '../global/store/getters'
  import { fetchAndSetCommunityProfile, setCurrentAnonymousUser } from '../global/store/setters'

  import supportedLanguages from '../global/supported_languages.json'

  import { ref, onBeforeMount, onUpdated } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Loading from 'vue-loading-overlay'
  import CountryFlag from 'vue-country-flag-next'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import { addNewUserToCommunity, checkForLocalUser } from '../global/utility/user'
  import { checkURL } from '../global/utility/page'

  const { locale } = useI18n({ useScope: 'global' })

  const isLoading = ref(true)
  const showLangSelect = ref(false)
  const showImageModal = ref(false)
  const showSetUserModal = ref(false)

  const localeLabel = ref('English')

  const communityUsersNumber = ref(0)
  const communityIdNumber = ref(0)
  const messages = getCurrentCommunityMessages()
  const { communityId, langFromURL } = checkURL()

  const containerKey = getContainerKey()

  const postsDisabled = ref(false)

  const userNickname = ref('')
  const userCountry = ref('')

  const languageSelectIsDisabled = true

  onBeforeMount(async () => {
    // this function is a huge mess. I'll clean it up.
    console.log('setting stores...')
    if (checkForLocalUser()) {
      userNickname.value = getCurrentAnonymousUser().nickname
      userCountry.value = getCurrentAnonymousUser().country_cd
    }
    setLanguage(langFromURL)
    await fetchAndSetCommunityProfile(communityId, locale.value as string)
    const communityProfile = getCurrentCommunityProfile()
    communityUsersNumber.value = communityProfile.total_count
    communityIdNumber.value = communityProfile.community_id
    if (communityProfile.post_disabled_flg) postsDisabled.value = true
    if (communityProfile.bbs_type === 'bbs_one_way') postsDisabled.value = true
    await setMessages(communityIdNumber.value, locale.value as string)
    isLoading.value = false
  })

  onUpdated(() => {
    if (checkForLocalUser()) {
      userNickname.value = getCurrentAnonymousUser().nickname
      userCountry.value = getCurrentAnonymousUser().country_cd
    }
    scrollToBottom()
  })

  const handleRefreshBBS = async () => {
    await fetchAndSetCommunityProfile(communityIdNumber.value, locale.value as supportedLanguage)
    communityUsersNumber.value = getCurrentCommunityProfile().total_count
    await setMessages(communityIdNumber.value, locale.value as string)
    scrollToBottom()
  }

  const setLanguage = (langFromURL: string | undefined): void => {
    if (langFromURL) {
      // How to test that langFromURL was a valid lang?
      locale.value = langFromURL
    } else {
      if (navigator.language) {
        const localeString = navigator.language.substring(0, 2)
        locale.value = localeString
      } else {
        locale.value = 'en'
      }
    }
    // setting label for widget
    const label = supportedLanguages.filter((lang) => lang.lang === locale.value)[0].label
    localeLabel.value = label
  }

  const handleLogoutUser = () => {
    isLoading.value = true
    localStorage.removeItem('user')
    setCurrentAnonymousUser({ nickname: '', country_cd: '', lang_cd: '', access_token: '' })
    userNickname.value = ''
    userCountry.value = ''
    isLoading.value = false
  }

  const handleResetLanguage = async (lang: string) => {
    isLoading.value = true
    locale.value = lang
    const label = await resetMessageLanguage(lang as supportedLanguage)
    localeLabel.value = label
    isLoading.value = false
    showLangSelect.value = false
  }

  const handleSetProfile = async (data: emmited_profile_data) => {
    isLoading.value = true
    addNewUserToCommunity(data, locale.value as string)
    showSetUserModal.value = false
    isLoading.value = false
  }

  const handlePostMessage = async (message: string) => {
    isLoading.value = true
    await postMessageAndResetMessages(message, locale.value as string)
    isLoading.value = false
  }

  const handlePostReply = async (message: string) => {
    isLoading.value = true
    await postReplyAndResetMessages(message, locale.value as string)
    isLoading.value = false
  }

  const handlePostImage = async (imageFile: File) => {
    // Image Size limiter
    if (imageFile.size < 5000000) {
      isLoading.value = true
      await postImageandResetMessages(imageFile, locale.value as string)
      showImageModal.value = false
      isLoading.value = false
    } else {
      // Need better error handling
      alert('Please select a valid file')
    }
  }

  if (import.meta.env.PROD) {
    setInterval(handleRefreshBBS, 10000)
  }
</script>

<style scoped>
  .main-container {
    max-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    border-bottom: 1px solid lightgrey;
  }
  .community-user-info,
  .username {
    font-size: 0.7em;
    font-weight: bold;
    margin: 0;
    margin-block-end: 0;
    margin-block-start: 0;
  }

  .user-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .button {
    background-color: lightgrey;
    cursor: pointer;
    padding: 0.2em;
    text-align: center;
    font-size: 0.7em;
  }
  .refresh,
  .logout {
    border-radius: 100%;
    margin-right: 1em;
  }
  .language {
    border-radius: 2px;
    font-weight: bold;
  }
  .material-icons {
    vertical-align: middle;
    font-size: 1.5em;
  }

  .post-container {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .dev_button {
    color: orange;
    margin-top: 1em;
  }

  .flag {
    margin-bottom: .2em;
  }
</style>
