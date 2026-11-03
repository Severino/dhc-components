import type { Meta, StoryObj } from '@storybook/vue3';

import XButton from './XButton.vue';
import { faEnvelope, faEnvelopeOpen, faFaceMehBlank, faFaceSadCry, faFaceSmile, faFaceSmileWink, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';

import { columnDecorator, rowDecorator } from "$/decorators";

/**
 * Use the Button component if you need a button only with a single icon.
 * This button supports loading, custom styling and can be used as a toggle, by passing a v-model.
 *
 */
const meta: Meta<typeof XButton> = {
    component: XButton,
};

export default meta;

type Story = StoryObj<typeof XButton>;

export const Default: Story = {
    args: {
        // Add props here
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const Stacked: Story = {
    args: {
        icons: {
            type: 'fa-layers',
            classes: ['fa-fw'],
            items: [
                {
                    icon: faCircle,
                    transforms: ['shrink-2', 'up-1', 'left-2'],
                    style: { opacity: 0.5 },
                },
                {
                    icon: faCircleCheck,
                    transforms: ['shrink-2', 'down-1', 'right-2'],
                }
            ]
        },
        title: 'Stacked Action XButton'
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const Small: Story = {
    args: {
        // Add props here
        small: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const Disabled: Story = {
    args: {
        // Add props here
        disabled: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSadCry;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const DisabledFunction: Story = {
    args: {
        // Add props here
        disabled: () => {
            return 6 % 2 == 0;
        },
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSadCry;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const Toggle: Story = {
    args: {
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceMehBlank;
            args.activeIcon = faFaceSmileWink;

            const modelValue = ref(true);

            watch(() => args.modelValue, (newValue) => {
                if(modelValue.value !== newValue) {
                    modelValue.value = newValue;
                }
            })

            return { args, modelValue };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const DefaultSlot: Story = {
    args: {
        // Add props here
        text: 'Text from args',
        textOnHover: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args"><span class="fw-bold">Text from Default Slot</span></XButton>',
    }),
    decorators: [
        (story, context) => ({
            components: { story },
            setup() {
                return { args: context.args };
            },
            template: `<div class="xbutton-default-slot-story"><story /></div>`,
        })
    ]
};

export const DefaultSlotReverse: Story = {
    args: {
        // Add props here
        text: 'Text from args',
        textOnHover: true,
        textFirst: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args"><span class="fw-bold">Reverse Default Slot</span></XButton>',
    }),
    decorators: [
        (story, context) => ({
            components: { story },
            setup() {
                return { args: context.args };
            },
            template: `<div class="xbutton-default-slot-story"><story /></div>`,
        })
    ]
};

export const IconSlot: Story = {
    args: {
        // Add props here
    },
    render: (args: any) => ({
        components: {
            XButton,
            FontAwesomeIcon,
            FontAwesomeLayers,
            FontAwesomeLayersText
        },
        setup() {
            const modelValue = ref(false);
            const icons = {
                faEnvelope: faEnvelope,
                faEnvelopeOpen: faEnvelopeOpen,
            }
            return { args, modelValue, icons };
        },
        template: `
            <XButton v-bind="args" >
                <template #icon={active}>
                    <template v-if="active">
                        <FontAwesomeLayers full-width>
                            <FontAwesomeIcon :icon="icons.faEnvelope" transform="down-2 grow-3" />
                            <FontAwesomeLayersText counter value="100" transform="shrink-7 right-28 down-4" />
                        </FontAwesomeLayers>
                    </template>
                    <template v-else>
                        <FontAwesomeLayers full-width>
                            <FontAwesomeIcon :icon="icons.faEnvelopeOpen" transform="grow-3"/>
                        </FontAwesomeLayers>
                    </template>
                </template>
            </XButton>
        `,
    }),
};

const useLoading = (args: any) => {
    const loading = ref(args.loading.value);
    const loadingTimeout = ref<NodeJS.Timeout | null>(null);
    const clicked = () => setLoadingTimeout();

    onMounted(() => {
        if(args.loading) {
            setLoadingTimeout();
        }
    });

    const setLoadingTimeout = () => {
        if(loading.value) { return; }
        loading.value = true;
        loadingTimeout.value = setTimeout(() => {
            loading.value = false;
            loadingTimeout.value = null;
            // args.loading.value = false;
        }, 2000);
    };

    watch(() => args.loading, (newValue) => {
        if(loading.value !== newValue && newValue === true) {
            setLoadingTimeout();
        }
    });
    return { loading, clicked };
};

export const Loading: Story = {
    args: {
        // Add props here
        loading: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args, ...useLoading(args) };
        },
        template: '<XButton v-bind="args" :loading="loading" @action="clicked" />',
    }),
};

export const LoadingWithText: Story = {
    args: {
        loading: true,
        text: 'Hello World',
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args, ...useLoading(args) };
        },
        template: '<XButton v-bind="args" :loading="loading" @action="clicked" />',
    }),
};

export const LoadingWithTextReverse: Story = {
    args: {
        loading: true,
        text: 'Hello World',
        textFirst: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args, ...useLoading(args) };
        },
        template: '<XButton v-bind="args" :loading="loading" @action="clicked" />',
    }),
};

export const LoadingWithoutIcon: Story = {
    args: {
        loading: false,
        active: true,
        disabled: false,
        text: 'Hello World',
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            return { args, ...useLoading(args) };
        },
        template: '<XButton v-bind="args" :loading="loading" @action="clicked" />',
    }),
};

