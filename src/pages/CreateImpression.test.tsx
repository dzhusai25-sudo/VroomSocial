import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateImpression } from './CreateImpression';

jest.mock('../hooks/useProfile', () => ({ useProfile: () => ({ displayName: 'Test', loading: false }) }));
jest.mock('../services/carApi', () => ({ getCarBrands: jest.fn().mockResolvedValue([]), getModelsByBrand: jest.fn().mockResolvedValue([]) }));
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }) },
    storage: { from: jest.fn().mockReturnThis(), upload: jest.fn().mockResolvedValue({ error: null }) },
  },
}));

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