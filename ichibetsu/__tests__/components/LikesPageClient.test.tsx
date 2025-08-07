import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LikesPageClient from '@/components/LikesPageClient'; // 変更
import useLikes from '@/hooks/useLikes';
import { Shop } from '@/types/shop';
import { useRouter } from 'next/navigation';

// useLikesフックをモック
jest.mock('@/hooks/useLikes', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// useRouterをモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Cardコンポーネントをモック (CardStackのモックとは別)
jest.mock('@/components/ui/Card', () => ({
  __esModule: true,
  default: ({ children, onClick, shopId }: any) => {
    return (
      <div data-testid={`mock-card-${shopId}`} onClick={onClick}>
        {children}
      </div>
    );
  },
}));

const mockShops: Shop[] = [
  { id: 's1', name: 'Shop 1', address: 'a', genre: 'g', imageUrl: 'i', story: 'st' },
  { id: 's2', name: 'Shop 2', address: 'a', genre: 'g', imageUrl: 'i', story: 'st' },
  { id: 's3', name: 'Shop 3', address: 'a', genre: 'g', imageUrl: 'i', story: 'st' },
];

describe('Likes Page Client', () => { // 変更
  let mockPush: jest.Mock;
  let mockUseLikes: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    mockUseLikes = useLikes as jest.Mock;
    mockUseLikes.mockReturnValue({
      likedShopIds: [],
      addLike: jest.fn(),
      removeLike: jest.fn(),
      isLiked: jest.fn(),
    });
  });

  it('renders "No liked shops yet." message when no shops are liked', async () => {
    mockUseLikes.mockReturnValue({
      likedShopIds: [],
      addLike: jest.fn(),
      removeLike: jest.fn(),
      isLiked: jest.fn(),
    });
    render(<LikesPageClient allShops={mockShops} />); // 変更
    await waitFor(() => {
      expect(screen.getByText('No liked shops yet.')).toBeInTheDocument();
    });
  });

  it('renders liked shops', async () => {
    mockUseLikes.mockReturnValue({
      likedShopIds: ['s1', 's3'],
      addLike: jest.fn(),
      removeLike: jest.fn(),
      isLiked: jest.fn(),
    });
    render(<LikesPageClient allShops={mockShops} />); // 変更
    await waitFor(() => {
      expect(screen.getByText('Shop 1')).toBeInTheDocument();
      expect(screen.queryByText('Shop 2')).not.toBeInTheDocument(); // Shop 2 is not liked
      expect(screen.getByText('Shop 3')).toBeInTheDocument();
    });
  });

  it('navigates to shop detail page on card click', async () => {
    mockUseLikes.mockReturnValue({
      likedShopIds: ['s1'],
      addLike: jest.fn(),
      removeLike: jest.fn(),
      isLiked: jest.fn(),
    });
    render(<LikesPageClient allShops={mockShops} />); // 変更
    await waitFor(() => {
      expect(screen.getByText('Shop 1')).toBeInTheDocument();
    });

    const cardElement = await screen.findByTestId('mock-card-s1');
    fireEvent.click(cardElement);

    expect(mockPush).toHaveBeenCalledWith('/shop/s1');
  });
});
