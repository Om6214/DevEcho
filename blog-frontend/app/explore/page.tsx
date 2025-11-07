"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, Eye, Bookmark, MoreHorizontal, Hash, Sparkles, Zap } from "lucide-react";

interface TrendingTag {
    tag: string;
    count: string;
    growth: string;
    isNew: boolean;
}

interface PopularBlog {
    title: string;
    author: string;
    reads: string;
    time: string;
}

interface SuggestedUser {
    name: string;
    followers: string;
    isVerified: boolean;
}



export default function Explore() {
    const [search, setSearch] = useState("");
    const [savedTags, setSavedTags] = useState<string[]>([]);

    const trendingTags: TrendingTag[] = [
        { tag: "AI", count: "12.3K posts", growth: "15%", isNew: true },
        { tag: "ReactJS", count: "9.1K posts", growth: "8%", isNew: false },
        { tag: "Health", count: "5.6K posts", growth: "12%", isNew: true },
        { tag: "Space", count: "4.4K posts", growth: "5%", isNew: false },
        { tag: "Technology", count: "3.9K posts", growth: "3%", isNew: false },
        { tag: "Food", count: "3.2K posts", growth: "7%", isNew: false },
    ];

    const popularBlogs: PopularBlog[] = [
        { title: "The Future of Artificial Intelligence", author: "Sarah Chen", reads: "12.4K", time: "5 min read" },
        { title: "Mastering React Hooks in 2024", author: "Mike Johnson", reads: "8.7K", time: "7 min read" },
        { title: "Healthy Habits for Developers", author: "Dr. Emily Rose", reads: "6.2K", time: "4 min read" },
    ];

    const suggestedUsers: SuggestedUser[] = [
        { name: "Alex Morgan", followers: "24K", isVerified: true },
        { name: "Tech Insights", followers: "18K", isVerified: true },
        { name: "Design Guru", followers: "12K", isVerified: false },
    ];

    const toggleSaveTag = (tag: string) => {
        setSavedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold  from-foreground to-foreground/70 bg-clip-text ">
                        Explore Blogify
                    </h1>
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Discover trending topics, popular blogs, and amazing writers from around the world
                </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="sticky top-20 bg-background z-10 pb-4 pt-2">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search blogs, tags, users, or topics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 py-7 text-lg rounded-2xl shadow-sm border-2 focus:border-primary/20 transition-all bg-background"
                    />
                    <Button
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Search
                    </Button>
                </div>

                {/* Quick Search Suggestions */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["JavaScript", "Design", "Productivity", "Startup", "Machine Learning", "Web Development"].map((suggestion) => (
                        <Badge
                            key={suggestion}
                            variant="secondary"
                            className="px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors hover:scale-105 transform duration-200"
                            onClick={() => setSearch(suggestion)}
                        >
                            <Hash className="h-3 w-3 mr-1" />
                            {suggestion}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid  gap-8">
                {/* Main Content - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Trending Tags Section */}
                    <Card className="border border-border shadow-lg rounded-2xl overflow-hidden bg-background">
                        <CardHeader className="pb-4  from-muted/20 to-muted/10 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Trending Tags</h2>
                                        <p className="text-sm text-muted-foreground">Most popular topics right now</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
                                    <Clock className="h-3 w-3" />
                                    Live
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {trendingTags.map((item, index) => (
                                    <div
                                        key={item.tag}
                                        className="flex items-center justify-between p-6 hover:bg-muted/20 transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-1.5">
                                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold text-lg">{item.tag}</span>
                                                </div>
                                                {item.isNew && (
                                                    <Badge variant="default" className="text-xs px-2 py-0 bg-green-500 hover:bg-green-600">
                                                        <Zap className="h-3 w-3 mr-1" />
                                                        Trending
                                                    </Badge>
                                                )}
                                                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                                    <TrendingUp className="h-3 w-3" />
                                                    {item.growth}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.count}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSaveTag(item.tag);
                                                }}
                                                className="h-9 w-9 p-0 rounded-full"
                                            >
                                                <Bookmark
                                                    className={`h-4 w-4 transition-all ${savedTags.includes(item.tag)
                                                        ? "fill-primary text-primary scale-110"
                                                        : "text-muted-foreground"
                                                        }`}
                                                />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* View All Button */}
                            <div className="p-4 border-t">
                                <Button variant="outline" className="w-full hover:bg-muted/50">
                                    View All Trending Tags
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Blogs Section */}
                    <Card className="border border-border shadow-lg rounded-2xl overflow-hidden bg-background">
                        <CardHeader className="pb-4  from-muted/20 to-muted/10 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Eye className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Popular Blogs</h2>
                                    <p className="text-sm text-muted-foreground">Most read articles this week</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {popularBlogs.map((blog, index) => (
                                    <div
                                        key={index}
                                        className="p-6 hover:bg-muted/20 transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm mt-1">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-medium">By {blog.author}</span>
                                                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                                                            <Clock className="h-3 w-3" />
                                                            {blog.time}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-1 font-medium">
                                                        <Eye className="h-4 w-4" />
                                                        {blog.reads}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}