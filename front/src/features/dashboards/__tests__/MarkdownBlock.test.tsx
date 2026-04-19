import { render, screen } from '@testing-library/react';
import MarkdownBlock from '../components/MarkdownBlock';

describe('MarkdownBlock', () => {
  it('renderiza markdown como HTML en modo vista', () => {
    render(
      <MarkdownBlock
        content={'# Título\n\nContenido **en negritas**.'}
        editMode={false}
        onChange={() => {}}
      />,
    );

    const heading = screen.getByRole('heading', { level: 1, name: /título/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(/en negritas/i).tagName).toBe('STRONG');
  });

  it('muestra textarea en modo edición', () => {
    render(
      <MarkdownBlock
        content="hola"
        editMode={true}
        onChange={() => {}}
      />,
    );
    expect(screen.getByDisplayValue('hola')).toBeInTheDocument();
  });
});
