import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequireProfile } from './RequireProfile';

jest.mock('../hooks/useProfile', () => ({
  useProfile: () => ({ displayName: 'John', loading: false }),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: '123' }, loading: false }),
}));

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { display_name: 'John' }, error: null }),
  },
}));

describe('RequireProfile', () => {
  it('рендерит детей, если имя есть', async () => {
    render(
      <MemoryRouter>
        <RequireProfile>
          <div>Protected content</div>
        </RequireProfile>
      </MemoryRouter>
    );
    // Дожидаемся окончания загрузки
    expect(await screen.findByText('Protected content')).toBeInTheDocument();
  });

  it('не рендерит детей, если имя отсутствует', () => {
    jest.spyOn(require('../hooks/useProfile'), 'useProfile').mockReturnValue({ displayName: null, loading: false });
    render(
      <MemoryRouter>
        <RequireProfile>
          <div>Protected content</div>
        </RequireProfile>
      </MemoryRouter>
    );
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});