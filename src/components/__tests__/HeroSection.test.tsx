import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  it('renders the hero section with title and description', () => {
    const onGetStarted = vi.fn();
    const onViewDemo = vi.fn();

    const { getByText } = render(<HeroSection onGetStarted={onGetStarted} onViewDemo={onViewDemo} />);

    expect(getByText(/Create Stunning Flipbooks/i)).toBeInTheDocument();
    expect(getByText(/Transform your PDFs into interactive flipbooks/i)).toBeInTheDocument();
  });

  it('calls onGetStarted when Get Started button is clicked', async () => {
    const onGetStarted = vi.fn();
    const onViewDemo = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(<HeroSection onGetStarted={onGetStarted} onViewDemo={onViewDemo} />);

    const getStartedButton = getByRole('button', { name: /Get Started/i });
    await user.click(getStartedButton);

    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });

  it('calls onViewDemo when View Demo button is clicked', async () => {
    const onGetStarted = vi.fn();
    const onViewDemo = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(<HeroSection onGetStarted={onGetStarted} onViewDemo={onViewDemo} />);

    const viewDemoButton = getByRole('button', { name: /View Demo/i });
    await user.click(viewDemoButton);

    expect(onViewDemo).toHaveBeenCalledTimes(1);
  });
});
