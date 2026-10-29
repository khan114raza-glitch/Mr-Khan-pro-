package com.mrkhan.video.data.model

import com.google.gson.annotations.SerializedName

data class VideoDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String,
    @SerializedName("videoUrl") val videoUrl: String,
    @SerializedName("thumbnailUrl") val thumbnailUrl: String,
    @SerializedName("durationSeconds") val durationSeconds: Int,
    @SerializedName("views") val views: Long,
    @SerializedName("likes") val likes: Long,
    @SerializedName("dislikes") val dislikes: Long = 0,
    @SerializedName("uploadedAt") val uploadedAt: String,
    @SerializedName("category") val category: String,
    @SerializedName("channel") val channel: ChannelDto,
    @SerializedName("isShort") val isShort: Boolean = false,
    @SerializedName("isLive") val isLive: Boolean = false,
    @SerializedName("qualityResolutions") val qualityResolutions: List<String> = listOf("4K", "1080p", "720p", "480p", "Auto"),
    @SerializedName("isLiked") val isLiked: Boolean = false,
    @SerializedName("isDownloaded") val isDownloaded: Boolean = false,
    @SerializedName("cachedFilePath") val cachedFilePath: String? = null
)

data class StreamingManifestDto(
    @SerializedName("videoId") val videoId: String,
    @SerializedName("hlsMasterPlaylistUrl") val hlsMasterPlaylistUrl: String,
    @SerializedName("dashManifestUrl") val dashManifestUrl: String?,
    @SerializedName("bitrates") val bitrates: List<BitrateVariant>,
    @SerializedName("ambientDominantColor") val ambientDominantColor: String = "#FF0055"
)

data class BitrateVariant(
    @SerializedName("resolution") val resolution: String,
    @SerializedName("bandwidth") val bandwidth: Long,
    @SerializedName("codecs") val codecs: String,
    @SerializedName("url") val url: String
)
