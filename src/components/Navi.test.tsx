import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navi } from './Navi';

jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: null, signOut: jest.fn() }) }));
jest.mock('../hooks/useProfile', () => ({ useProfile: () => ({ displayName: null }) }));

describe('Navi', () => {
  it('рендерит ссылку на главную', () => {
    render(
      <BrowserRouter>
        <Navi />
      </BrowserRouter>
    );
    expect(screen.getByText(/Главная/i)).toBeInTheDocument();
  });
});