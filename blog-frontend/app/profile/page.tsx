"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getProfile, updateProfile } from '@/redux/slices/profileSlice';

import {
  Edit,
  Eye,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Settings,
  FileText,
  Globe,
  MapPin,
  Camera,
  X,
  User
} from "lucide-react";

export default function Profile() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { profile, loading, error } = useAppSelector((state) => state.profile);

  // Get blogs from Redux store if available, otherwise use empty array
  const blogs = useAppSelector((state) => state.posts?.posts || []);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");

  // Form state for editing profile
  const [editForm, setEditForm] = useState({
    username: "",
    name: "",
    bio: "",
    personal_link: ""
  });

  // File states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit form when profile loads
  useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || "",
        name: profile.name || "",
        bio: profile.bio || "",
        personal_link: profile.personal_link || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId));
    }
  }, [dispatch, userId]);

  const handleBlogClick = (blog: any) => {
    setSelectedBlog(blog);
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (updatedBlog: any) => {
    setSelectedBlog(updatedBlog);
  };

  const handleDeleteBlog = (blogId: number) => {
    setIsBlogModalOpen(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview("");
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = () => {
    const formData = new FormData();

    if (editForm.username !== profile?.username) {
      formData.append('username', editForm.username);
    }
    if (editForm.name !== profile?.name) {
      formData.append('name', editForm.name);
    }
    if (editForm.bio !== profile?.bio) {
      formData.append('bio', editForm.bio);
    }
    if (editForm.personal_link !== profile?.personal_link) {
      formData.append('personal_link', editForm.personal_link);
    }
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    if (formData.has('username') || formData.has('name') || formData.has('bio') || formData.has('personal_link') || profileImage || coverImage) {
      dispatch(updateProfile(formData)).then(() => {
        // Refresh profile data after update
        if (userId) {
          dispatch(getProfile(userId));
        }
        // Reset file states
        setProfileImage(null);
        setCoverImage(null);
        setProfileImagePreview("");
        setCoverImagePreview("");
      });
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: profile?.username || "",
      name: profile?.name || "",
      bio: profile?.bio || "",
      personal_link: profile?.personal_link || ""
    });
    // Reset file states
    setProfileImage(null);
    setCoverImage(null);
    setProfileImagePreview("");
    setCoverImagePreview("");
    setIsEditing(false);
  };

  // Format date for joined date display
  const formatJoinedDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
                  <AvatarImage src={profile?.profile_image} />
                  <AvatarFallback>{(profile?.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{profile?.username || "User"}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString() : selectedBlog.date}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{selectedBlog.readTime || "5 min read"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedBlog.published}
                  onCheckedChange={(checked) =>
                    handleSaveBlog({ ...selectedBlog, published: checked })
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
                  handleSaveBlog({ ...selectedBlog, title: e.target.value })
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
                  handleSaveBlog({ ...selectedBlog, content: e.target.value })
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

  if (loading && !profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <div className="text-center text-destructive">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header with Cover Image */}
      <Card className="border border-border shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          {isEditing ? (
            <div className="relative w-full h-full">
              {(coverImagePreview || profile?.cover_image) && (
                <Image
                  src={coverImagePreview || profile?.cover_image || ""}
                  alt="Cover"
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    onChange={handleCoverImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => coverFileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {coverImagePreview || profile?.cover_image ? 'Change Cover' : 'Upload Cover'}
                  </Button>
                  {(coverImagePreview || profile?.cover_image) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeCoverImage}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : profile?.cover_image ? (
            <Image
              src={profile.cover_image}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <CardContent className="p-8 pt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 -mt-24 lg:-mt-32">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={profileImagePreview || profile?.profile_image}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="rounded-full w-10 h-10 p-0"
                      onClick={() => profileFileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              {isEditing && profileImagePreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeProfileImage}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Photo
                </Button>
              )}
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Photo
                </Button>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  {!isEditing ? (
                    <>
                      <h2 className="text-3xl font-bold">{profile?.name || profile?.username || "User"}</h2>
                      <p className="text-muted-foreground text-lg">@{profile?.username || "user"}</p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm(prev => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm(prev => ({ ...prev, username: e.target.value }))
                          }
                          placeholder="Your username"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
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
                  <div className="text-2xl font-bold text-foreground">{profile?.followersCount || 0}</div>
                  <div className="text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{profile?.followingCount || 0}</div>
                  <div className="text-muted-foreground">Following</div>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{profile?.bio || "No bio yet."}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatJoinedDate(profile?.created_at || "")}</span>
                    </div>
                    {profile?.personal_link && (
                      <a
                        href={profile.personal_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{profile.personal_link}</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm(prev => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal_link">Personal Link</Label>
                    <Input
                      id="personal_link"
                      value={editForm.personal_link}
                      onChange={(e) =>
                        setEditForm(prev => ({ ...prev, personal_link: e.target.value }))
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      {/* <Card className="border border-border shadow-lg">
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
                        <div className="relative aspect-video">
                          <Image
                            src={blog.image || "/api/placeholder/400/250"}
                            alt={blog.title}
                            fill
                            className="object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                              {blog.readTime || "5 min read"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{blog.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{blog.comments || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{blog.views || 0}</span>
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
                            <p className="text-sm text-muted-foreground">
                              {blog.excerpt || blog.content?.substring(0, 100) + "..."}
                            </p>
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
      </Card> */}

      {/* Blog Modal */}
      <BlogModal />
    </div>
  );
}