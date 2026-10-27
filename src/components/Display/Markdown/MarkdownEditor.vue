<template>
    <div
        class="dhc-markdown-editor overflow-auto d-flex flex-column"
        :class="styleClasses"
    >
        <MarkdownToolbar
            v-if="!readonly"
            class="pb-0 m-2 mb-0"
            :editor="editor"
            :additional-tools="additionalTools"
            @toggle="setEditorType"
        />
        <MarkdownText
            v-show="state.type == 'md'"
            :data="data"
            :editor="editor"
            :class="state.editModeClasses"
        />
        <textarea
            v-show="state.type !== 'md'"
            v-model="state.markdownString"
            class="font-monospace border-0 p-4 flex-grow-1 w-100 rounded-3 bg-transparent"
            style="outline: none;"
        />
    </div>
</template>

<script
    setup
    lang="ts"
>
    import {
        computed,
        reactive,
        shallowRef,
        watch,
    } from 'vue';

    import {
        Editor,
        EditorStatus,
        defaultValueCtx,
        rootAttrsCtx,
        editorViewCtx,
        editorViewOptionsCtx,
    } from '@milkdown/core';

    import { commonmark } from '@milkdown/preset-commonmark';
    import { gfm } from '@milkdown/preset-gfm';
    import { listener, listenerCtx } from '@milkdown/plugin-listener';
    import { history } from '@milkdown/plugin-history';
    import { clipboard } from '@milkdown/plugin-clipboard';
    import { prism } from '@milkdown/plugin-prism';
    import { indent } from '@milkdown/plugin-indent';
    import { upload } from '@milkdown/plugin-upload';
    import {
        emojiAttr,
        remarkEmojiPlugin,
        emojiSchema,
    } from '@milkdown/plugin-emoji';
    import { replaceAll } from '@milkdown/utils';

    import { usePreventNavigation } from '@/composables/prevent-navigation';

    import { Tool } from '@/components/Layout/Toolbar/definitions';
    import MarkdownToolbar from './MarkdownToolbar.vue';
    import MarkdownText from '@/components/Display/Markdown/MarkdownText.vue';

    const props = withDefaults(defineProps<{
        data: string;
        readonly?: boolean;
        additionalTools?: Array<Tool>;
        unstyled?: boolean;
    }>(), {
        readonly: false,
        unstyled: false,
    });

    const emit = defineEmits<{
        (event: 'closing'): void;
        (event: 'update', markdown: string): void;
    }>();

    const emojiPlugin = [
        emojiAttr,
        remarkEmojiPlugin,
        emojiSchema,
    ].flat();

    // The editor is created here without a root; MarkdownText mounts it into the DOM.
    // shallowRef keeps Vue from proxying the editor (it relies on private fields).
    const editor = shallowRef<Editor>(
        Editor.make()
            .config((ctx) => {
                ctx.set(defaultValueCtx, props.data);
                ctx.update(rootAttrsCtx, (prev) => ({
                    ...prev,
                    class: `milkdown h-100`,
                }));
                ctx.update(editorViewOptionsCtx, (prev) => ({
                    ...prev,
                    editable: _ => !props.readonly,
                }));
                ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
                    state.markdownString = markdown;
                });
            })
            .use(commonmark)
            .use(gfm)
            .use(listener)
            .use(history)
            .use(clipboard)
            .use(prism)
            .use(emojiPlugin)
            .use(indent)
            .use(upload)
    );

    // ProseMirror only re-evaluates `editable` on view updates.
    watch(() => props.readonly, () => {
        const current = editor.value;
        if (current?.status !== EditorStatus.Created) { return; }
        current.action((ctx) => {
            const view = ctx.get(editorViewCtx);
            view.dispatch(view.state.tr);
        });
    });

    const state = reactive({
        dirty: false,
        show: false,
        markdownString: props.data,
        type: 'md',
        editModeClasses: computed(() => {
            if (!props.readonly) {
                return [
                    'flex-grow-1',
                    'overflow-y-auto',
                ];
            }
            return [];
        }),
    });

    const getMarkdown = () => {
        return state.markdownString;
    };
    const setMarkdown = (markdown: string) => {
        if (editor.value.status === EditorStatus.Created) {
            editor.value.action(replaceAll(markdown));
        }
    };
    const setEditorType = () => {
        if (state.type == 'md') {
            state.type = 'raw';
        } else {
            const markdown = getMarkdown();
            setMarkdown(markdown);
            state.type = 'md';
        }
    };

    // The hook is always registered, so the editor can be toggled between readonly and editable.
    usePreventNavigation(() => !props.readonly && state.dirty);

    watch(() => state.markdownString, (markdownString: string) => {
        state.dirty = markdownString != props.data;
        emit('update', markdownString);
    });

    const styleClasses = computed(() => {
        if (props.unstyled) return "unstyled"
        return "bg-white rounded"
    })

    defineExpose({
        getMarkdown,
        setMarkdown,
        setEditorType,
        editor,
        state,
    });
</script>