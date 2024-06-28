"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef, useState, useEffect } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);

interface RichTextEditorProps extends EditorProps {
  defaultValue?: string;
  disabled?: boolean; // Add disabled prop
}

export default forwardRef<Object, RichTextEditorProps>(function RichTextEditor(
  { defaultValue, disabled, ...props },
  ref,
) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  useEffect(() => {
    if (defaultValue) {
      const content = ContentState.createFromText(defaultValue);
      setEditorState(EditorState.createWithContent(content));
    }
  }, [defaultValue]);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
      readOnly={disabled} // Use disabled prop to set readOnly attribute
      editorClassName={cn(
        "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        props.editorClassName,
        disabled && "cursor-not-allowed bg-gray-200", // Optionally add some styles for disabled state
      )}
      toolbar={{
        options: disabled ? [] : ["inline", "list", "link", "history"], // Disable toolbar if readOnly
        inline: {
          options: ["bold", "italic", "underline"],
        },
      }}
      editorRef={(r) => {
        if (typeof ref === "function") {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      {...props}
    />
  );
});
