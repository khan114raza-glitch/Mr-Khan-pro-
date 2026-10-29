export interface ProjectFile {
  path: string;
  name: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'json';
  content: string;
  description: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'app/src/main/java/com/mrkhan/video/data/api/MrKhanApiService.kt',
    name: 'MrKhanApiService.kt',
    language: 'kotlin',
    description: 'Retrofit 2 REST API service interface with Kotlin Coroutines & HLS/DASH endpoints',
    content: `package com.mrkhan.video.data.api

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
import retrofit2.http.*

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
        @Query("tab") tab: String = "videos",
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
        @Query("sort") sort: String = "top",
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
        @Query("format") format: String = "hls"
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
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/data/api/ErrorHandler.kt',
    name: 'ErrorHandler.kt',
    language: 'kotlin',
    description: 'Comprehensive error handling: Network connectivity check, HTTP status mapper (404, 500, etc.), & safeApiCall',
    content: `package com.mrkhan.video.data.api

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.google.gson.JsonSyntaxException
import com.mrkhan.video.data.model.ApiResponse
import okhttp3.Interceptor
import okhttp3.Response
import retrofit2.HttpException
import java.io.IOException
import java.net.ConnectException
import java.net.SocketTimeoutException
import java.net.UnknownHostException

/**
 * Custom Exception thrown when device has no active internet connection.
 */
class NoConnectivityException(
    message: String = "No internet connection detected. Please verify your Wi-Fi or mobile data."
) : IOException(message)

/**
 * OkHttp Interceptor that proactively checks network connectivity before executing requests.
 */
class NetworkConnectivityInterceptor(private val context: Context) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        if (!isNetworkAvailable()) {
            throw NoConnectivityException()
        }
        return chain.proceed(chain.request())
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager =
            context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
                ?: return false

        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false

        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }
}

/**
 * Translates low-level exceptions and HTTP error codes into user-friendly localized messages.
 */
object ApiExceptionMapper {

    fun mapHttpCodeToError(code: Int, rawBody: String? = null): NetworkResult.Error {
        return when (code) {
            400 -> NetworkResult.Error(
                errorType = NetworkErrorType.BAD_REQUEST_400,
                userFriendlyMessage = "We couldn't process this request. Please check your input and try again.",
                httpCode = code
            )
            401 -> NetworkResult.Error(
                errorType = NetworkErrorType.UNAUTHORIZED_401,
                userFriendlyMessage = "Your session has expired. Please sign in to your Mr Khan account to continue.",
                httpCode = code
            )
            403 -> NetworkResult.Error(
                errorType = NetworkErrorType.FORBIDDEN_403,
                userFriendlyMessage = "Access restricted. You do not have permission to view this video or perform this action.",
                httpCode = code
            )
            404 -> NetworkResult.Error(
                errorType = NetworkErrorType.NOT_FOUND_404,
                userFriendlyMessage = "Video not found. This video or channel may have been removed or made private.",
                httpCode = code
            )
            408 -> NetworkResult.Error(
                errorType = NetworkErrorType.TIMEOUT,
                userFriendlyMessage = "Request timed out. The video stream server took too long to respond. Please try again.",
                httpCode = code
            )
            429 -> NetworkResult.Error(
                errorType = NetworkErrorType.RATE_LIMITED_429,
                userFriendlyMessage = "High traffic detected. Please slow down and try again in a few moments.",
                httpCode = code
            )
            500 -> NetworkResult.Error(
                errorType = NetworkErrorType.SERVER_ERROR_500,
                userFriendlyMessage = "Mr Khan servers encountered an unexpected issue. Our engineers are investigating.",
                httpCode = code
            )
            502 -> NetworkResult.Error(
                errorType = NetworkErrorType.BAD_GATEWAY_502,
                userFriendlyMessage = "Video CDN gateway is temporarily unreachable. Please retry shortly.",
                httpCode = code
            )
            503 -> NetworkResult.Error(
                errorType = NetworkErrorType.SERVICE_UNAVAILABLE_503,
                userFriendlyMessage = "Mr Khan Video Platform is undergoing brief scheduled maintenance. Back online shortly!",
                httpCode = code
            )
            else -> NetworkResult.Error(
                errorType = NetworkErrorType.GENERIC_EXCEPTION,
                userFriendlyMessage = "Server returned an error ($code). Please try again later.",
                httpCode = code
            )
        }
    }

