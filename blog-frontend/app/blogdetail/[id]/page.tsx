"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Clock, 
  Eye, 
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  user: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  isLiked: boolean;
  replies?: Comment[];
}

interface Blog {
  id: string;
  author: string;
  username: string;
  avatar: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  readTime: string;
  createdAt: string;
  category: string;
  views: number;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showFullContent, setShowFullContent] = useState(false);

  // Enhanced dummy data with realistic content
  const dummyBlogs: Blog[] = [
    {
      id: "1",
      author: "John Doe",
      username: "johndoe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "The Future of AI in 2025: What to Expect",
      content: `
        Artificial Intelligence (AI) is reshaping industries faster than we ever imagined. In this comprehensive article, we explore what's next for AI — from ethical challenges to real-world applications that will transform our daily lives.

        ## The Rise of Generative AI
        
        Generative AI has taken the world by storm, and this is just the beginning. By 2025, we expect to see more sophisticated models that can understand context better and generate more accurate, human-like responses across various domains.

        ## Ethical Considerations
        
        As AI becomes more integrated into our lives, ethical considerations become increasingly important. We need to address issues like bias in algorithms, data privacy, and the potential impact on employment across various sectors.

        ## Real-World Applications
        
        From healthcare diagnostics to autonomous vehicles, AI applications are becoming more prevalent. The integration of AI in education, climate modeling, and creative industries shows the vast potential of this technology to solve complex problems.

        ## The Human-AI Collaboration
        
        The future isn't about AI replacing humans, but about humans and AI working together. We'll see more tools that augment human capabilities, making us more efficient and creative in our work.

        ## Challenges Ahead
        
        Despite the progress, significant challenges remain. Technical limitations, regulatory hurdles, and public acceptance will shape how quickly these AI technologies are adopted across different industries.
      `,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      likes: 245,
      comments: 38,
      readTime: "8 min read",
      createdAt: "2 days ago",
      category: "Technology",
      views: 1247
    },
  ];

  // Sample comments data
  const sampleComments: Comment[] = [
    {
      id: 1,
      user: "Sarah Chen",
      username: "sarahc",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "This is such a comprehensive overview! The section on ethical considerations really resonated with me. We need more discussions like this in the tech community.",
      likes: 12,
      time: "1 hour ago",
      isLiked: false,
      replies: [
        {
          id: 11,
          user: "Mike Ross",
          username: "mikeross",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          content: "Completely agree, Sarah! The ethical implications are often overlooked in the rush to adopt new technologies.",
          likes: 3,
          time: "45 minutes ago",
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      user: "Alex Thompson",
      username: "alexthompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      content: "Great insights! I'm particularly excited about the human-AI collaboration aspects. The future looks promising when we focus on augmentation rather than replacement.",
      likes: 8,
      time: "3 hours ago",
      isLiked: false
    },
    {
      id: 3,
      user: "Tech Enthusiast",
      username: "techie",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face",
      content: "The healthcare applications mentioned here could revolutionize patient care. Early disease detection through AI is already showing promising results!",
      likes: 15,
      time: "5 hours ago",
      isLiked: false
    }
  ];

  useEffect(() => {
    const blogFound = dummyBlogs.find((b) => b.id === id);
    if (blogFound) {
      setBlog(blogFound);
      setComments(sampleComments);
    }
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: "You",
      username: "currentuser",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      content: commentText,
      likes: 0,
      time: "just now",
      isLiked: false
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText("");
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleAddReply = () => {
      if (!replyText.trim()) return;

      const newReply: Comment = {
        id: Date.now(),
        user: "You",
        username: "currentuser",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        content: replyText,
        likes: 0,
        time: "just now",
        isLiked: false
      };

      setComments(prev => prev.map(c => 
        c.id === comment.id 
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      ));
      setReplyText("");
      setShowReply(false);
    };

    return (
      <div className={`space-y-4 ${depth > 0 ? 'ml-12 border-l-2 border-muted pl-4' : ''}`}>
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={comment.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {comment.user.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">{comment.user}</span>
              <span className="text-xs text-muted-foreground">@{comment.username}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{comment.time}</span>
            </div>
            <p className="text-sm mb-3 leading-relaxed">{comment.content}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs ${
                  comment.isLiked ? "text-blue-500 bg-blue-50" : "text-muted-foreground"
                }`}
                onClick={() => handleCommentLike(comment.id)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {comment.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-muted-foreground"
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
              </Button>
              {depth === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-muted-foreground"
                  onClick={() => setShowReply(!showReply)}
                >
                  Reply
                </Button>
              )}
            </div>

            {showReply && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-20 text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAddReply}
                    disabled={!replyText.trim()}
                  >
                    Post Reply
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowReply(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
  };

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted animate-pulse"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blogs
      </Button>

      {/* Author Header */}
      <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarImage src={blog.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {blog.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{blog.author}</p>
                  <Badge variant="secondary" className="text-xs">
                    {blog.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">@{blog.username}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {blog.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Bookmark 
                  className={`h-5 w-5 transition-all ${
                    saved 
                      ? "fill-primary text-primary scale-110" 
                      : "text-muted-foreground"
                  }`} 
                />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Title and Metadata */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {blog.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
            <Clock className="h-4 w-4" />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
            <Calendar className="h-4 w-4" />
            Published {blog.createdAt}
          </span>
          <span className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
            <Eye className="h-4 w-4" />
            {blog.views.toLocaleString()} views
          </span>
        </div>
      </div>

      <Separator />

      {/* Blog Image */}
      {blog.image && (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg">
          <img
            src={blog.image}
            alt="Blog Cover"
            className="w-full object-cover h-[400px] lg:h-[500px]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
        </div>
      )}

      {/* Blog Content */}
      <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className={`leading-relaxed text-foreground whitespace-pre-line ${
              !showFullContent && blog.content.length > 800 ? 'max-h-96 overflow-hidden' : ''
            }`}>
              {blog.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="mb-4 text-base leading-7">
                    {paragraph}
                  </p>
                );
              })}
            </div>
            
            {blog.content.length > 800 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="rounded-full px-6"
                >
                  {showFullContent ? 'Show Less' : 'Continue Reading'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blog Actions */}
      <Card className="border border-border shadow-lg rounded-2xl overflow-hidden sticky bottom-4 bg-background/95 backdrop-blur-sm">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLike}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  liked 
                    ? "text-red-500 bg-red-50 hover:bg-red-100" 
                    : "hover:bg-muted"
                }`}
              >
                <Heart 
                  className={`h-5 w-5 transition-all ${
                    liked 
                      ? "fill-red-500 scale-110" 
                      : ""
                  }`} 
                />
                <span className={`font-semibold ${liked ? "text-red-600" : ""}`}>
                  {blog.likes + (liked ? 1 : 0)}
                </span>
              </Button>

              <Button 
                variant="ghost" 
                size="lg"
                className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-muted transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">{blog.comments + comments.length}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-muted transition-all"
              >
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Section */}
      <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sorted by: Latest</span>
              </div>
            </div>

            {/* Add Comment */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px] text-base resize-none border-border focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      size="lg"
                      className="px-8 rounded-full"
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}