import { getAccessToken, getCurrentAnonymousUser, getCurrentCommunityId, getIsReplyBool, getReplyInfo } from '../store/getters'
import { toggleIsReply } from '../store/setters'
import { post } from '../API/apicalls'
import { setMessages } from './messages'
import { uploadImageToCloudinary } from './cloud'

export const postMessageAndResetMessages = async (inputMessage: string, locale: string) => {
  const postBody: ajaxPostObject = {
    message: inputMessage,
    community_id: getCurrentCommunityId(),
  }
  console.log(postBody)
  // message not showing special characters properly (Pete's comment => Pete&#x27;s comment)
  try {
    await post.postMessageToBBS(postBody, getAccessToken())
  } catch (err) {
    alert(err)
  }
  await setMessages(getCurrentCommunityId(), locale)
}

export const postReplyAndResetMessages = async (inputMessage: string, locale: string) => {
  const replyBody: ajaxReplyObject = {
    message: inputMessage,
    message_id: getReplyInfo().value.messageIdToReplyTo,
    community_id: getCurrentCommunityId(),
  }
  // message not showing special characters properly (Pete's comment => Pete&#x27;s comment)
  try {
    await post.replyToBBSMessage(replyBody, getAccessToken())
  } catch (err) {
    alert(err)
  }
  toggleIsReply()
  await setMessages(getCurrentCommunityId(), locale)
}

export const postImageandResetMessages = async (imageFile: File, locale: string) => {
  const cloudinaryResponse = await uploadImageToCloudinary(imageFile)
  const isReply = getIsReplyBool()
  // check if reply or original post
  if (!isReply.value) {
    const imagePostObject: ajaxPostObject = {
      community_id: getCurrentCommunityId(),
      message: cloudinaryResponse.secure_url,
    }
    // call ktzn api
    try {
      await post.postImageToBBS(imagePostObject, getAccessToken())
    } catch (err) {
      alert(err)
    }
  } else {
    const imageReplyObject: ajaxReplyObject = {
      community_id: getCurrentCommunityId(),
      message: cloudinaryResponse.secure_url,
      message_id: getReplyInfo().value.messageIdToReplyTo,
    }
    // call ktzn api
    try {
      await post.replyWithImageToBBSMessage(imageReplyObject, getAccessToken())
    } catch (err) {
      alert(err)
    }
    toggleIsReply()
  }
  await setMessages(getCurrentCommunityId(), locale)
}
