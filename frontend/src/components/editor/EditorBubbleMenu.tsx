import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
    className?: string;
};

export const EditorBubbleMenu = (props: EditorBubbleMenuProps) => {
    if (!props.editor) {
        return null;
    }

    const onLinkClick = () => {
        if (props.editor?.isActive('link')) {
            props.editor.chain().focus().unsetLink().run();
            return;
        }

        const previousUrl = props.editor?.getAttributes('link').href;
        const url = window.prompt('Enter URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            props.editor?.chain().focus().unsetLink().run();
            return;
        }

        props.editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <BubbleMenu
            {...props}
            className={cn(
                'flex items-center space-x-1 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 shadow-md',
                props.className
            )}
            tippyOptions={{ duration: 100 }}
        >
            <button
                onClick={() => props.editor?.chain().focus().toggleBold().run()}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                    'rounded-full p-1.5 transition-colors',
                    props.editor.isActive('bold')
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().focus().toggleItalic().run()}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                    'rounded-full p-1.5 transition-colors',
                    props.editor.isActive('italic')
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().focus().toggleStrike().run()}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                    'rounded-full p-1.5 transition-colors',
                    props.editor.isActive('strike')
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </button>
            <button
                onClick={() => props.editor?.chain().focus().toggleCode().run()}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                    'rounded-full p-1.5 transition-colors',
                    props.editor.isActive('code')
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
                title="Code"
            >
                <Code className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <button
                onClick={onLinkClick}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                    'rounded-full p-1.5 transition-colors',
                    props.editor.isActive('link')
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                )}
                title="Link"
            >
                <LinkIcon className="h-4 w-4" />
            </button>
        </BubbleMenu>
    );
};
