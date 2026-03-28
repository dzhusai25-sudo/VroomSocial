import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ImpressionDetail } from './ImpressionDetail';

// Мокаем supabase, чтобы он возвращал данные
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: 1,
        car_brand: 'Toyota',
        car_model: 'Camry',
        city: 'Moscow',
        story: 'Test story',
        author_name: 'John',
        created_at: new Date().toISOString(),
      },
      error: null,
    }),
  },
}));

describe('ImpressionDetail', () => {
  it('отображает детали впечатления', async () => {
    render(
      <MemoryRouter initialEntries={['/impression/1']}>
        <Routes>
          <Route path="/impression/:id" element={<ImpressionDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Toyota Camry город Moscow/i)).toBeInTheDocument();
  });
});