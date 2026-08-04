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
    wrapper.unmount();
  });

  it('renders toast mode as an alert', () => {
    const wrapper = mount(AppErrorPresenter, {
      props: {
        ...props,
        mode: 'toast',
      },
    });

    expect(wrapper.get('[role="alert"]').text()).toContain(props.title);
    wrapper.unmount();
  });

  it('dismisses a dialog with the Escape key', async () => {
    const wrapper = mount(AppErrorPresenter, {
      props,
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    wrapper.unmount();
  });

  it('moves focus into the dialog and restores it after unmount', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const wrapper = mount(AppErrorPresenter, {
      attachTo: document.body,
      props,
    });

    await wrapper.vm.$nextTick();
    expect(document.activeElement).toBe(wrapper.get('button').element);

    wrapper.unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('keeps tab focus inside the dialog', async () => {
    const wrapper = mount(AppErrorPresenter, {
      attachTo: document.body,
      props,
    });
    const closeButton = wrapper.get('button').element;

    await wrapper.vm.$nextTick();
    closeButton.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(closeButton);
    wrapper.unmount();
  });
});
