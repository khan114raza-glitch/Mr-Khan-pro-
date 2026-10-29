package com.mrkhan.video.data.api

import com.mrkhan.video.data.model.ApiResponse
import com.mrkhan.video.data.model.ChannelDto
import com.mrkhan.video.data.model.CommentDto
import com.mrkhan.video.data.model.CreateCommentRequest
import com.mrkhan.video.data.model.StreamingManifestDto
import com.mrkhan.video.data.model.VideoDto
import com.mrkhan.video.data.model.WatchHistoryRequest
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Mr Khan Video Sharing Platform - REST API Service
 * Built with Retrofit 2, Kotlin Coroutines, and OkHttp3.
 *
 * Designed for Android Jetpack Compose + Media3 ExoPlayer architecture.
 * Package: com.mrkhan.video.data.api
 * Author: Khan Raza (khan114raza@gmail.com)
 */
interface MrKhanApiService {

    companion object {
        const val BASE_URL = "https://api.mrkhanvideo.com/v1/"
        const val CDN_STREAM_BASE = "https://stream.mrkhanvideo.com/hls/"
    }

    /**
     * Fetch paginated home feed videos with category filtering
     */
    @GET("videos/feed")
    suspend fun getHomeFeed(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null,
        @Header("Cache-Control") cacheControl: String? = "max-age=120"
    ): Response<ApiResponse<List<VideoDto>>>

    /**
     * Get detailed metadata for a specific video including adaptive stream formats
     */
    @GET("videos/{videoId}")
    suspend fun getVideoDetails(
        @Path("videoId") videoId: String
    ): Response<ApiResponse<VideoDto>>

    /**
     * Get trending / viral videos on Mr Khan platform
     */
    @GET("videos/trending")
    suspend fun getTrendingVideos(
        @Query("region") region: String = "GLOBAL",
        @Query("limit") limit: Int = 30
    ): Response<ApiResponse<List<VideoDto>>>

    /**
     * Get vertical short-form video reels (Khan Shorts)
     */
    @GET("shorts/feed")
    suspend fun getShortsFeed(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<List<VideoDto>>>

    /**
     * Search videos with query and filters (relevance, upload date, view count)
     */
    @GET("search")
    suspend fun searchVideos(
        @Query("q") query: String,
        @Query("filter") filter: String? = "relevance",
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<List<VideoDto>>>

    /**
     * Fetch channel profile metadata, subscriber stats, and banner
     */
    @GET("channels/{channelId}")
    suspend fun getChannelProfile(
        @Path("channelId") channelId: String
    ): Response<ApiResponse<ChannelDto>>

    /**
     * Get channel uploaded videos or playlists
     */
    @GET("channels/{channelId}/videos")
    suspend fun getChannelVideos(
        @Path("channelId") channelId: String,
        @Query("tab") tab: String = "videos", // "videos", "shorts", "playlists"
        @Query("page") page: Int = 1
    ): Response<ApiResponse<List<VideoDto>>>

    /**
     * Subscribe or unsubscribe to a channel
     */
    @POST("channels/{channelId}/subscribe")
    suspend fun toggleSubscription(
        @Path("channelId") channelId: String
    ): Response<ApiResponse<Map<String, Boolean>>>

    /**
     * Get top and latest comments for a video
     */
    @GET("videos/{videoId}/comments")
    suspend fun getVideoComments(
        @Path("videoId") videoId: String,
        @Query("sort") sort: String = "top", // "top" or "newest"
        @Query("page") page: Int = 1
    ): Response<ApiResponse<List<CommentDto>>>

    /**
     * Post a comment or reply to an existing comment
     */
    @POST("videos/{videoId}/comments")
    suspend fun postComment(
        @Path("videoId") videoId: String,
        @Body request: CreateCommentRequest
    ): Response<ApiResponse<CommentDto>>

    /**
     * Like or unlike a video
     */
    @POST("videos/{videoId}/like")
    suspend fun toggleVideoLike(
        @Path("videoId") videoId: String
    ): Response<ApiResponse<Map<String, Any>>>

    /**
     * Update watch progress for resume-playback and watch history
     */
    @POST("history/watch")
    suspend fun recordWatchProgress(
        @Body request: WatchHistoryRequest
    ): Response<ApiResponse<Boolean>>

    /**
     * Request adaptive bitrate HLS/DASH streaming manifest for Media3 ExoPlayer
     */
    @GET("streaming/manifest/{videoId}")
    suspend fun getStreamingManifest(
        @Path("videoId") videoId: String,
        @Query("format") format: String = "hls" // "hls" or "dash"
    ): Response<ApiResponse<StreamingManifestDto>>

    /**
     * Upload a new video with multipart form data (Title, Description, File, Thumbnail)
     */
    @Multipart
    @POST("studio/upload")
    suspend fun uploadVideo(
        @Part("title") title: RequestBody,
        @Part("description") description: RequestBody,
        @Part("category") category: RequestBody,
        @Part("tags") tags: RequestBody,
        @Part videoFile: MultipartBody.Part,
        @Part thumbnailFile: MultipartBody.Part? = null
    ): Response<ApiResponse<VideoDto>>

    /**
     * Delete video by creator
     */
    @DELETE("studio/videos/{videoId}")
    suspend fun deleteVideo(
        @Path("videoId") videoId: String
    ): Response<ApiResponse<Boolean>>
}