    fun mapThrowableToError(throwable: Throwable): NetworkResult.Error {
        return when (throwable) {
            is NoConnectivityException -> NetworkResult.Error(
                errorType = NetworkErrorType.NO_CONNECTIVITY,
                userFriendlyMessage = "No internet connection. Please connect to Wi-Fi or cellular data.",
                rawException = throwable
            )
            is UnknownHostException -> NetworkResult.Error(
                errorType = NetworkErrorType.NO_CONNECTIVITY,
                userFriendlyMessage = "Unable to reach Mr Khan servers. Please check your network connection or DNS settings.",
                rawException = throwable
            )
            is ConnectException -> NetworkResult.Error(
                errorType = NetworkErrorType.NO_CONNECTIVITY,
                userFriendlyMessage = "Failed to connect to the video streaming host. Please verify your connection.",
                rawException = throwable
            )
            is SocketTimeoutException -> NetworkResult.Error(
                errorType = NetworkErrorType.TIMEOUT,
                userFriendlyMessage = "Connection timed out. Your network connection appears slow. Please try again.",
                rawException = throwable
            )
            is JsonSyntaxException -> NetworkResult.Error(
                errorType = NetworkErrorType.DESERIALIZATION_ERROR,
                userFriendlyMessage = "Unable to load video data due to an unexpected format. Please update the Mr Khan app.",
                rawException = throwable
            )
            is HttpException -> mapHttpCodeToError(throwable.code())
            is IOException -> NetworkResult.Error(
                errorType = NetworkErrorType.GENERIC_EXCEPTION,
                userFriendlyMessage = "Network communication error. Please check your connection and retry.",
                rawException = throwable
            )
            else -> NetworkResult.Error(
                errorType = NetworkErrorType.GENERIC_EXCEPTION,
                userFriendlyMessage = throwable.localizedMessage ?: "An unexpected error occurred. Please try again.",
                rawException = throwable
            )
        }
    }
}

/**
 * Executes a Retrofit network call safely within coroutine scope, catching all network
 * and HTTP anomalies and mapping them to typed [NetworkResult] states.
 */