export const Align: Story = {
    decorators: [
        columnDecorator(),
    ],
    parameters: {
        docs: {
            description: {
                story: `You can align the content of the button to the left, center or right by setting the **align** property to 'left', 'center' or 'right'. 
                The default is 'center'.
                `,
            },
        },

    },
    args: {
        // Add props here
        text: 'Hello World',
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: `
        <XButton v-bind="args" style="width: 100%;" align="left" />
        <XButton v-bind="args" style="width: 100%;" align="center" />
        <XButton v-bind="args" style="width: 100%;" align="right" />
        `,
    }),
}

export const Iconless: Story = {
    args: {
        text: 'No Icon Button',
    },
};

/**
 *
 */
export const Active: Story = {
    args: {
        // Add props here
        loading: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {

            const icons = [
                faFaceSmile,
                faFaceSmileWink,
                faFaceSadCry,
                faFaceMehBlank,
            ]
            const mappedIcons = icons.map((icon, id) => ({ id, icon }));

            const selectedIcon = ref(0);

            return { args, mappedIcons, selectedIcon };
        },
        template: `
        <div class="d-flex gap-2 align-items-center">
            <div class="d-flex align-items-center text-center fw-bold">{{selectedIcon}}</div>
            <XButton v-for="icon in mappedIcons" :key="icon.id" :icon="icon.icon" @action="()=>selectedIcon=icon.id" :active="selectedIcon === icon.id"/>
        </div>`,
    }),
};

export const Unbutton: Story = {
    args: {
        // Add props here
        small: true,
        unbutton: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const UnbuttonActive: Story = {
    args: {
        // Add props here
        active: true,
        small: true,
        unbutton: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" />',
    }),
};

export const OnHover: Story = {
    decorators: [
        rowDecorator(),
    ],
    parameters: {
        docs: {
            description: {
                story: `You can show a text on hover by setting the **textOnHover** property to true. 
                The text will be shown on hover and hidden when the button is not hovered.
                **Try to avoid this feature as in relative positioning it changes the size of the button and interactions feel clunky.**
                `,
            },
        },
    },
    args: {
        // Add props here
        text: 'Hello World',
        textOnHover: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" /><XButton v-bind="args" :active="true" />',
    }),
};

export const OnHoverReverse: Story = {
    decorators: [
        rowDecorator(),
    ],
    parameters: {
        docs: {
            description: {
                story: `Works similarly to the **OnHover** story, but when setting **textFirst** to true, the text will be shown before the icon on hover.
                **Try to avoid this feature as in relative positioning it changes the size of the button and interactions feel clunky.**
                `,
            },
        },
    },
    args: {
        // Add props here
        text: 'Hello World',
        textOnHover: true,
        textFirst: true,
    },
    render: (args: any) => ({
        components: { XButton },
        setup() {
            args.icon = faFaceSmile;
            return { args };
        },
        template: '<XButton v-bind="args" /><XButton v-bind="args" :active="true" />',

    }),
};