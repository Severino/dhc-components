<template>
    <div ref="root" />
</template>

<script
    setup
    lang="ts"
>
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
    import {
        Editor,
        rootCtx,
        defaultValueCtx,
        editorViewOptionsCtx,
    } from '@milkdown/core';
    import { commonmark } from '@milkdown/preset-commonmark';
    import { replaceAll } from '@milkdown/utils';

    // If an editor is supplied it is rendered as is (and stays in charge of its
    // own data and editability). Otherwise a minimal read-only editor is created.
    const props = defineProps<{
        data: string;
        editor?: Editor;
    }>();

    const root = ref<HTMLDivElement>();
    let active: Editor | undefined;

    const createSimpleEditor = () => Editor.make()
        .config((ctx) => {
            ctx.set(defaultValueCtx, props.data);
            ctx.update(editorViewOptionsCtx, (prev) => ({
                ...prev,
                editable: () => false,
            }));
        })
        .use(commonmark)

    onMounted(async () => {
        const element = root.value;
        if (!element) { return; }

        active = props.editor ?? createSimpleEditor();
        active.config((ctx) => {
            ctx.set(rootCtx, element);
        });
        await active.create();
    });

    watch(() => props.data, (data) => {
        if (!props.editor) {
            active?.action(replaceAll(data));
        }
    });

    onBeforeUnmount(() => {
        active?.destroy();
        active = undefined;
    });
</script>
