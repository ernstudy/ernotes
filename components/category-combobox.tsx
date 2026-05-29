"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CategoryComboboxProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({
  categories,
  value,
  onChange,
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setInputValue("");
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim());
      setOpen(false);
      setInputValue("");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showCreateOption =
    inputValue.trim() &&
    !categories.some(
      (cat) => cat.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-border/50 bg-secondary/30 text-foreground hover:bg-secondary/50"
        >
          {value || "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command className="bg-card">
          <CommandInput
            placeholder="Search or create category..."
            value={inputValue}
            onValueChange={setInputValue}
            className="border-0"
          />
          <CommandList>
            <CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
              No category found.
            </CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => handleSelect(category)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  value={inputValue}
                  onSelect={handleCreateNew}
                  className="cursor-pointer text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create &quot;{inputValue}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
