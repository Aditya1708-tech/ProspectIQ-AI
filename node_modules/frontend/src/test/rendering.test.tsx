import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UnreadCounter } from '../components/notifications/UnreadCounter.js';
import { NotificationBadge } from '../components/notifications/NotificationBadge.js';

describe('NotificationIQ Frontend Rendering Tests', () => {
  it('should render UnreadCounter correctly with count', () => {
    render(<UnreadCounter count={5} />);
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-rose-500');
  });

  it('should not render UnreadCounter if count is 0', () => {
    const { container } = render(<UnreadCounter count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render NotificationBadge with correct priority text', () => {
    render(<NotificationBadge priority="CRITICAL" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-rose-400');
  });
});
