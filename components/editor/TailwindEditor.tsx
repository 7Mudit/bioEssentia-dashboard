"use client";
import { Separator } from "@/components/ui/separator";
import { uploadFn } from "@/lib/cloudinary-upload";
import { cn } from "@/lib/utils";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { handleCommandNavigation, ImageResizer } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { Dispatch, forwardRef, memo, SetStateAction, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ColorSelector } from "./color-selector";
import { defaultExtensions } from "./extensions";
import { LinkSelector } from "./link-selector";
import { NodeSelector } from "./node-selector";
import { slashCommand, suggestionItems } from "./slash-commands";
import { TextButtons } from "./text-buttons";

const extensions = [...defaultExtensions, slashCommand];

type Props = {
  blog: JSONContent | null;
  className?: string;
  setSaveStatus: Dispatch<SetStateAction<"Saved" | "Unsaved">>;
};

const EditorComponent = forwardRef<EditorInstance | null, Props>(
  ({ blog, className, setSaveStatus }, ref) => {
    const [initialContent] = useState<JSONContent | undefined>(
      blog ? blog : undefined
    );
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const debouncedUpdates = useDebouncedCallback(
      async (editor: EditorInstance) => {
        setSaveStatus("Unsaved");
      },
      500
    );

    return (
      <>
        <EditorRoot>
          <EditorContent
            immediatelyRender={false}
            onCreate={({ editor }) => {
              if (ref && "current" in ref) ref.current = editor;
            }}
            initialContent={initialContent}
            extensions={extensions}
            className={cn(
              "relative min-h-[500px] p-5 px-7 w-full border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg",
              className
            )}
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              handlePaste: (view, event) => {
                handleImagePaste(view, event, uploadFn);
              },
              handleDrop: (view, event, _slice, moved) => {
                handleImageDrop(view, event, moved, uploadFn);
              },
              attributes: {
                class:
                  "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
              },
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => {
                      if (item?.command) item.command(val);
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
            <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl">
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </EditorBubble>
          </EditorContent>
        </EditorRoot>
      </>
    );
  }
);

EditorComponent.displayName = "Editor";
const Editor = memo(EditorComponent);
export default Editor;
