import { useState, useEffect } from 'react';

type Review = {
  id: number;
  title: string;
  rating: number;
  comment: string;
  imageUrl?: string;
};

// 初期データ
const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    title: '葬送のフリーレン',
    rating: 5,
    comment: '旅の過程と演出が最高でした！',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: '推しの子',
    rating: 4,
    comment: '展開が早くて引き込まれる。',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop'
  }
];

export default function AnimeReviews() {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('anime_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reviews', e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('anime_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newReview = { id: Date.now(), title, rating, comment, imageUrl };
    setReviews([newReview, ...reviews]);
    setTitle('');
    setComment('');
    setImageUrl('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('このレビューを削除しますか？')) {
      setReviews(reviews.filter((rev) => rev.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">
          🎬 アニメ・ドラマレビュー App
        </h1>

        {/* 投稿フォーム */}
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">作品タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 鬼滅の刃"
              className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">画像URL (任意)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">評価 (1〜5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{'★'.repeat(num)} ({num})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">感想・レビュー</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="面白かったポイントなどを入力..."
              className="w-full p-2.5 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-indigo-500 h-24"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded transition"
          >
            レビューを投稿する
          </button>
        </form>

        {/* レビュー一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">みんなのレビュー一覧</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-center py-4">レビューがありません。投稿してみましょう！</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex gap-4">
                {rev.imageUrl && (
                  <img
                    src={rev.imageUrl}
                    alt={rev.title}
                    className="w-24 h-32 object-cover rounded flex-shrink-0 bg-slate-700"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-indigo-300">{rev.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-bold">{'★'.repeat(rev.rating)}</span>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="text-slate-500 hover:text-red-400 text-sm font-semibold transition"
                        title="削除"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{rev.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
