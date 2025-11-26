import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Code,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Terminal,
    RemoveFormatting,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
    editor: Editor | null;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className={cn(
                'p-2 rounded-md transition-colors hover:bg-zinc-800',
                isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            )}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-950/80 sticky top-0 z-20 backdrop-blur-md">
            {/* Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="Inline Code"
            >
                <Code className="h-4 w-4" />
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-6 bg-zinc-800 mx-1" />

            {/* Structure */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-6 bg-zinc-800 mx-1" />

            {/* Premium Blocks */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Callout / Note"
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="Terminal / Code Block"
            >
                <Terminal className="h-4 w-4" />
            </ToolbarButton>

            {/* Divider */}
            <div className="w-px h-6 bg-zinc-800 mx-1" />

            {/* Clear Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                title="Clear Formatting"
            >
                <RemoveFormatting className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
};
