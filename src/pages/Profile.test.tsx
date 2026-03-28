import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Profile } from './Profile';

jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '123' } }) }));
jest.mock('../hooks/useProfile', () => ({
  useProfile: () => ({ displayName: 'John', updateDisplayName: jest.fn().mockResolvedValue(true) }),
}));

describe('Profile', () => {
  it('отображает форму профиля', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    expect(screen.getByText(/Отображаемое имя/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});