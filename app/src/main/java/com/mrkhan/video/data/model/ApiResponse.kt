package com.mrkhan.video.data.model

import com.google.gson.annotations.SerializedName

/**
 * Standard API wrapper for Mr Khan Video Platform
 */
data class ApiResponse<T>(
    @SerializedName("status") val status: String,
    @SerializedName("code") val code: Int,
    @SerializedName("message") val message: String? = null,
    @SerializedName("data") val data: T? = null,
    @SerializedName("timestamp") val timestamp: Long = System.currentTimeMillis()
)

data class WatchHistoryRequest(
    @SerializedName("videoId") val videoId: String,
    @SerializedName("progressSeconds") val progressSeconds: Long,
    @SerializedName("totalDurationSeconds") val totalDurationSeconds: Long
)

data class CreateCommentRequest(
    @SerializedName("text") val text: String,
    @SerializedName("parentId") val parentId: String? = null
)
