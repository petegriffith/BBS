import { community } from "../API/apicalls";
import axios from "axios";
import { triggerErrorView } from "./page";

export const fetchCommunityProfile = async (communityId: number, language: string) => {
    try {
        const communityProfile = await community.getProfileById(communityId, language)
        return communityProfile
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.data.message === "invalid community id") triggerErrorView(1)
        } else {
            return
        }
    }
}