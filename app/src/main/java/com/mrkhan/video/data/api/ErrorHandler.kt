package com.mrkhan.video.data.api

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
            // Null data with 200 OK
            @Suppress("UNCHECKED_CAST")
            NetworkResult.Success(Unit as T)
        } else {
            val errorBodyString = response.errorBody()?.string()
            ApiExceptionMapper.mapHttpCodeToError(response.code(), errorBodyString)
        }
    } catch (throwable: Throwable) {
        ApiExceptionMapper.mapThrowableToError(throwable)
    }
}
