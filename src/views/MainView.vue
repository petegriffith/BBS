<template>
  <div>
    <div class="main-container">
      <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"> </loading>
      <div class="header">
        <div class="community-user-info">{{ t('communityUserCount', communityUsersNumber) }}</div>
        <div v-if="userNickname" class="user-container">
          <p class="username">{{ userNickname }}</p>
          <country-flag class="flag" :country="userCountry" :shadow="true" />
        </div>
        <div class="button-container">
          <div v-if="userNickname" class="logout button" role="button" aria-label="logout user" tabindex="0" @click="handleLogoutUser"><i class="material-icons md-18 icon-align">logout</i></div>
          <div class="refresh button" role="button" aria-label="refresh BBS" tabindex="0" @click="handleRefreshBBS"><i class="material-icons md-18 icon-align">refresh</i></div>
          <div v-if="!languageSelectIsDisabled" class="language button" role="button" aria-label="select language" tabindex="0" @click="showLangSelect = true">
            <i class="material-icons icon-align">language</i>{{ localeLabel }}
          </div>
        </div>
      </div>
      <div class="post-container" :key="containerKey" ref="scrollDiv">
        <!-- These interior divs are for the sole purpose of attaching a class and id to each SinglePost (for scrollToBottom) without making Vue mad -->
        <div v-for="(message, index) in messages" class="single_post" :id="`id ${index}`">
          <SinglePost :key="message.order" :message="message" @showSetUserModal="showSetUserModal = true" @showEnlargedImage="handleShowEnlargedImage" />
        </div>
      </div>
      <div v-if="newMessageCount > 0" class="flex-container-row new_message_container">
        <div class="new_message_indicator" role="button" aria-label="see new messages" tabindex="0" @click="handleNewMessagesClick">{{ t('newMessages', newMessageCount) }}</div>
      </div>
      <PostInput
        v-if="!postsDisabled"
        @postMessage="handlePostMessage($event)"
        @postReply="handlePostReply($event)"
        @openImageModal="showImageModal = true"
        @showSetUserModal="showSetUserModal = true"
      />
    </div>
  </div>
  <SetUserProfileModal v-if="showSetUserModal" @closeModal="showSetUserModal = false" @setProfile="handleSetProfile($event)" />
  <LangSelectModal v-if="showLangSelect" @closeModal="showLangSelect = false" @closeModalAndResetLocale="handleResetLanguage($event)" />
  <ImagePostModal v-if="showImageModal" @closeModal="showImageModal = false" @uploadPhotoAndCloseModal="handlePostImage($event)" />
  <EnlargedImage v-if="showEnlargedImage === true" :imgUrl="imgUrl" @closeModal="showEnlargedImage = false" />
</template>

