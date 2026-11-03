import type { Meta, StoryObj } from '@storybook/vue3';
import { userEvent, expect } from '@storybook/test';

import Login from './Login.vue';
import { sleep } from '$/utils';

async function action() {
    console.log("Login action called!");
    await sleep(2000);
    console.log("Login action finished!");
}

const meta: Meta<typeof Login> = {
    component: Login,
    args: {
        action,
    }
};

export default meta;
type Story = StoryObj<typeof Login>;

export const Empty: Story = {
    play: async ({ canvas }) => {
        const collection = canvas.getAllByText(/Login/i);
        await userEvent.click(collection[1]);

        expect(canvas.getAllByText(/Field is required/i)).toHaveLength(2);
    }
};

export const WithHeader: Story = {
    play: async ({ canvas }) => {
        const collection = canvas.getAllByText(/Login/i);
        await userEvent.click(collection[1]);

        expect(canvas.getAllByText(/Field is required/i)).toHaveLength(2);
    },
    render: (args: any) => ({
        components: { Login },
        setup() {
            return { args };
        },
        template: `<Login v-bind="args">
        <template #header>
        <img src="assets/spacialist_logo.png" alt="Logo" style="display:block; width:50%; margin: auto;" />
        </template>
    </Login>`,
    }),
};

export const Filled: Story = {
    play: async ({ canvas }) => {
        const emailInput = canvas.getByLabelText(/Email or Nickname/i);
        await userEvent.type(emailInput, 'John Doe');

        const passwordInput = canvas.getByLabelText(/Password/i);
        await userEvent.type(passwordInput, 'always_use_strong_passwords');

        const collection = canvas.getAllByText(/Login/i);
        await userEvent.click(collection[1]);
    }
};

export const FilledWithRememberMe: Story = {
    args: {
        showRememberMe: true
    },
    play: async ({ canvas }) => {
        const emailInput = canvas.getByLabelText(/Email or Nickname/i);
        await userEvent.type(emailInput, 'John Doe');

        const passwordInput = canvas.getByLabelText(/Password/i);
        await userEvent.type(passwordInput, 'always_use_strong_passwords');

        await userEvent.click(canvas.getByText(/Remember me/i));

        const collection = canvas.getAllByText(/Login/i);
        await userEvent.click(collection[1]);
    }
};

export const Error: Story = {
    args: {
        action: () => { throw "Could not login!" }
    },
};


