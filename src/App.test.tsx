import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

jest.mock('./components/Navi', () => ({ Navi: () => <div>Navi Mock</div> }));

describe('App', () => {
  it('рендерит заголовок', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Ищем элемент strong, который содержит текст с эмодзи
    const header = screen.getByText((content, element) => {
      return element?.tagName === 'STRONG' && content.includes('Vr') && content.includes('mSocial');
    });
    expect(header).toBeInTheDocument();
  });
});