import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppErrorPresenter from './AppErrorPresenter.vue';

describe('AppErrorPresenter', () => {
  const props = {
    closeLabel: 'Close',
    message: 'The request failed.',
    title: 'Something went wrong',
  };

  it('renders an accessible dialog and emits dismiss', async () => {
    const wrapper = mount(AppErrorPresenter, {
      props,
    });

    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe('true');
    expect(wrapper.text()).toContain(props.message);

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
  });

  it('renders toast mode as an alert', () => {
    const wrapper = mount(AppErrorPresenter, {
      props: {
        ...props,
        mode: 'toast',
      },
    });

    expect(wrapper.get('[role="alert"]').text()).toContain(props.title);
  });

  it('dismisses a dialog with the Escape key', async () => {
    const wrapper = mount(AppErrorPresenter, {
      props,
    });

    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
  });
});
