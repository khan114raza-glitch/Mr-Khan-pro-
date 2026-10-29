package com.mrkhan.video.data.api

/**
 * Sealed class representing network operation state with comprehensive error classification.
 * Used across Mr Khan Video Sharing Platform MVVM layers.
 */
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

/**
 * Granular classification of all mobile network and server failure states.
 */
enum class NetworkErrorType {
    NO_CONNECTIVITY,       // Device is offline or no route to host
    TIMEOUT,               // SocketTimeoutException / connection handshake timeout
    NOT_FOUND_404,         // Video, channel, or stream playlist does not exist
    UNAUTHORIZED_401,      // Missing or expired bearer token
    FORBIDDEN_403,         // Geographic licensing or channel blocking
    SERVER_ERROR_500,      // Backend server crashed or unhandled exception
    BAD_GATEWAY_502,       // Edge CDN / Cloudflare or gateway failure
    SERVICE_UNAVAILABLE_503, // Server undergoing maintenance or overloaded
    RATE_LIMITED_429,      // Exceeded request limits
    BAD_REQUEST_400,       // Malformed JSON or invalid parameter
    DESERIALIZATION_ERROR, // Moshi/Gson failed to parse response schema
    GENERIC_EXCEPTION      // Unhandled runtime or I/O failure
}
