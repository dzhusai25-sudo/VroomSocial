import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateImpression } from './CreateImpression';

jest.mock('../hooks/useProfile', () => ({ useProfile: () => ({ displayName: 'Test', loading: false }) }));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '123' }, loading: false }) }));

describe('CreateImpression', () => {
  it('рендерит форму', () => {
    render(
      <BrowserRouter>
        <CreateImpression />
      </BrowserRouter>
    );
    expect(screen.getByText(/Поделиться впечатлением/i)).toBeInTheDocument();
  });
});