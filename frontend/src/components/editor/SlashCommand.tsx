import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { Editor, Range } from '@tiptap/core';
import {
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Code,
    CheckSquare,
    Text,
    Image as ImageIcon,
    Info,
    Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItemProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface CommandProps {
    editor: Editor;
    range: Range;
}

const Command = Extension.create({
    name: 'slash-command',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            icon: Heading1,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run();
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            icon: Heading2,
            command: ({ editor, range }: CommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run();
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bullet list.',
            icon: List,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a list with numbering.',
            icon: ListOrdered,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: 'Code Block',
            description: 'Capture a code snippet.',
            icon: Code,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
        {
            title: 'Callout / Note',
            description: 'Insert a highlighted note box.',
            icon: Info,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
            },
        },
        {
            title: 'Terminal / Code',
            description: 'Insert a code snippet or log.',
            icon: Terminal,
            command: ({ editor, range }: CommandProps) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
    ].filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
            return item.title.toLowerCase().includes(query.toLowerCase());
        }
        return true;
    });
};

export const renderItems = () => {
    let component: any;
    let popup: any;

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            // @ts-ignore
            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            });
        },
        onUpdate: (props: any) => {
            component.updateProps(props);

            if (!props.clientRect) {
                return;
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }

            return component.ref?.onKeyDown(props);
        },
        onExit: () => {
            popup[0].destroy();
            component.destroy();
        },
    };
};

// Since we want to avoid 'tippy.js' dependency if possible, let's implement a simpler custom renderer
// or just use the standard React way if we can.
// However, Tiptap's suggestion extension is designed to work well with tippy or similar.
// Given the prompt asked for "Basic Implementation", I will create a React component that handles the menu logic
// but Tiptap's suggestion API is a bit imperative.

// Let's try a simpler approach: passing a React component to the suggestion render option is tricky without a library like `react-renderer` from tiptap-react (which is internal/deprecated or requires setup).
// Actually, `@tiptap/react` exports `ReactRenderer`.

import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

// We need to install tippy.js as per my plan note, but I didn't.
// Let's check if I can do it without tippy.
// I can use a custom render function that just updates a React state, but that requires hoisting state up.
// For now, I'll assume I can use a simple absolute positioned div if I had access to coordinates.

// Wait, I missed installing `tippy.js` in the previous step.
// I will implement a version that uses a portal or just `tippy.js` if I install it.
// The prompt said "You don't need to build a complex fuzzy search... A simple popover is fine".
// I'll stick to the plan of using `SlashCommand` extension but maybe I should install `tippy.js` to make it easy,
// OR I can write a custom renderer that uses a portal.

// Let's go with the `tippy.js` approach as it's standard for Tiptap.
// I will add a step to install `tippy.js` next.

const CommandList = ({ items, command, editor, range }: any) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
        (item: any) => {
            if (item && item.command) {
                item.command({ editor, range });
            }
        },
        [editor, range]
    );

    useEffect(() => {
        const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
        const onKeyDown = (e: KeyboardEvent) => {
            if (navigationKeys.includes(e.key)) {
                e.preventDefault();
                if (e.key === 'ArrowUp') {
                    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                    return true;
                }
                if (e.key === 'ArrowDown') {
                    setSelectedIndex((selectedIndex + 1) % items.length);
                    return true;
                }
                if (e.key === 'Enter') {
                    selectItem(items[selectedIndex]);
                    return true;
                }
                return false;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [items, selectedIndex, setSelectedIndex, selectItem]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    return (
        <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-2 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-2 px-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Commands
            </div>
            {items.map((item: any, index: number) => (
                <button
                    type="button"
                    className={cn(
                        'flex w-full items-center space-x-3 rounded-lg px-2 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/50 transition-all duration-200',
                        index === selectedIndex && 'bg-zinc-800 text-white'
                    )}
                    key={index}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        e.stopPropagation();
                        selectItem(item);
                    }}
                >
                    <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 transition-colors",
                        index === selectedIndex && "border-zinc-700 bg-zinc-800 text-white"
                    )}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium leading-none">{item.title}</span>
                        <span className="text-xs text-zinc-500 mt-1">{item.description}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default Command;
export { getSuggestionItems, CommandList };
