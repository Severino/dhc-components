<template>
    <MarkdownEditor
        ref="editorRef"
        :class="classes"
        :data="data"
        :readonly="readonly"
        :additional-tools="additionalTools"
        @update="emitUpdate"
    />
</template>

<script
    lang="ts"
    setup
>
    import {
        ref,
        watch,
    } from 'vue';

    import { Tool } from '@/components/Layout/Toolbar/definitions';
    import MarkdownEditor from './MarkdownEditor.vue';

    const props = withDefaults(defineProps<{
        data: string,
        classes: string,
        readonly: boolean
        additionalTools: Array<Tool>
    }>(), {
        classes: 'milkdown-wrapper h-100',
        readonly: false,
        additionalTools: () => [] as Array<Tool>
    });

    const emit = defineEmits<{
        (event: 'update', data: string): void
    }>();

    const editorRef = ref<InstanceType<typeof MarkdownEditor>>();

    const getEditorMarkdown = () => {
        return editorRef.value?.getMarkdown() ?? props.data;
    };

    const emitUpdate = (data: string) => {
        emit('update', data);
    };

    watch(() => props.data, (newData) => {
        editorRef.value?.setMarkdown(newData);
    });

    defineExpose({
        getEditorMarkdown
    })
</script>