import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ShopDetailPage from '@/app/shop/[id]/page';
import { getShops } from '@/lib/shops';
import { useRouter } from 'next/navigation';

// getShops関数をモック
jest.mock('@/lib/shops', () => ({
  getShops: jest.fn(),
}));

// useRouterをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockShop = {
  id: 's1',
  name: 'Test Shop',
  address: 'Test Address',
  genre: 'Cafe',
  imageUrl: '/images/test.jpg',
  story: 'Test Story',
};

describe('Shop Detail Page', () => {
  let mockPush: jest.Mock;
  let mockBack: jest.Mock;

  beforeEach(() => {
    (getShops as jest.Mock).mockReset();
    mockPush = jest.fn();
    mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });
  });

  it('renders shop details when shop is found', async () => {
    (getShops as jest.Mock).mockResolvedValue([mockShop]);
    render(<ShopDetailPage params={{ id: 's1' }} />);

    await waitFor(() => {
      expect(screen.getByText('Test Shop')).toBeInTheDocument();
      expect(screen.getByText(/Test Address/i)).toBeInTheDocument();
      expect(screen.getByText(/Cafe/i)).toBeInTheDocument();
      expect(screen.getByText('Test Story')).toBeInTheDocument();
      expect(screen.getByAltText('Test Shop')).toBeInTheDocument();
    });
  });

  it('displays "Shop not found" when shop is not found', async () => {
    (getShops as jest.Mock).mockResolvedValue([]);
    render(<ShopDetailPage params={{ id: 'non-existent' }} />);

    await waitFor(() => {
      expect(screen.getByText('Shop not found.')).toBeInTheDocument();
    });
  });

  it('calls router.back when back button is clicked', async () => {
    (getShops as jest.Mock).mockResolvedValue([mockShop]);
    render(<ShopDetailPage params={{ id: 's1' }} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('handles error when fetching shops data', async () => {
    (getShops as jest.Mock).mockRejectedValue(new Error('Failed to fetch shops'));
    render(<ShopDetailPage params={{ id: 's1' }} />);

    await waitFor(() => {
      expect(screen.getByText('Error loading shop details.')).toBeInTheDocument();
    });
  });
});
