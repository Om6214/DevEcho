"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  Edit, 
  Eye, 
  Calendar, 
  Clock, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  X,
  Upload,
  Settings,
  FileText,
  Globe,
  MapPin
} from "lucide-react";

export default function Profile() {
  // Example user data
  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
    bio: "Frontend Developer | Blogger | Tech Enthusiast with passion for creating amazing user experiences and writing about modern web technologies.",
    location: "Mumbai, India",
    followers: 128,
    following: 96,
    joinedDate: "January 2023",
    website: "https://johndoe.dev"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");

  // Sample blog data
  const [blogs, setBlogs] = useState([
    { 
      id: 1, 
      title: "Getting Started with React and TypeScript", 
      image: "/api/placeholder/400/250?text=React+TS",
      content: `# Getting Started with React and TypeScript\n\nReact and TypeScript are a powerful combination for building modern web applications...`,
      excerpt: "Learn how to combine React with TypeScript for type-safe, maintainable code that scales beautifully.",
      date: "2024-01-15",
      readTime: "5 min read",
      likes: 24,
      comments: 8,
      views: 156,
      tags: ["react", "typescript", "webdev", "beginners"],
      published: true
    },
    { 
      id: 2, 
      title: "Mastering CSS Grid: Complete Guide", 
      image: "/api/placeholder/400/250?text=CSS+Grid",
      content: `# Mastering CSS Grid: Complete Guide\n\nCSS Grid Layout is a powerful tool for creating complex, responsive web layouts...`,
      excerpt: "Unlock the full potential of CSS Grid to create complex, responsive layouts with ease and precision.",
      date: "2024-01-20",
      readTime: "8 min read",
      likes: 42,
      comments: 12,
      views: 289,
      tags: ["css", "grid", "frontend", "layout"],
      published: true
    },
    { 
      id: 3, 
      title: "Next.js 14: What's New and Amazing", 
      image: "/api/placeholder/400/250?text=Next.js+14",
      content: `# Next.js 14: What's New and Amazing\n\nNext.js 14 brings exciting new features that make building React applications even better...`,
      excerpt: "Discover the latest features in Next.js 14 that will revolutionize how you build React applications.",
      date: "2024-02-01",
      readTime: "6 min read",
      likes: 31,
      comments: 5,
      views: 198,
      tags: ["nextjs", "react", "framework", "performance"],
      published: false
    },
  ]);

  const handleBlogClick = (blog: any) => {
    setSelectedBlog(blog);
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (updatedBlog: any) => {
    setBlogs(blogs.map(blog => 
      blog.id === updatedBlog.id ? updatedBlog : blog
    ));
    setSelectedBlog(updatedBlog);
  };

  const handleDeleteBlog = (blogId: number) => {
    setBlogs(blogs.filter(blog => blog.id !== blogId));
    setIsBlogModalOpen(false);
  };

  const BlogModal = () => (
    <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Blog Details</span>
          </DialogTitle>
          <DialogDescription>
            View and edit your blog post
          </DialogDescription>
        </DialogHeader>

        {selectedBlog && (
          <div className="space-y-6">
            {/* Blog Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/api/placeholder/40/40?text=JD" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{selectedBlog.date}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{selectedBlog.readTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedBlog.published}
                  onCheckedChange={(checked) => 
                    handleSaveBlog({...selectedBlog, published: checked})
                  }
                />
                <Label>{selectedBlog.published ? "Published" : "Draft"}</Label>
              </div>
            </div>

            {/* Blog Content */}
            <div className="space-y-2">
              <Label htmlFor="modal-title">Title</Label>
              <Input
                id="modal-title"
                value={selectedBlog.title}
                onChange={(e) => 
                  handleSaveBlog({...selectedBlog, title: e.target.value})
                }
                className="text-xl font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-content">Content</Label>
              <Textarea
                id="modal-content"
                value={selectedBlog.content}
                onChange={(e) => 
                  handleSaveBlog({...selectedBlog, content: e.target.value})
                }
                rows={12}
                className="resize-none font-mono text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this blog?')) {
                    handleDeleteBlog(selectedBlog.id);
                  }
                }}
              >
                Delete Blog
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsBlogModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsBlogModalOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Activity Icon Component
  const ActivityIcon = (props: any) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card className="border border-border shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src="/api/placeholder/128/128?text=JD" alt="User Avatar" />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Photo
              </Button>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground text-lg">@{user.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{blogs.length}</div>
                  <div className="text-muted-foreground">Blogs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.followers}</div>
                  <div className="text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{user.following}</div>
                  <div className="text-muted-foreground">Following</div>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{user.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {user.joinedDate}</span>
                    </div>
                    <a href={user.website} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Globe className="w-4 h-4" />
                      <span>{user.website}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={user.bio}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, bio: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={user.location}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, location: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={user.website}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, website: e.target.value }))
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="mt-2"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section - FIXED STRUCTURE */}
      <Card className="border border-border shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Your Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="blogs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blogs ({blogs.filter(b => b.published).length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Drafts ({blogs.filter(b => !b.published).length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blogs" className="space-y-4">
              {blogs.filter(b => b.published).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No published blogs yet.</p>
                  <Button className="mt-4">Write Your First Blog</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.filter(b => b.published).map((blog) => (
                    <Card
                      key={blog.id}
                      className="hover:shadow-lg transition-all cursor-pointer border border-border group"
                      onClick={() => handleBlogClick(blog)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                              {blog.readTime}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{blog.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{blog.comments}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{blog.views}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts">
              {blogs.filter(b => !b.published).length === 0 ? (
                <div className="text-center py-12">
                  <Edit className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No drafts yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.filter(b => !b.published).map((blog) => (
                    <Card key={blog.id} className="border border-dashed border-muted-foreground/30">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground">{blog.excerpt}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleBlogClick(blog)}
                          >
                            Continue Editing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <div className="text-center py-12">
                <ActivityIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Activity feed coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Blog Modal */}
      <BlogModal />
    </div>
  );
}