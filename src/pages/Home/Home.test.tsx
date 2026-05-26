import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@/test/utils';
import { Home } from './Home';

describe('Home', () => {
  it('renders the hello world heading', () => {
    renderWithRouter(<Home />);
    expect(
      screen.getByRole('heading', { name: /hello, world/i }),
    ).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/ready to extend/i)).toBeInTheDocument();
  });
});
