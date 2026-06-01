"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryCombobox } from "./category-combobox";
import { ArrowLeft, Save } from "lucide-react";

interface CreateNoteFormProps {
  categories: string[];
  onSave: (data: { title: string; content: string; category: string }) => void;
  onCancel: () => void;
}

export function CreateNoteForm({
  categories,
  onSave,
  onCancel,
}: CreateNoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSave({ title: title.trim(), content, category });
    setIsSaving(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <span className="text-lg font-medium text-foreground">
            Create Note
          </span>
        </div>
        <Button
          onClick={handleSave}
          disabled={!title.trim() || isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Note"}
        </Button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">
              Title
            </Label>
            <Input
              ref={titleRef}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="border-border/50 bg-secondary/30 text-lg font-medium text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm text-muted-foreground">
              Category
            </Label>
            <CategoryCombobox
              categories={categories}
              value={category}
              onChange={setCategory}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm text-muted-foreground">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-[300px] resize-none border-border/50 bg-secondary/30 text-foreground leading-relaxed placeholder:text-muted-foreground/40 focus-visible:ring-primary/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
