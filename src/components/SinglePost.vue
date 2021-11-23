<template>
  <div class="singlepost-container" :class="{ official: isOfficial }">
    <div class="userdata-container">
      <h5 class="username">{{ username }}</h5>
      <!-- <img v-if="countryObj" :src="countryObj.flag_url" class="flag-icon" :alt="`Flag of ${countryObj.country_name}`" /> -->
      <country-flag v-if="countryObj" :country="countryObj.alpha_2" class="flag-icon" :shadow="true" />
      <p class="post-time">{{ postTime }}</p>
      <p class="translation-direction">{{ lang1 }}->{{ lang2 }}</p>
    </div>
    <div v-if="isReply" class="replyee-info-container">
      <span class="replyee-info">
        <i class="material-icons reply-icon">reply</i> <span>Replying to {{ replyObj?.name }}: {{ replyObj?.contents }}</span>
      </span>
    </div>
    <div class="message-container">
      <img v-if="isImage" :src="imgUrl" class="posted_image" @click="showEnlargedImage = true" />
      <i v-if="isImage" @click="handleImageDownload" class="material-icons download-icon">download</i>
      <p v-else>{{ messageText }}</p>
    </div>
    <div class="button-container" v-if="!isImage">
      <span class="post-button" @click="handleReplyClick"><i class="material-icons button">reply</i></span>
      <span class="post-button" @click="handleOriginalLanguageClick"><i class="material-icons button">language</i></span>
    </div>
  </div>
   <EnlargedImage :imgUrl="imgUrl" v-if="showEnlargedImage === true" @closeModal="showEnlargedImage = false"/>
</template>

<script setup lang="ts">
  import { ref, Ref, defineEmits } from 'vue'
  import SupportedCountries from '../global/supportedCountries.json'
  import { useI18n } from 'vue-i18n'
  import { setReplyInfo, toggleIsReply } from '../global/store/setters'
  import { getIsReplyBool } from '../global/store/getters'
  import { checkIfUser } from '../global/utility/user'
  import { formatDateTime } from '../global/utility/messages'
  import { downloadImage } from '../global/utility/image'
  import CountryFlag from 'vue-country-flag-next'
  import EnlargedImage from './modals/EnlargedImage.vue'

  const props = defineProps<{
    message: communityMessage
  }>()
  const emit = defineEmits(['showSetUserModal'])
  const { locale } = useI18n({ useScope: 'global' })

  const username = props.message.name
  const postTime = formatDateTime(props.message.created_at)
  const flagCode = props.message.country_cd.toUpperCase()
  const lang1 = props.message.original_lang_cd
  const lang2 = props.message.change_lang_cd
  const message_id = props.message.message_id
  const isOfficial = props.message.is_official
  const messageText = ref('')
  const countryObj = SupportedCountries.filter((country) => country.alpha_2 === flagCode)[0]

  const showEnlargedImage = ref(false)

  // HANDLES IF THE POST IS AN IMAGE
  const imageObj = props.message.content
  const isImage = ref(false)
  const imgUrl = ref('')

  if (imageObj) {
    isImage.value = true
    // not sure if we need error handling here, but here's something:
    imgUrl.value = imageObj.url || '...'
  }

  // HANDLES IF THE POST IS A REPLY
  const replyObj = props.message.reply
  const isReply = ref(false)
  const replyee = ref('')
  const replyeeMessage = ref('')

  if (replyObj) {
    isReply.value = true
    replyee.value = replyObj.name
    replyeeMessage.value = replyObj.contents
  }

  // HANDLES MESSAGE TRANSLATION
  const origLangMessage: Ref<string | undefined> = ref(undefined)
  const changeLangMessage: Ref<string | undefined> = ref(undefined)

  if (props.message.original_contents) {
    origLangMessage.value = props.message.original_contents
    changeLangMessage.value = props.message.change_contents
    if (locale.value === lang1) {
      messageText.value = origLangMessage.value
    } else if (locale.value === lang2) {
      messageText.value = changeLangMessage.value
    } else {
      /* NEED TO FIGURE OUT WHAT TO DO IN THIS CASE: */
      messageText.value = `No translation available, showing original message: ${origLangMessage}`
    }
  }

  const handleReplyClick = () => {
    if (checkIfUser()) {
      const newReplyInfo: replyInfo = {
        usernameToReplyTo: username,
        messageToReplyTo: messageText.value,
        messageIdToReplyTo: message_id,
      }
      setReplyInfo(newReplyInfo)
      if (getIsReplyBool().value === false) {
        toggleIsReply()
      }
    } else {
      emit('showSetUserModal')
    }
  }

  const handleOriginalLanguageClick = () => {
    if (origLangMessage.value && changeLangMessage.value) {
      // Error handling here?
      if (messageText.value !== origLangMessage.value) {
        messageText.value = origLangMessage.value
      } else {
        messageText.value = changeLangMessage.value
      }
    }
  }

  const handleImageDownload = () => {
    downloadImage(imgUrl.value)
  }
</script>

<style scoped>
  .singlepost-container {
    text-align: left;
    padding: 1em;
    border-top: 1px solid lightGrey;
  }

  .official {
    background-color: lightgrey;
  }

  .flag-icon {
    padding: 0;
  }

  .userdata-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 0.2em;
    gap: 0.2em;
  }
  .username {
    font-weight: bold;
    margin: 0;
  }

  .post-time,
  .translation-direction {
    font-size: 0.7em;
    font-weight: lighter;
    margin: 0px 0px 0px 2px;
  }
  .message-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .post-button {
    color: grey;
    cursor: pointer;
  }

  .button {
    font-size: 1em;
    background-color: lightgrey;
    padding: 0.2em;
    border-radius: 1em;
    margin-right: 0.2em;
  }

  .replyee-info {
    margin: 0;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0.8em;
    width: 100%;
    color: white;
    padding: 0.1em 0.6em;
    font-size: 0.8em;
  }

  .reply-icon {
    font-size: 1em;
  }

  .posted_image {
    max-width: 80vw;
  }
</style>
