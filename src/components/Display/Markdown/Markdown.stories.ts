import type { Meta, StoryObj } from '@storybook/vue3';

import Markdown from './Markdown.vue';
import MarkdownText from '@/components/Display/Markdown/MarkdownText.vue';

const meta: Meta<typeof Markdown> = {
    component: Markdown,
};

export default meta;

type Story = StoryObj<typeof Markdown>;

const content = `
## Header

---

Some **bold** Some *italic* and [a link][1]

A little code sample

    </head>
    <title>Web Page Title</title>
    </head>

A picture

:tada:

![alt text][2]
![alt text 2](http://www.google.com/intl/en_ALL/images/logo.gif)

A list

- apples
- oranges
- eggs

A numbered list

1. a
2. b
3. c

A little quote

> Cogito ergo sum!

A final paragraph.

[1]: http://www.google.com
[2]: http://www.google.com/intl/en_ALL/images/logo.gif
`;

export const Default: Story = {
    args: {
        data: content,
        // Add props here
    },
    render: (args) => ({
        components: { Markdown },
        setup() {
            return { args };
        },
        template: '<Markdown v-bind="args" />',
    }),
};

export const ReadOnly: Story = {
    args: {
        data: content,
        readonly: true,
        // Add props here
    },
    render: (args) => ({
        components: { Markdown },
        setup() {
            return { args };
        },
        template: '<Markdown v-bind="args" />',
    }),
};

export const ViewerOnly: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Use when you only need to render the markdown.',
            },
        },
    },
    args: {
        data: content,
        // Add props here
    },
    render: (args) => ({
        components: { MarkdownText },
        setup() {
            return { args };
        },
        template: '<MarkdownText v-bind="args" />',
    }),
};