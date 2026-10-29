package com.mrkhan.video.data.model

import com.google.gson.annotations.SerializedName

data class ChannelDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("handle") val handle: String,
    @SerializedName("avatarUrl") val avatarUrl: String,
    @SerializedName("bannerUrl") val bannerUrl: String? = null,
    @SerializedName("subscribersCount") val subscribersCount: Long,
    @SerializedName("isVerified") val isVerified: Boolean = false,
    @SerializedName("isSubscribed") val isSubscribed: Boolean = false,
    @SerializedName("bio") val bio: String? = null
)
