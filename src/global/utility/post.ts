import { getAccessToken, getRefreshToken, getCurrentCommunityId, getIsReplyBool, getReplyInfo, getCurrentLocale } from '../store/getters'
import { toggleIsReply } from '../store/setters'
import { post } from '../API/apicalls'
import { setMessages } from './messages'
import { handleCloudinaryImageUpload } from './cloud'
import axios from 'axios'
import { refreshUserToken } from './user'

export const postMessageAndResetMessages = async (inputMessage: string, locale: string) => {
  const postBody: apiPostRequestObject = {
    message: inputMessage,
    community_id: getCurrentCommunityId(),
    original_lang_cd: getCurrentLocale(),
  }
  try {
    // console.log(postBody)
    await post.postMessageToBBS(postBody, getAccessToken())
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data === 'not authorized') {
      if (await refreshUserToken()) {
        await post.postMessageToBBS(postBody, getAccessToken())
      } else {
        return false
      }
    } else {
      console.log('unknown error:', err)
      return false
    }
  }
  await setMessages(getCurrentCommunityId(), locale)
}

export const postReplyAndResetMessages = async (inputMessage: string, locale: string) => {
  const replyBody: apiReplyRequestObject = {
    message: inputMessage,
    message_id: getReplyInfo().value.messageIdToReplyTo,
    community_id: getCurrentCommunityId(),
    original_lang_cd: getCurrentLocale(),
  }
  // message not showing special characters properly (Pete's comment => Pete&#x27;s comment)
  try {
    await post.replyToBBSMessage(replyBody, getAccessToken())
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data === 'not authorized') {
      if (await refreshUserToken()) {
        await post.replyToBBSMessage(replyBody, getAccessToken())
      } else {
        return false
      }
    } else {
      console.log('unknown error:', err)
      return false
    }
  }
  toggleIsReply()
  await setMessages(getCurrentCommunityId(), locale)
}

export const postImageandResetMessages = async (imageFile: File, locale: string) => {
  /* Token refresh has been omitted because accessToken errors are handled upstream in the initial handleCloudinaryImageUpload function */
  try {
    const cloudinaryResponse = await handleCloudinaryImageUpload(imageFile)
    if (cloudinaryResponse) {
      /* if truthy cloudinary response */ // check if reply or original post
      const isReply = getIsReplyBool()
      if (!isReply.value) {
        /* if not a reply post */ const imagePostObject: apiPostRequestObject = {
          community_id: getCurrentCommunityId(),
          message: cloudinaryResponse.secure_url,
          original_lang_cd: getCurrentLocale(),
        }
        try {
          await post.postImageToBBS(imagePostObject, getAccessToken())
        } catch (err) /* unknown error */ {
          console.log(err)
        }
      } /* if reply post */ else {
        // if a reply post
        const imageReplyObject: apiReplyRequestObject = {
          community_id: getCurrentCommunityId(),
          message: cloudinaryResponse.secure_url,
          message_id: getReplyInfo().value.messageIdToReplyTo,
          original_lang_cd: getCurrentLocale(),
        }
        try {
          await post.replyWithImageToBBSMessage(imageReplyObject, getAccessToken())
        } catch (err) /* unknown error */ {
          console.log(err)
        }
        toggleIsReply()
      }
      await setMessages(getCurrentCommunityId(), locale)
    } /* if falsy cloudinary response */ else {
      alert('Unknown error uploading image to cloudinary')
    }
  } catch (err) {
    console.log(err)
  }
}
