<template>
    <button
        class="x-button user-select-none d-flex no-wrap gap-1"
        :class="buttonClasses"
        style="cursor: pointer;"
        :type="props.type"
        :aria-pressed="active"
        :disabled="isDisabled"
        :title="title"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @click="clicked()"
    >
        <LoadingSpinner
            v-if="loading"
            :size="size"
        />
        <template v-else-if="hasIcon">
            <!-- Can be used to render your own custom icon, e.g. if you need to create an icon composition.  -->
            <slot
                name="icon"
                :active="isActive"
            >
            </slot>
            <template v-if="icon && !slots.icon">
                <div
                    v-if="!isActive"
                    class="icon"
                >
                    <div
                        v-if="hasMultipleIcons && Array.isArray(icon)"
                        class="icon-group d-flex gap-1"
                    >
                        <FontAwesomeIcon
                            v-for="iconPart of icon"
                            :key="iconPart.iconName"
                            :icon="iconPart"
                            :size="size"
                        />
                    </div>
                    <FontAwesomeIcon
                        v-else-if="!isStackedIcon"
                        :icon="icon"
                        :size="size"
                        :fixed-width="fixedWidth"
                    />
                    <StackedIcon
                        v-else
                        :data="icons"
                        :size="size"
                        :fixed-width="fixedWidth"
                    />
                </div>
                <div
                    v-else
                    class="icon"
                >
                    <FontAwesomeIcon
                        v-if="icon !== undefined && !isStackedIcon"
                        :icon="activeIcon"
                        :size="size"
                        :fixed-width="fixedWidth"
                    />
                    <StackedIcon
                        v-else
                        :data="icons"
                        :size="size"
                        :fixed-width="fixedWidth"
                    />
                </div>
            </template>
        </template>
        <Transition name="fade-hover-text">
            <span v-if="text && showHoveredText">
                {{ text }}
            </span>
        </Transition>
        <Transition name="fade-hover-text">
            <span
                v-if="slots.default && showHoveredText"
                class="button-text-content"
            >
                <slot></slot>
            </span>
        </Transition>
    </button>
</template>

<script
    setup
    lang="ts"
>
    import {
        computed,
        ModelRef,
        ref,
        useSlots
    } from 'vue';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import type { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';

    import type { StackedIcon as StackedIconType } from 'src/types/Icon';
    import type { ButtonColors } from '@/types/Colors';

    import StackedIcon from '@/components/Layout/StackedIcon/StackedIcon.vue';
    import LoadingSpinner from '@/components/Indicators/LoadingSpinner/LoadingSpinner.vue';
    import { HorizontalPosition } from 'src/types/Potisioning';
import { ButtonType } from 'src/types/Button';
    
    const slots = useSlots();
    const emit = defineEmits(['action']);

    const value: ModelRef<boolean | undefined, string> = defineModel();
    const props = withDefaults(defineProps<{
        active?: boolean;
        activeButtonClass?: ButtonColors;
        activeIcon?: string | IconDefinition | IconDefinition[];
        activeIconCategory?: string;
        align?: HorizontalPosition;
        buttonClass?: ButtonColors;
        disabled?: boolean | Function;
        fixedWidth?: boolean;
        icon?: string | IconDefinition | IconDefinition[];
        icons?: StackedIconType;
        iconCategory?: string;
        loading?: boolean;
        size?: SizeProp;
        small?: boolean;
        unbutton?: boolean;
        outlined?: boolean;
        title?: string;
        text?: string;
        textOnHover?: boolean;
        textFirst?: boolean;
        type?: ButtonType;
    }>(), {
        active: undefined,
        activeButtonClass: 'primary',
        activeIconCategory: 'fas',
        align: 'center',
        buttonClass: 'secondary',
        disabled: false,
        fixedWidth: true,
        iconCategory: 'fas',
        loading: false,
        small: false,
        unbutton: false,
        outlined: false,
        text: '',
        textOnHover: false,
        textFirst: false,
        type: 'button',
    });

    const resolveIconProp = (prop: string | IconDefinition, category: string) => {
        if (typeof prop === 'string') {
            let stringDefinition = `${category} fa-${prop}`;
            if (props.fixedWidth) {
                stringDefinition += ' fa-fw';
            }
            return stringDefinition;
        } else {
            return prop;
        }
    };

    const isHovered = ref(false);

    const clicked = () => {
        if (value.value !== undefined) {
            value.value = !value.value;
        }
        emit('action');
    };

    const hasMultipleIcons = computed(() => {
        return Array.isArray(props.icon) && (typeof props.icon[0] !== 'string');
    });

    const isStackedIcon = computed(() => {
        return !props.icon && props.icons?.items;
    });

    const icon = computed(() => {
        if (Array.isArray(props.icon)) {
            return props.icon;
        } else {
            return resolveIconProp(props.icon ?? '', props.iconCategory);
        }
    });

    const activeIcon = computed(() => {
        if (props.activeIcon && Array.isArray(props.activeIcon)) {
            return props.activeIcon;
        } else if (props.icon && Array.isArray(props.icon)) {
            return props.icon;
        } else {
            return resolveIconProp(props.activeIcon ?? props.icon ?? '', props.activeIconCategory);
        }
    });

    const showHoveredText = computed(() => {
        return !props.textOnHover || isHovered.value;
    });

    const buttonClasses = computed(() => {
        const baseName = props.outlined ? 'btn-outline' : 'btn';
        const btnColor = isActive.value ? props.activeButtonClass : props.buttonClass;
        const classes = [
            'btn',
            `${baseName}-${btnColor}`,
        ];

        if (props.small) {
            classes.push('btn-sm');
        }

        if (isActive.value) {
            classes.push('active');
        }

        if (props.unbutton) {
            classes.push('bg-transparent border-0 p-0');
            if (!isActive.value) {
                classes.push(`text-${props.buttonClass}`);
            } else {
                classes.push(`text-${props.activeButtonClass}`);
            }
        }

        classes.push('d-flex');
        classes.push('align-items-center');
        classes.push('gap-2');

        if (props.align === 'left') {
            classes.push('justify-content-start');
        } else if (props.align === 'right') {
            classes.push('justify-content-end');
        } else {
            classes.push('justify-content-center');
        }

        if (props.textFirst) {
            classes.push('flex-row-reverse');
        }

        return classes;
    });

    const isActive = computed(() => {
        return props.active != null ? props.active : value.value;
    });

    const isDisabled = computed(() => {
        if(props.loading) {
            return true;
        }
        
        if (typeof props.disabled === 'boolean') {
            return props.disabled;
        } else {
            return props.disabled();
        }
    });

    const hasIcon = computed(() => {
        return props.icon !== undefined || slots.icon !== undefined || (props.icons && props.icons.items);
    });
</script>

<style scoped>

    .fade-hover-text-enter-active,
    .fade-hover-text-leave-active {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-hover-text-enter-from {
        opacity: 0;
        transform: translateX(-5px);
    }

    .fade-hover-text-leave-to {
        opacity: 0;
    }
</style>