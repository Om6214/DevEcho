"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  author: string;
  username: string;
  avatar: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  readTime: string;
  category: string;
  date: string;
}

interface Comment {
  id: number;
  user: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  isLiked: boolean;
}

export default function Blogs() {
  const router = useRouter();
  const [likedBlogs, setLikedBlogs] = useState<number[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<number[]>([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  // Example random blogs with better placeholder images
  const blogs: Blog[] = [
    {
      id: 1,
      author: "John Doe",
      username: "johndoe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: "The Future of AI in 2025",
      content: "Artificial Intelligence is rapidly evolving. Here's what to expect in 2025 as we see breakthroughs in machine learning, natural language processing, and computer vision that will transform industries worldwide...",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
      likes: 32,
      comments: 4,
      readTime: "5 min read",
      category: "Technology",
      date: "2 hours ago"
    },
    {
      id: 2,
      author: "Jane Smith",
      username: "janesmith",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      title: "Exploring the Mountains of Nepal",
      content: "A journey through the Himalayas that changed my perspective on life and taught me the true meaning of resilience. The breathtaking views and warm hospitality of the local communities made this an unforgettable adventure...",
      image: "https://images.unsplash.com/photo-1544735716-2fdfb0078412?w=600&h=400&fit=crop",
      likes: 18,
      comments: 2,
      readTime: "7 min read",
      category: "Travel",
      date: "5 hours ago"
    },
    {
      id: 3,
      author: "Mike Ross",
      username: "mikeross",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      title: "Learning React in 2025",
      content: "React keeps evolving — let's explore hooks, suspense, and server components. The ecosystem has matured significantly, and here are the best practices for building scalable applications in the current landscape...",
      image: "",
      likes: 45,
      comments: 12,
      readTime: "4 min read",
      category: "Programming",
      date: "1 day ago"
    },
    {
      id: 4,
      author: "Sarah Wilson",
      username: "sarahw",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      title: "Sustainable Living in Urban Areas",
      content: "How to incorporate eco-friendly practices into city life without compromising convenience. From vertical gardening to smart energy consumption, discover practical tips for reducing your carbon footprint...",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
      likes: 28,
      comments: 7,
      readTime: "6 min read",
      category: "Lifestyle",
      date: "3 hours ago"
    }
  ];

  // Sample comments for each blog
  const sampleComments: Comment[] = [
    {
      id: 1,
      user: "Alex Chen",
      username: "alexchen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      content: "Great article! Really enjoyed the insights about future developments.",
      likes: 12,
      time: "1 hour ago",
      isLiked: false
    },
    {
      id: 2,
      user: "Tech Enthusiast",
      username: "techie",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face",
      content: "Love this perspective. Can't wait to see these changes implemented!",
      likes: 8,
      time: "2 hours ago",
      isLiked: false
    },
    {
      id: 3,
      user: "Design Guru",
      username: "designlover",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      content: "The examples provided here are really helpful for understanding the concepts.",
      likes: 5,
      time: "3 hours ago",
      isLiked: false
    }
  ];

  const handleLike = (blogId: number) => {
    setLikedBlogs(prev =>
      prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSave = (blogId: number) => {
    setSavedBlogs(prev =>
      prev.includes(blogId)
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleCommentLike = (blogId: number, commentId: number) => {
    setComments(prev => {
      const blogComments = prev[blogId] || sampleComments;
      const updatedComments = blogComments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      );
      return { ...prev, [blogId]: updatedComments };
    });
  };

  const handleAddComment = (blogId: number) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: "Current User",
      username: "you",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      content: commentText,
      likes: 0,
      time: "just now",
      isLiked: false
    };

    setComments(prev => {
      const existingComments = prev[blogId] || [];
      return { ...prev, [blogId]: [newComment, ...existingComments] };
    });

    setCommentText("");
  };

  const BlogCard = ({ blog }: { blog: Blog }) => {
    const blogComments = comments[blog.id] || sampleComments;

    return (
      <Card className="border border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden group">
        <CardHeader
          className="flex flex-row items-start gap-3 cursor-pointer p-6 pb-4"
          onClick={() => router.push(`/blogdetail/${blog.id}`)}
        >
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage src={blog.avatar} alt={blog.author} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {blog.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-base leading-tight">{blog.author}</p>
              <p className="text-sm text-muted-foreground">@{blog.username}</p>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.date}
              </span>
            </div>
            <Badge variant="secondary" className="mt-2 text-xs font-normal">
              {blog.category}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleSave(blog.id);
            }}
            className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Bookmark
              className={`h-4 w-4 transition-all ${savedBlogs.includes(blog.id)
                  ? "fill-primary text-primary scale-110"
                  : "text-muted-foreground"
                }`}
            />
          </Button>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Blog title and content */}
          <div
            className="space-y-3 cursor-pointer"
            onClick={() => router.push(`/blogdetail/${blog.id}`)}
          >
            <h2 className="font-bold text-2xl leading-tight group-hover:text-primary transition-colors duration-200">
              {blog.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {blog.content}
            </p>

            {blog.image && (
              <div className="relative overflow-hidden rounded-xl mt-4 border border-border">
                <img
                  src={blog.image}
                  alt="Blog Image"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0  from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{Math.floor(blog.likes * 2.5)} reads</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4" />
              <span>{blog.readTime}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(blog.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${likedBlogs.includes(blog.id)
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "hover:bg-muted"
                  }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${likedBlogs.includes(blog.id)
                      ? "fill-red-500 scale-110"
                      : ""
                    }`}
                />
                <span className={`font-medium ${likedBlogs.includes(blog.id) ? "text-red-600" : ""}`}>
                  {blog.likes + (likedBlogs.includes(blog.id) ? 1 : 0)}
                </span>
              </Button>

              {/* Comment Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted transition-all duration-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{blog.comments}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold">Comments</DialogTitle>
                    <DialogDescription>
                      Join the conversation for "{blog.title}"
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {blogComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback className="text-xs">
                            {comment.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">@{comment.username}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 px-2 text-xs ${comment.isLiked ? "text-blue-500" : "text-muted-foreground"
                                }`}
                              onClick={() => handleCommentLike(blog.id, comment.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-muted-foreground"
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-muted-foreground"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 ">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <textarea
                          placeholder="Add your comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full border border-border rounded-lg p-3 text-sm bg-background resize-none min-h-20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleAddComment(blog.id)}
                            disabled={!commentText.trim()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-muted transition-all duration-200"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* Blog Cards */}
      <div className="space-y-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-8">
        <Button variant="outline" className="rounded-full px-8 py-6 hover:bg-muted transition-all duration-200">
          Load More Blogs
        </Button>
      </div>
    </div>
  );
}