import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

jest.mock('../services/impressions', () => ({
  getImpressions: jest.fn().mockResolvedValue({ impressions: [], count: 0 }),
  getUniqueBrands: jest.fn().mockResolvedValue([]),
  getUniqueModels: jest.fn().mockResolvedValue([]),
}));
jest.mock('../services/likes', () => ({
  getLikesCount: jest.fn().mockResolvedValue(0),
  userLiked: jest.fn().mockResolvedValue(false),
  addLike: jest.fn(),
  removeLike: jest.fn(),
}));
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  },
}));

describe('Home', () => {
  it('показывает сообщение при отсутствии впечатлений', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Пока нет впечатлений/i)).toBeInTheDocument());
  });
});