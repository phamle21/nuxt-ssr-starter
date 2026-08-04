import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AppErrorPresenter from './AppErrorPresenter.vue';

const meta = {
  title: 'UI/AppErrorPresenter',
  component: AppErrorPresenter,
  args: {
    closeLabel: 'Close',
    message: 'The application could not complete the request.',
    title: 'Something went wrong',
  },
} satisfies Meta<typeof AppErrorPresenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {};

export const Toast: Story = {
  args: {
    mode: 'toast',
    reference: 'Reference: request-123',
  },
};
