package com.mrkhan.video.data.model

import com.google.gson.annotations.SerializedName

data class CommentDto(
    @SerializedName("id") val id: String,
    @SerializedName("authorName") val authorName: String,
    @SerializedName("authorAvatarUrl") val authorAvatarUrl: String,
    @SerializedName("content") val content: String,
    @SerializedName("likes") val likes: Int,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("isLiked") val isLiked: Boolean = false,
    @SerializedName("replyCount") val replyCount: Int = 0,
    @SerializedName("videoTimestampSeek") val videoTimestampSeek: Int? = null
)
