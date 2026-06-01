"use client";

import { NoteSection } from "@/lib/types";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Star,
  Trash2,
  X,
  LogOut,
  Home,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface SidebarProps {
  currentSection: NoteSection;
  searchQuery: string;
  isMobileOpen?: boolean;
  onSectionChange: (section: NoteSection) => void;
  onSearchChange: (query: string) => void;
  onCreateNote: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({
  currentSection,
  searchQuery,
  isMobileOpen,
  onSectionChange,
  onSearchChange,
  onCreateNote,
  onMobileClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const sectionItems = [
    { id: "home" as NoteSection, label: "Home", icon: Home },
    { id: "all" as NoteSection, label: "All Notes", icon: FileText },
    { id: "categories" as NoteSection, label: "Categories", icon: Folder },
    { id: "favorites" as NoteSection, label: "Favorites", icon: Star },
    { id: "trash" as NoteSection, label: "Trash", icon: Trash2 },
  ];

  const handleSectionChange = (section: NoteSection) => {
    onSectionChange(section);
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:relative lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              ERNotes
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Note Button */}
        <div className="px-3 py-3">
          <Button
            onClick={() => {
              onCreateNote();
              onMobileClose?.();
            }}
            className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* Section Navigation */}
        <nav className="flex-1 px-3">
          <div className="flex flex-col gap-1">
            {sectionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  currentSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* User section */}
        {user && (
          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-sidebar-foreground/70 truncate">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
