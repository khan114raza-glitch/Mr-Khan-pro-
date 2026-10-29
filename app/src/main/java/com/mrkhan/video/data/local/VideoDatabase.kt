package com.mrkhan.video.data.local

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
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
}
