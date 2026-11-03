
import type { PartialStoryFn, StoryContext } from '@storybook/types';

export const usePreventContextDecorator = (callback: Function) => {
    return {
        parameters: {
            layout: 'fullscreen',
        },
        decorators: [preventBrowserContextMenu(callback)],
    }
}


export const preventBrowserContextMenu = function (callback: Function) {

    return (_) => {
        return {
            //// Sadly the following does not have any effect and you should use the 'usePreventContextDecorator' utility function instead!
            // parameters:{
            //     layout: 'fullscreen',
            // },
            template: `
                    <div 
                        @contextmenu.prevent="handleContextMenu"
                        style="position: absolute; height: 100%; width: 100%; border: 1px solid magenta;"
                    >
                        <story/>
                    </div>`,
            methods: {
                handleContextMenu() {
                    callback(...arguments);
                }
            }
        }
    }
};

export const rowDecorator = () => {
    return (story: PartialStoryFn, context: StoryContext) => ({
        components: { story },
        setup() {
            return { args: context.args };
        },
        template: `<div class="d-flex gap-2"><story /></div>`,
    })
}

export const columnDecorator = () => {
    return (story: PartialStoryFn, context: StoryContext) => ({
        components: { story },
        setup() {
            return { args: context.args };
        },
        template: `<div class="d-flex flex-column gap-2"><story /></div>`,
    })
}