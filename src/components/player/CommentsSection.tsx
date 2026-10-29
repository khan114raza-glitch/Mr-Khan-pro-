import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Comment } from '../../types/video';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onSeekTo: (seconds: number) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onSeekTo
}) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      authorName: 'Khan Raza (You)',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      content: commentInput.trim(),
      likes: 0,
      timestamp: 'Just now',
      isLiked: false,
      replyCount: 0
    };

    setLocalComments([newComment, ...localComments]);
    onAddComment(commentInput.trim());
    setCommentInput('');
  };

  const handleToggleLike = (commentId: string) => {
    setLocalComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
          };
        }
        return c;
      })
    );
  };

  // Convert text containing mm:ss or m:ss into clickable timestamp links
  const renderContentWithTimestamps = (content: string) => {
    const timestampRegex = /(\b\d{1,2}:\d{2}\b)/g;
    const parts = content.split(timestampRegex);

    return parts.map((part, index) => {
      if (timestampRegex.test(part)) {
        const [mins, secs] = part.split(':').map(Number);
        const totalSeconds = mins * 60 + secs;
        return (
          <button
            key={index}
            onClick={() => onSeekTo(totalSeconds)}
            className="text-blue-400 hover:text-blue-300 font-mono font-medium underline px-0.5 rounded focus-visible:outline-none"
            title={`Jump video to ${part}`}
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="mt-6">
      {/* Header and sorting */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-500" />
          <h3 className="text-base font-semibold text-white">
            {localComments.length} Comments
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-md transition-colors ${
              sortBy === 'top' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Comments
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-md transition-colors ${
              sortBy === 'newest' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          alt="Current User"
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
        />
        <div className="flex-1">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment... (Type timestamps like 0:45 to link video time)"
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/80 transition-colors"
          />
          {commentInput.trim() && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setCommentInput('')}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {localComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <img
              src={comment.authorAvatarUrl}
              alt={comment.authorName}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-xs">
                <span className="font-semibold text-slate-200">{comment.authorName}</span>
                <span className="text-slate-500">{comment.timestamp}</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {renderContentWithTimestamps(comment.content)}
              </div>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`flex items-center gap-1 hover:text-white transition-colors ${
                    comment.isLiked ? 'text-red-400 font-semibold' : ''
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-mono tabular-nums">{comment.likes}</span>
                </button>
                <button className="hover:text-white transition-colors">
                  Reply
                </button>
                {comment.videoTimestampSeek && (
                  <button
                    onClick={() => onSeekTo(comment.videoTimestampSeek!)}
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Seek</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