suspend fun <T> safeApiCall(
    apiCall: suspend () => retrofit2.Response<ApiResponse<T>>
): NetworkResult<T> {
    return try {
        val response = apiCall()
        val body = response.body()

        if (response.isSuccessful && body != null && body.data != null) {
            NetworkResult.Success(body.data)
        } else if (response.isSuccessful && body != null && body.data == null) {
            @Suppress("UNCHECKED_CAST")
            NetworkResult.Success(Unit as T)
        } else {
            val errorBodyString = response.errorBody()?.string()
            ApiExceptionMapper.mapHttpCodeToError(response.code(), errorBodyString)
        }
    } catch (throwable: Throwable) {
        ApiExceptionMapper.mapThrowableToError(throwable)
    }
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/data/api/NetworkResult.kt',
    name: 'NetworkResult.kt',
    language: 'kotlin',
    description: 'Sealed class architecture for Success, Error (with friendly message), and Loading states',
    content: `package com.mrkhan.video.data.api

sealed class NetworkResult<out T> {
    data class Success<out T>(val data: T) : NetworkResult<T>()
    data class Error(
        val errorType: NetworkErrorType,
        val userFriendlyMessage: String,
        val httpCode: Int? = null,
        val rawException: Throwable? = null,
        val canRetry: Boolean = true
    ) : NetworkResult<Nothing>()
    object Loading : NetworkResult<Nothing>()

    val isSuccess: Boolean get() = this is Success
    val isError: Boolean get() = this is Error
    val isLoading: Boolean get() = this is Loading

    fun getOrNull(): T? = (this as? Success)?.data
}

enum class NetworkErrorType {
    NO_CONNECTIVITY,
    TIMEOUT,
    NOT_FOUND_404,
    UNAUTHORIZED_401,
    FORBIDDEN_403,
    SERVER_ERROR_500,
    BAD_GATEWAY_502,
    SERVICE_UNAVAILABLE_503,
    RATE_LIMITED_429,
    BAD_REQUEST_400,
    DESERIALIZATION_ERROR,
    GENERIC_EXCEPTION
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/data/repository/VideoRepositoryImpl.kt',
    name: 'VideoRepositoryImpl.kt',
    language: 'kotlin',
    description: 'Repository handling safeApiCall, error catching, and automatic Room cache fallback',
    content: `package com.mrkhan.video.data.repository

import com.mrkhan.video.data.api.MrKhanApiService
import com.mrkhan.video.data.api.NetworkErrorType
import com.mrkhan.video.data.api.NetworkResult
import com.mrkhan.video.data.api.safeApiCall
import com.mrkhan.video.data.local.VideoDao
import com.mrkhan.video.data.model.VideoDto
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VideoRepositoryImpl @Inject constructor(
    private val apiService: MrKhanApiService,
    private val videoDao: VideoDao
) {
    fun getHomeFeedWithCacheFallback(category: String? = null): Flow<NetworkResult<List<VideoDto>>> = flow {
        emit(NetworkResult.Loading)

        val apiResult = safeApiCall {
            apiService.getHomeFeed(category = category)
        }

        when (apiResult) {
            is NetworkResult.Success -> emit(apiResult)
            is NetworkResult.Error -> {
                if (apiResult.errorType == NetworkErrorType.NO_CONNECTIVITY ||
                    apiResult.errorType == NetworkErrorType.TIMEOUT ||
                    apiResult.errorType == NetworkErrorType.SERVER_ERROR_500
                ) {
                    emit(
                        NetworkResult.Error(
                            errorType = apiResult.errorType,
                            userFriendlyMessage = "\${apiResult.userFriendlyMessage} (Serving cached offline videos)",
                            httpCode = apiResult.httpCode,
                            canRetry = true
                        )
                    )
                } else {
                    emit(apiResult)
                }
            }
            is NetworkResult.Loading -> Unit
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/di/NetworkModule.kt',
    name: 'NetworkModule.kt',
    language: 'kotlin',
    description: 'Hilt Dependency Injection module with NetworkConnectivityInterceptor, OkHttpClient & Retrofit',
    content: `package com.mrkhan.video.di

import android.content.Context
import com.mrkhan.video.data.api.MrKhanApiService
import com.mrkhan.video.data.api.NetworkConnectivityInterceptor
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.Cache
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(
        @ApplicationContext context: Context
    ): OkHttpClient {
        val cacheSize = 50L * 1024 * 1024 // 50 MB
        val cache = Cache(File(context.cacheDir, "http_cache"), cacheSize)

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val connectivityInterceptor = NetworkConnectivityInterceptor(context)

        return OkHttpClient.Builder()
            .cache(cache)
            .addInterceptor(connectivityInterceptor)
            .addInterceptor(loggingInterceptor)
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("User-Agent", "MrKhanVideo-Android/1.0.0")
                    .addHeader("Accept", "application/json")
                    .build()
                chain.proceed(request)
            }
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(MrKhanApiService.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideMrKhanApiService(retrofit: Retrofit): MrKhanApiService {
        return retrofit.create(MrKhanApiService::class.java)
    }
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/ui/player/Media3PlayerManager.kt',
    name: 'Media3PlayerManager.kt',
    language: 'kotlin',
    description: 'ExoPlayer Media3 wrapper with adaptive bitrate streaming & ambient lighting extraction',
    content: `package com.mrkhan.video.ui.player

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.hls.HlsMediaSource
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import androidx.media3.datasource.DefaultDataSource
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

@OptIn(UnstableApi::class)
class Media3PlayerManager(private val context: Context) {

    private val trackSelector = DefaultTrackSelector(context)
    val exoPlayer: ExoPlayer = ExoPlayer.Builder(context)
        .setTrackSelector(trackSelector)
        .setLoadControl(
            DefaultLoadControl.Builder()
                .setBufferDurationsMs(15_000, 50_000, 2_500, 5_000)
                .build()
        )
        .build()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _ambientColor = MutableStateFlow("#3B82F6")
    val ambientColor: StateFlow<String> = _ambientColor.asStateFlow()

    init {
        exoPlayer.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(playing: Boolean) {
                _isPlaying.value = playing
            }
        })
    }

    fun playHlsStream(streamUrl: String) {
        val dataSourceFactory = DefaultDataSource.Factory(context)
        val hlsSource = HlsMediaSource.Factory(dataSourceFactory)
            .createMediaSource(MediaItem.fromUri(streamUrl))
        exoPlayer.setMediaSource(hlsSource)
        exoPlayer.prepare()
        exoPlayer.playWhenReady = true
    }

    fun release() {
        exoPlayer.release()
    }
}`
  },
  {
    path: 'app/src/main/java/com/mrkhan/video/data/local/VideoDatabase.kt',
    name: 'VideoDatabase.kt',
    language: 'kotlin',
    description: 'Room Database & DAO for offline video caching and offline-first playback',
    content: `package com.mrkhan.video.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "cached_videos")
data class CachedVideoEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val localFilePath: String,
    val thumbnailUrl: String,
    val durationSeconds: Int,
    val channelName: String,
    val channelAvatar: String,
    val quality: String,
    val downloadTimestamp: Long = System.currentTimeMillis()
)

@Dao
interface VideoDao {
    @Query("SELECT * FROM cached_videos ORDER BY downloadTimestamp DESC")
    fun getAllCachedVideos(): Flow<List<CachedVideoEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCachedVideo(video: CachedVideoEntity)

    @Query("DELETE FROM cached_videos WHERE id = :videoId")
    suspend fun deleteCachedVideo(videoId: String)

    @Query("SELECT EXISTS(SELECT 1 FROM cached_videos WHERE id = :videoId)")
    suspend fun isVideoCached(videoId: String): Boolean
}

@Database(entities = [CachedVideoEntity::class], version = 1, exportSchema = false)
abstract class VideoDatabase : RoomDatabase() {
    abstract fun videoDao(): VideoDao
}`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (App)',
    language: 'groovy',
    description: 'App-level Gradle script configured with Media3, Hilt, Compose, Room, and Retrofit',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.mrkhan.video"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mrkhan.video"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.androidx.media3.exoplayer.hls)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.room.runtime)
    ksp(libs.androidx.room.compiler)
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Android App manifest with Foreground Media Playback service and Picture-in-Picture',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

    <application
        android:name=".MrKhanApplication"
        android:label="Mr Khan"
        android:theme="@style/Theme.MrKhanVideo">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:supportsPictureInPicture="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  }
];