<script setup lang="ts">
  import SinglePost from '../components/SinglePost.vue'
  import PostInput from '../components/PostInput.vue'
  import LangSelectModal from '../components/modals/LangSelectModal.vue'
  import ImagePostModal from '../components/modals/ImagePostModal.vue'
  import SetUserProfileModal from '../components/modals/SetUserProfileModal.vue'
  import EnlargedImage from '../components/modals/EnlargedImage.vue'

  import { setMessages, resetMessageLanguage, scrollToBottom } from '../global/utility/messages'
  import { postMessageAndResetMessages, postReplyAndResetMessages, postImageandResetMessages } from '../global/utility/post'
  import { getContainerKey, getCurrentCommunityProfile, getCurrentCommunityMessages, getCurrentAnonymousUser, getNewMessageCount } from '../global/store/getters'
  import { setCommunityProfile, incrementContainerKey, resetNewMessages, setCurrentLocale } from '../global/store/setters'

  import supportedLanguages from '../assets/supported_languages.json'

  import { ref, onBeforeMount, onUpdated, reactive, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useScroll } from '@vueuse/core'
  import Loading from 'vue-loading-overlay'
  import CountryFlag from 'vue-country-flag-next'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import { addNewUserToCommunity, checkForLocalUser, logoutUserFromApp } from '../global/utility/user'
  import { addGtagScript, checkURL, setPageTitle } from '../global/utility/page'

  const { locale, t } = useI18n({ useScope: 'global' })

  const isLoading = ref(true)
  const showLangSelect = ref(false)
  const showImageModal = ref(false)
  const showSetUserModal = ref(false)
  const showEnlargedImage = ref(false)

  const localeLabel = ref('English')

  const communityUsersNumber = ref(0)
  const communityIdNumber = ref(0)
  const messages = getCurrentCommunityMessages()
  const { communityId, langFromURL } = checkURL()
  const newMessageCount = getNewMessageCount()

  const containerKey = getContainerKey()

  const postsDisabled = ref(false)

  const userNickname = ref('')
  const userCountry = ref('')

  const languageSelectIsDisabled = true

  const imgUrl = ref('')

  const scrollDiv = ref<HTMLElement | null>(null)
  const scroll = reactive(useScroll(scrollDiv, { offset: { bottom: 100 } }))

  onBeforeMount(async () => {
    addGtagScript()
    await setCommunityProfile(communityId, locale.value as string)
    setLanguage(langFromURL)
    setPageTitle(locale.value as string)
    const { total_count, community_id, post_disabled_flg, bbs_type } = getCurrentCommunityProfile()
    communityUsersNumber.value = total_count
    communityIdNumber.value = community_id
    if (post_disabled_flg) postsDisabled.value = true
    if (bbs_type === 'bbs_one_way') postsDisabled.value = true
    await setMessages(communityIdNumber.value, locale.value as string)
    if (checkForLocalUser()) {
      userNickname.value = getCurrentAnonymousUser().nickname
      userCountry.value = getCurrentAnonymousUser().country_cd
      scrollToBottom()
    }
    isLoading.value = false
  })

  onUpdated(() => {
    userNickname.value = getCurrentAnonymousUser().nickname
    userCountry.value = getCurrentAnonymousUser().country_cd
  })

  watchEffect(() => {
    scroll.arrivedState.bottom === true && resetNewMessages()
  })

  const handleRefreshBBS = async () => {
    isLoading.value = true
    await setCommunityProfile(communityIdNumber.value, locale.value as supportedLanguage)
    communityUsersNumber.value = getCurrentCommunityProfile().total_count
    await setMessages(communityIdNumber.value, locale.value as string)
    scrollToBottom()
    isLoading.value = false
  }

  const handleLogoutUser = () => {
    isLoading.value = true
    logoutUserFromApp()
    scrollToBottom()
    isLoading.value = false
  }

  const handleResetLanguage = async (lang: string) => {
    isLoading.value = true
    locale.value = lang
    const label = await resetMessageLanguage(lang as supportedLanguage)
    localeLabel.value = label
    incrementContainerKey()
    isLoading.value = false
    showLangSelect.value = false
  }

  const handleSetProfile = async (data: emmited_profile_data) => {
    isLoading.value = true
    await addNewUserToCommunity(data, locale.value as string)
    scrollToBottom()
    showSetUserModal.value = false
    isLoading.value = false
  }

  const handlePostMessage = async (message: string) => {
    isLoading.value = true
    await postMessageAndResetMessages(message, locale.value as string)
    scrollToBottom()
    isLoading.value = false
  }

  const handlePostReply = async (message: string) => {
    isLoading.value = true
    await postReplyAndResetMessages(message, locale.value as string)
    scrollToBottom()
    isLoading.value = false
  }

  const handlePostImage = async (imageFile: File) => {
    if (imageFile.size < 5000000) {
      isLoading.value = true
      await postImageandResetMessages(imageFile, locale.value as string)
      showImageModal.value = false
      scrollToBottom()
      isLoading.value = false
    } else {
      // Need better error handling
      alert('Please select a valid file')
    }
  }

  const handleShowEnlargedImage = (url: string) => {
    imgUrl.value = ''
    imgUrl.value = url
    showEnlargedImage.value = true
  }

  const handleNewMessagesClick = () => {
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
    setCurrentLocale(locale.value as string)
  }

  if (import.meta.env.PROD) {
    setInterval(() => {
      setMessages(communityIdNumber.value, locale.value as string)
      communityUsersNumber.value = getCurrentCommunityProfile().total_count
    }, 10000)
  }
</script>

<style scoped>
  .main-container {
    max-height: calc(100vh - 2px);
    display: flex;
    flex-direction: column;
  }

  .flex-container-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    min-height: 5vh;
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
    margin-bottom: 0.2em;
  }

  .new_message_indicator {
    background-color: lightgrey;
    border-radius: 20px;
    padding: 0.4em;
    margin: 2px;
    cursor: pointer;
    position: absolute;
    margin-bottom: calc(2em + 5px);
  }
</style>
