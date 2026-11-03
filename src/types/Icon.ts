import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type RawIcon = {
    icon: IconDefinition | string[],
    transforms?: string[],
    style?: Record<string, any>,
}

export interface StackedIcon {
    type: string,
    classes?: string[],
    items: RawIcon[],
}