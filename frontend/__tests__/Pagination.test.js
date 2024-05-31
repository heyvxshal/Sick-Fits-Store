import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination/>', () => {
  it('Displays a loading message', () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination />
      </MockedProvider>
    );
    expect(container).toHaveTextContent('Loading...');
  });

  it('Renders pagination for 18 times', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');

    const pageCountSpan = screen.getByTestId('pageCount');
    expect(pageCountSpan).toHaveTextContent('5');
    expect(container).toMatchSnapshot();
  });

  it('Disables the prev page btn on first page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(9)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });

  it('Disables the next page btn on last page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(9)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('Enables all on middle page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(9)}>
        <Pagination page={2} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', 'false');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
  });
});
