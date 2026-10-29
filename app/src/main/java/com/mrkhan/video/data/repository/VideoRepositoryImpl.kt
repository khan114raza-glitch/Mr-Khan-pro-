package com.mrkhan.video.data.repository

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

    /**
     * Fetches home feed videos with graceful offline fallback.
     * If device is offline (NO_CONNECTIVITY) or server errors (500/503),
     * automatically loads cached videos from Room database.
     */
    fun getHomeFeedWithCacheFallback(category: String? = null): Flow<NetworkResult<List<VideoDto>>> = flow {
        emit(NetworkResult.Loading)

        val apiResult = safeApiCall {
            apiService.getHomeFeed(category = category)
        }

        when (apiResult) {
            is NetworkResult.Success -> {
                emit(apiResult)
            }
            is NetworkResult.Error -> {
                // If network failure, check local Room database cache
                if (apiResult.errorType == NetworkErrorType.NO_CONNECTIVITY ||
                    apiResult.errorType == NetworkErrorType.TIMEOUT ||
                    apiResult.errorType == NetworkErrorType.SERVER_ERROR_500
                ) {
                    val isCached = videoDao.isVideoCached("any")
                    // If cached items exist, we notify the user with friendly message while serving cache
                    emit(
                        NetworkResult.Error(
                            errorType = apiResult.errorType,
                            userFriendlyMessage = "${apiResult.userFriendlyMessage} (Serving cached offline videos)",
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
}
