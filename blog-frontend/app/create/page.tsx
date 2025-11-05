"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image as ImageIcon,
  Eye,
  Code,
  Bold,
  Italic,
  Link,
  List,
  Send,
  X,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("tags", tags);
      formData.append("published", isPublished.toString());
      if (image) formData.append("image", image);

      // Example POST request
      //   const res = await fetch("http://localhost:5000/api/blogs", {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (!res.ok) throw new Error("Failed to create blog");

      console.log(formData)
      // Success notification would go here
      alert("Blog posted successfully!");

      // Reset form
      setTitle("");
      setContent("");
      setExcerpt("");
      setTags("");
      setImage(null);
      setPreview(null);
      setIsPublished(false);
      setCharCount(0);
      setActiveTab("write");
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  const formatText = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    let newCursorPos = start;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        newCursorPos = start + selectedText.length + 3;
        break;
      case "list":
        formattedText = `\n- ${selectedText}`;
        newCursorPos = start + 3;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Restore cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos + (format === "list" ? selectedText.length : 0));
      }
    }, 0);
  };

  const PreviewContent = () => {
    if (activeTab !== "preview") return null;

    return (
      <div className="min-h-[300px] border-2 border-border rounded-xl p-4 ">
        {content ? (
          <div className="prose max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-2 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start writing to see the preview...</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br  px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text mb-3">
            Create Your Masterpiece
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, stories, and ideas with the world. Craft something amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden  backdrop-blur-sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 " />
                    New Blog Post
                  </CardTitle>
                  <Badge variant={isPublished ? "default" : "secondary"} className="text-sm">
                    {isPublished ? "Public" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Title Input */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                    <span>Blog Title</span>
                    <Badge variant="outline" className="text-xs">
                      {title.length}/100
                    </Badge>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Craft an attention-grabbing title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="h-12 text-lg border-2 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>

                {/* Excerpt Input */}
                <div className="space-y-3">
                  <Label htmlFor="excerpt" className="text-base font-semibold">
                    Short Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    placeholder="A brief summary of your blog post..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="min-h-20 border-2 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>

                {/* Content Editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content" className="text-base font-semibold">
                      Your Story
                    </Label>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {charCount} characters
                      </Badge>
                      <Tabs>
                        <TabsList className="grid w-32 grid-cols-2">
                          <TabsTrigger
                            value="write"
                            onClick={() => setActiveTab("write")}
                            className="flex items-center gap-1"
                          >
                            <Code className="w-3 h-3" />
                          </TabsTrigger>
                          <TabsTrigger
                            value="preview"
                            onClick={() => setActiveTab("preview")}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  {activeTab === "write" && (
                    <>
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("bold")}
                          className="h-8 w-8 p-0"
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("italic")}
                          className="h-8 w-8 p-0"
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("link")}
                          className="h-8 w-8 p-0"
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("list")}
                          className="h-8 w-8 p-0"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>

                      <Textarea
                        ref={textareaRef}
                        id="content"
                        placeholder="Start writing your amazing content here... You can use Markdown for formatting!"
                        value={content}
                        onChange={handleContentChange}
                        className="min-h-[300px] font-mono text-base border-2 focus:border-blue-500 transition-colors rounded-xl"
                      />
                    </>
                  )}

                  {activeTab === "preview" && <PreviewContent />}
                </div>

                {/* Tags Input */}
                <div className="space-y-3">
                  <Label htmlFor="tags" className="text-base font-semibold">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="Add relevant tags (separated by commas)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border-2 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload Card */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden  backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500/50 transition-colors bg-muted/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>

                {preview && (
                  <div className="relative group">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-xl border-2 border-border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish Settings Card */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Publish Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish-toggle" className="text-sm font-medium">
                    Publish immediately
                  </Label>
                  <Switch
                    id="publish-toggle"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !title.trim() || !content.trim()}
                    className="w-full  from-zinc-600 to-black hover:from-zinc-700 hover:to-black text-white font-semibold py-2.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Publishing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 dark:text-black">
                        <Send className="w-4 h-4" />
                        Publish Blog
                      </div>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-2"
                    disabled={loading}
                  >
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden  backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Writing Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Characters</span>
                  <span className="font-semibold">{charCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Words</span>
                  <span className="font-semibold">
                    {content.trim() ? content.trim().split(/\s+/).length : 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reading Time</span>
                  <span className="font-semibold">
                    {Math.ceil(content.trim().split(/\s+/).length / 200) || 0} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}