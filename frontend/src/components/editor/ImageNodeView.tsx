import { NodeViewWrapper } from '@tiptap/react';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Editor } from '@tiptap/core';
import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageNodeViewProps {
    node: ProseMirrorNode;
    updateAttributes: (attrs: Record<string, any>) => void;
    editor: Editor;
    selected: boolean;
    deleteNode: () => void;
}

export const ImageNodeView = ({ node, updateAttributes, selected, deleteNode }: ImageNodeViewProps) => {
    const [caption, setCaption] = useState(node.attrs.caption || '');

    const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCaption = e.target.value;
        setCaption(newCaption);
        updateAttributes({ caption: newCaption });
    };

    const handleWidthChange = (width: string) => {
        updateAttributes({ width });
    };

    const justifyContent =
        node.attrs.align === 'left'
            ? 'flex-start'
            : node.attrs.align === 'right'
                ? 'flex-end'
                : 'center';

    return (
        <NodeViewWrapper className="my-6 flex group/node" style={{ justifyContent }}>
            <div
                className="relative transition-all"
                style={{ width: node.attrs.width || '75%' }}
            >
                {/* Image */}
                <div className={cn(
                    "relative rounded-lg overflow-hidden transition-all duration-200",
                    selected ? "ring-2 ring-primary ring-offset-2 ring-offset-zinc-950" : ""
                )}>
                    <img
                        src={node.attrs.src}
                        alt={node.attrs.alt || ''}
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>

                {/* Glassmorphic Toolbar - Visible on hover or selection */}
                <div className={cn(
                    "absolute top-3 right-3 flex items-center gap-1 backdrop-blur-md bg-black/50 border border-white/10 rounded-full px-2 py-1 z-50 transition-all duration-200",
                    selected || "opacity-0 group-hover/node:opacity-100"
                )}>
                    <button
                        onClick={() => handleWidthChange('25%')}
                        className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors",
                            node.attrs.width === '25%' ? "bg-white/20 text-white" : "text-zinc-300 hover:text-white hover:bg-white/10"
                        )}
                    >
                        25%
                    </button>
                    <button
                        onClick={() => handleWidthChange('50%')}
                        className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors",
                            node.attrs.width === '50%' ? "bg-white/20 text-white" : "text-zinc-300 hover:text-white hover:bg-white/10"
                        )}
                    >
                        50%
                    </button>
                    <button
                        onClick={() => handleWidthChange('75%')}
                        className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors",
                            node.attrs.width === '75%' ? "bg-white/20 text-white" : "text-zinc-300 hover:text-white hover:bg-white/10"
                        )}
                    >
                        75%
                    </button>
                    <button
                        onClick={() => handleWidthChange('100%')}
                        className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full transition-colors",
                            node.attrs.width === '100%' ? "bg-white/20 text-white" : "text-zinc-300 hover:text-white hover:bg-white/10"
                        )}
                    >
                        100%
                    </button>

                    <div className="w-px h-3 bg-white/20 mx-1" />

                    <button
                        onClick={deleteNode}
                        className="p-1 text-zinc-300 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                        title="Delete Image"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>

                {/* Caption Input */}
                <input
                    type="text"
                    value={caption}
                    onChange={handleCaptionChange}
                    placeholder="Write a caption..."
                    className="mt-2 w-full bg-transparent text-center text-sm text-zinc-500 placeholder:text-zinc-600 focus:outline-none focus:text-zinc-300 transition-colors"
                />
            </div>
        </NodeViewWrapper>
    );
};
