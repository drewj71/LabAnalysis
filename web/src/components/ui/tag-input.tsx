import React, { useState, useEffect } from "react";
import { Controller, type UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  control: any; // react-hook-form control
  setValue: UseFormSetValue<any>;
  name: string; // field name
  placeholder?: string;
  suggestions?: string[]; // optional autocomplete suggestions
  defaultValue?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ control, setValue, name, placeholder, suggestions = [], defaultValue = [] }) => {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Keep form in sync with local state
    setValue(name, tags);
  }, [tags, name, setValue]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={tags}
      render={() => (
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>

          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(inputValue);
              }
            }}
            list={`${name}-suggestions`}
          />
          <datalist id={`${name}-suggestions`}>
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
      )}
    />
  );
};

export default TagInput;