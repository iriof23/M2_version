import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Code, Link as LinkIcon, Heading1, Heading2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    className?: string
}

export default function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-3 py-2',
            },
        },
    })

    if (!editor) {
        return null
    }

    const addLink = () => {
        const url = window.prompt('Enter URL:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className={cn('border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800', className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 flex-wrap">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('bold') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('italic') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('heading', { level: 1 }) && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('heading', { level: 2 }) && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('bulletList') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('orderedList') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('codeBlock') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Code Block"
                >
                    <Code className="w-4 h-4" />
                </button>
                <button
                    onClick={addLink}
                    className={cn(
                        'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                        editor.isActive('link') && 'bg-gray-200 dark:bg-gray-600'
                    )}
                    title="Insert Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    )
}
