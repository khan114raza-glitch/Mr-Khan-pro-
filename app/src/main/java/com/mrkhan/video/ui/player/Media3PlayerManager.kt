package com.mrkhan.video.ui.player

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

/**
 * Media3 ExoPlayer Manager with Adaptive Bitrate Streaming (HLS) and Ambient Lighting State
 */
@OptIn(UnstableApi::class)
class Media3PlayerManager(private val context: Context) {

    private val trackSelector = DefaultTrackSelector(context)
    val exoPlayer: ExoPlayer = ExoPlayer.Builder(context)
        .setTrackSelector(trackSelector)
        .setLoadControl(
            DefaultLoadControl.Builder()
                .setBufferDurationsMs(
                    15_000, // min buffer
                    50_000, // max buffer
                    2_500,  // buffer for playback
                    5_000   // buffer for playback after rebuffer
                ).build()
        )
        .build()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _ambientColor = MutableStateFlow("#1E293B")
    val ambientColor: StateFlow<String> = _ambientColor.asStateFlow()

    init {
        exoPlayer.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) {
                _isPlaying.value = isPlaying
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                // Manage buffering & playback status
            }
        })
    }

    fun playHlsStream(streamUrl: String, title: String) {
        val dataSourceFactory = DefaultDataSource.Factory(context)
        val hlsMediaSource = HlsMediaSource.Factory(dataSourceFactory)
            .createMediaSource(
                MediaItem.Builder()
                    .setUri(streamUrl)
                    .setMimeType(MimeTypes.APPLICATION_M3U8)
                    .build()
            )

        exoPlayer.setMediaSource(hlsMediaSource)
        exoPlayer.prepare()
        exoPlayer.playWhenReady = true
    }

    fun setQualityMaxHeight(maxHeight: Int) {
        trackSelector.parameters = trackSelector.buildUponParameters()
            .setMaxVideoSize(Int.MAX_VALUE, maxHeight)
            .build()
    }

    fun release() {
        exoPlayer.release()
    }
}
