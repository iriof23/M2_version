import Image from '@tiptap/extension-image';
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react';
import { ImageNodeView } from './ImageNodeView';

export const ResizableImage = Image.extend({
    name: 'resizableImage',

    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '75%',
                renderHTML: (attributes) => {
                    return {
                        width: attributes.width,
                    };
                },
            },
            align: {
                default: 'center',
                renderHTML: (attributes) => {
                    return {
                        'data-align': attributes.align,
                    };
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
    },

    renderHTML({ HTMLAttributes }) {
        const { style, ...rest } = HTMLAttributes;
        return [
            'div',
            {
                style: `display: flex; justify-content: ${HTMLAttributes['data-align'] === 'left'
                    ? 'flex-start'
                    : HTMLAttributes['data-align'] === 'right'
                        ? 'flex-end'
                        : 'center'
                    }`,
            },
            ['img', mergeAttributes(this.options.HTMLAttributes, rest)],
        ];
    },
});
