import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../context/StoreContext';
import { supabase } from '../utils/supabase';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Trash2, 
  Image as ImageIcon, 
  Send, 
  Upload, 
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_role?: 'admin' | 'user';
  user_avatar?: string;
  image_url: string;      // Main image or fallback
  image_urls?: string[];  // Multiple images
  caption: string;
  description: string;
  likes: number;
  liked_by_user?: boolean;
  comments: Comment[];
  created_at: string;
  is_nsfw?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    user_id: 'user-admin',
    user_name: 'Drakath (Admin)',
    user_role: 'admin',
    image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&auto=format&fit=crop&q=80'
    ],
    caption: 'Đập hộp bộ sưu tập Altria Pendragon & Figures siêu phẩm Tokyo',
    description: 'Chi tiết từng đường nét áo giáp và thanh kiếm Excalibur phát sáng trong suốt cực kỳ sắc sảo. Hàng order từ Tokyo nguyên seal 100%. Mời anh em chiêm ngưỡng album 4 góc ảnh cực nét!',
    likes: 38,
    liked_by_user: false,
    comments: [
      {
        id: 'c-1',
        user_id: 'user-2',
        user_name: 'Minh Hoàng',
        content: 'Mô hình nét thật sự ad ơi, ảnh chụp góc cận thanh kiếm quá đã!',
        created_at: 'Hôm qua, 18:30'
      },
      {
        id: 'c-2',
        user_id: 'user-admin',
        user_name: 'Drakath (Admin)',
        content: 'Bản này có phụ kiện thay thế kiếm tàng hình Phong Vương Kết Giới nha bạn!',
        created_at: 'Hôm qua, 19:15'
      }
    ],
    created_at: '2 ngày trước',
    is_nsfw: false
  },
  {
    id: 'post-2',
    user_id: 'user-member-1',
    user_name: 'Kaito Otaku',
    user_role: 'user',
    image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80'
    ],
    caption: 'Khoe góc Manga One Piece bản gốc tiếng Nhật sưu tầm hơn 5 năm',
    description: 'Cuối cùng tập 100 bìa vàng đặc biệt cũng về tay qua dịch vụ order bên YellowOrder. Đóng gói thùng xốp cẩn thận, góc sách không một vết cấn, quá ưng ý luôn!',
    likes: 29,
    liked_by_user: true,
    comments: [
      {
        id: 'c-3',
        user_id: 'user-3',
        user_name: 'Quang Trần',
        content: 'Góc kệ sách đỉnh quá bác ơi, nhìn mê mẩn luôn!',
        created_at: '1 ngày trước'
      }
    ],
    created_at: '1 ngày trước',
    is_nsfw: false
  },
  {
    id: 'post-3',
    user_id: 'user-member-2',
    user_name: 'Lan Anh Nguyễn',
    user_role: 'user',
    image_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&auto=format&fit=crop&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&auto=format&fit=crop&q=80'
    ],
    caption: '[18+ NSFW] Mô hình quyến rũ phong cách Anime Ecchi siêu hot',
    description: 'Chiêm ngưỡng figure phiên bản áo tắm quyến rũ tinh xảo từng centimet! #nsfw #18plus',
    likes: 35,
    liked_by_user: false,
    comments: [
      {
        id: 'c-4',
        user_id: 'user-4',
        user_name: 'Thu Thảo',
        content: 'Mô hình đẹp và gợi cảm quá shop ơi!',
        created_at: '5 giờ trước'
      }
    ],
    created_at: '5 giờ trước',
    is_nsfw: true
  },
  {
    id: 'post-4',
    user_id: 'user-member-3',
    user_name: 'Hải Đăng Figure',
    user_role: 'user',
    image_url: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=1200&auto=format&fit=crop&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=1200&auto=format&fit=crop&q=80'
    ],
    caption: 'Góc học tập phong cách Anime & Gaming góc chill của tôi',
    description: 'Vừa hoàn thiện thêm dàn đèn LED và kệ trưng bày figure tỉ lệ 1/6. Cảm giác bước vào phòng sau ngày dài làm việc thật sự thoải mái!',
    likes: 42,
    liked_by_user: false,
    comments: [
      {
        id: 'c-5',
        user_id: 'user-admin',
        user_name: 'Drakath (Admin)',
        content: 'Góc decor ánh sáng phối tone màu ấm rất đẹp mắt bạn ơi!',
        created_at: '3 giờ trước'
      }
    ],
    created_at: '4 giờ trước',
    is_nsfw: false
  }
];

// Helper to resolve list of images from raw post object
const resolveImages = (p: any): string[] => {
  if (Array.isArray(p.image_urls) && p.image_urls.length > 0) {
    return p.image_urls;
  }
  if (typeof p.image_url === 'string' && p.image_url.trim()) {
    const trimmed = p.image_url.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.images)) return parsed.images;
      } catch (e) {}
    }
    return [trimmed];
  }
  return [];
};

// Helper to resolve NSFW flag from database row or JSON metadata
const resolveNsfw = (p: any): boolean => {
  if (p.is_nsfw !== undefined && p.is_nsfw !== null) return Boolean(p.is_nsfw);
  if (typeof p.image_url === 'string' && p.image_url.trim()) {
    const trimmed = p.image_url.trim();
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && parsed.is_nsfw !== undefined) {
          return Boolean(parsed.is_nsfw);
        }
      } catch (e) {}
    }
  }
  if (typeof p.description === 'string' && (p.description.toLowerCase().includes('#nsfw') || p.description.toLowerCase().includes('18+'))) {
    return true;
  }
  if (typeof p.caption === 'string' && (p.caption.toLowerCase().includes('nsfw') || p.caption.toLowerCase().includes('18+'))) {
    return true;
  }
  return false;
};

// Draggable thumbnail strip for full-screen photo theater (zero scrollbar, smooth drag/wheel)
interface ThumbnailsStripProps {
  images: string[];
  activeIndex: number;
  onSelect: (idx: number) => void;
}

const ThumbnailsStrip: React.FC<ThumbnailsStripProps> = ({ images, activeIndex, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    hasMoved.current = false;
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMoved.current = true;
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || e.touches.length === 0) return;
    setIsDragging(true);
    hasMoved.current = false;
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current || e.touches.length === 0) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMoved.current = true;
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    if (e.deltaY !== 0) {
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="no-scrollbar"
      style={{
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: images.length <= 6 ? 'center' : 'flex-start',
        gap: '10px',
        padding: '6px 18px',
        overflowX: 'auto',
        maxWidth: '85%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {images.map((thumb, tIdx) => (
        <div
          key={tIdx}
          onClick={() => {
            if (!hasMoved.current) {
              onSelect(tIdx);
            }
          }}
          style={{
            width: '54px',
            height: '54px',
            flexShrink: 0,
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: activeIndex === tIdx ? '2.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.25)',
            opacity: activeIndex === tIdx ? 1 : 0.55,
            transform: activeIndex === tIdx ? 'scale(1.08)' : 'scale(1)',
            boxShadow: activeIndex === tIdx ? '0 0 14px var(--primary-glow-strong)' : 'none',
            transition: 'transform 0.18s ease, border-color 0.18s ease, opacity 0.18s ease'
          }}
          title={`Xem ảnh ${tIdx + 1}`}
        >
          <img
            src={thumb}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
        </div>
      ))}
    </div>
  );
};

export const CommunityFeed: React.FC = () => {
  const { currentUser, setActiveView, blurNsfw, setBlurNsfw } = useStore();

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('yelloworder_community_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Lỗi parse bài đăng từ localStorage:', e);
      }
    }
    return INITIAL_POSTS;
  });

  // Modal Create Post State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isNsfw, setIsNsfw] = useState(false);

  // Unblurred post IDs (locally revealed by user clicking "Mở ảnh")
  const [unblurredPostIds, setUnblurredPostIds] = useState<Record<string, boolean>>({});

  // Card slide active index state (mapping postId -> current image index on card)
  const [cardSlideIndices, setCardSlideIndices] = useState<Record<string, number>>({});

  // 3-dots dropdown menu state: which post has active dropdown
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editNewImageUrl, setEditNewImageUrl] = useState('');
  const [editIsNsfw, setEditIsNsfw] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Grid layout mode: 'grid-4' (4 cols), 'grid-3' (3 cols), 'grid-5' (5 cols compact), 'feed' (1 col)
  const [gridMode, setGridMode] = useState<'grid-4' | 'grid-3' | 'grid-5' | 'feed'>(() => {
    const saved = localStorage.getItem('yelloworder_community_grid_mode');
    if (saved === 'grid-3' || saved === 'grid-4' || saved === 'grid-5' || saved === 'feed') return saved;
    return 'grid-4';
  });

  useEffect(() => {
    localStorage.setItem('yelloworder_community_grid_mode', gridMode);
  }, [gridMode]);

  // Facebook-Style Fullscreen Modal State
  const [activeFbModal, setActiveFbModal] = useState<{
    post: Post;
    activeImgIndex: number;
  } | null>(null);

  // Comments state: mapping postId -> comment input text
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [modalCommentInput, setModalCommentInput] = useState('');

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Click outside to close 3-dots menu
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuPostId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Synchronize from Supabase
  useEffect(() => {
    const fetchSupabasePosts = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, comments(*)')
          .order('created_at', { ascending: false });

        if (!postsError && postsData && postsData.length > 0) {
          const mapped: Post[] = postsData.map((p: any) => {
            const images = resolveImages(p);
            return {
              id: p.id,
              user_id: p.user_id,
              user_name: p.user_name,
              user_role: p.user_role || 'user',
              user_avatar: p.user_avatar,
              image_url: images[0] || '',
              image_urls: images,
              caption: p.caption,
              description: p.description || '',
              likes: p.likes || 0,
              liked_by_user: false,
              created_at: new Date(p.created_at).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              is_nsfw: resolveNsfw(p),
              comments: (p.comments || []).map((c: any) => ({
                id: c.id,
                user_id: c.user_id,
                user_name: c.user_name,
                user_avatar: c.user_avatar,
                content: c.content,
                created_at: new Date(c.created_at).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }))
            };
          });
          setPosts(mapped);
        }
      } catch (err) {
        // Silent fallback
      }
    };
    fetchSupabasePosts();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('yelloworder_community_posts', JSON.stringify(posts));
  }, [posts]);

  // Keep modal post in sync with posts state
  useEffect(() => {
    if (activeFbModal) {
      const updated = posts.find(p => p.id === activeFbModal.post.id);
      if (updated) {
        setActiveFbModal(prev => prev ? { ...prev, post: updated } : null);
      }
    }
  }, [posts]);

  // Keyboard navigation for FB-style popup (Esc to close, Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeFbModal) return;
      const images = activeFbModal.post.image_urls || [activeFbModal.post.image_url];
      if (e.key === 'Escape') {
        setActiveFbModal(null);
      } else if (e.key === 'ArrowRight') {
        setActiveFbModal(prev => {
          if (!prev) return null;
          const nextIdx = (prev.activeImgIndex + 1) % images.length;
          return { ...prev, activeImgIndex: nextIdx };
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveFbModal(prev => {
          if (!prev) return null;
          const prevIdx = (prev.activeImgIndex - 1 + images.length) % images.length;
          return { ...prev, activeImgIndex: prevIdx };
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFbModal]);

  // Handle Multi-file Upload for Create Post
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFormError('');

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setFormError('Một số tệp không phải định dạng hình ảnh và đã bị bỏ qua.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Ảnh lớn hơn 10MB đã bị bỏ qua.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Add URL image
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setUploadedImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove uploaded image from create list
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Vui lòng đăng nhập tài khoản để đăng bài viết!');
      setActiveView('login');
      return;
    }

    if (!caption.trim()) {
      setFormError('Vui lòng nhập Caption (tiêu đề bài viết).');
      return;
    }

    if (uploadedImages.length === 0) {
      setFormError('Vui lòng thêm ít nhất 1 hình ảnh cho bài đăng.');
      return;
    }

    setIsUploading(true);
    setFormError('');

    try {
      const newPostId = 'post-' + Date.now();
      const imagesPayload = uploadedImages;

      const newPost: Post = {
        id: newPostId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role,
        image_url: imagesPayload[0],
        image_urls: imagesPayload,
        caption: caption.trim(),
        description: description.trim(),
        likes: 0,
        liked_by_user: false,
        comments: [],
        created_at: 'Vừa xong',
        is_nsfw: isNsfw
      };

      setPosts(prev => [newPost, ...prev]);

      // Attempt Supabase insert with JSON fallback for image_url
      try {
        const { error: insertErr } = await supabase.from('posts').insert({
          id: newPostId,
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_role: currentUser.role,
          image_url: JSON.stringify({ images: imagesPayload, is_nsfw: isNsfw }),
          caption: newPost.caption,
          description: newPost.description,
          likes: 0,
          is_nsfw: isNsfw
        });
        if (insertErr) {
          // If column is_nsfw does not exist yet in Supabase table, insert without it
          await supabase.from('posts').insert({
            id: newPostId,
            user_id: currentUser.id,
            user_name: currentUser.name,
            user_role: currentUser.role,
            image_url: JSON.stringify({ images: imagesPayload, is_nsfw: isNsfw }),
            caption: newPost.caption,
            description: newPost.description,
            likes: 0
          });
        }
      } catch (dbErr) {
        console.warn('Lỗi Supabase khi tạo post:', dbErr);
      }

      // Reset form
      setCaption('');
      setDescription('');
      setUploadedImages([]);
      setIsNsfw(false);
      setShowCreateModal(false);
      setIsUploading(false);
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi đăng bài viết.');
      setIsUploading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (post: Post) => {
    setEditingPost(post);
    setEditCaption(post.caption);
    setEditDescription(post.description || '');
    setEditIsNsfw(Boolean(post.is_nsfw));
    const images = post.image_urls && post.image_urls.length > 0 
      ? [...post.image_urls] 
      : (post.image_url ? [post.image_url] : []);
    setEditImages(images);
    setEditNewImageUrl('');
    setEditError('');
  };

  // Handle Multi-file Upload for Edit Post
  const handleEditFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEditError('');

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setEditError('Một số tệp không phải định dạng hình ảnh và đã bị bỏ qua.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setEditError('Ảnh lớn hơn 10MB đã bị bỏ qua.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Add URL image in edit mode
  const handleAddEditImageUrl = () => {
    if (!editNewImageUrl.trim()) return;
    setEditImages(prev => [...prev, editNewImageUrl.trim()]);
    setEditNewImageUrl('');
  };

  // Remove image in edit mode
  const handleRemoveEditImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  // Save Post Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editCaption.trim()) {
      setEditError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }

    if (editImages.length === 0) {
      setEditError('Bài viết cần có ít nhất 1 hình ảnh.');
      return;
    }

    setIsSavingEdit(true);
    setEditError('');

    try {
      const updatedPost: Post = {
        ...editingPost,
        caption: editCaption.trim(),
        description: editDescription.trim(),
        image_url: editImages[0],
        image_urls: editImages,
        is_nsfw: editIsNsfw
      };

      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));

      if (activeFbModal?.post.id === editingPost.id) {
        setActiveFbModal(prev => prev ? { ...prev, post: updatedPost, activeImgIndex: Math.min(prev.activeImgIndex, editImages.length - 1) } : null);
      }

      // Supabase update
      try {
        const { error: updateErr } = await supabase.from('posts').update({
          caption: updatedPost.caption,
          description: updatedPost.description,
          image_url: JSON.stringify({ images: editImages, is_nsfw: editIsNsfw }),
          is_nsfw: editIsNsfw
        }).eq('id', editingPost.id);
        if (updateErr) {
          await supabase.from('posts').update({
            caption: updatedPost.caption,
            description: updatedPost.description,
            image_url: JSON.stringify({ images: editImages, is_nsfw: editIsNsfw })
          }).eq('id', editingPost.id);
        }
      } catch (e) {}

      setEditingPost(null);
      setIsSavingEdit(false);
    } catch (err: any) {
      setEditError(err.message || 'Lỗi khi lưu chỉnh sửa.');
      setIsSavingEdit(false);
    }
  };

  // Handle Like Post
  const handleToggleLike = async (postId: string) => {
    let nextLikes = 0;
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.liked_by_user;
          nextLikes = isLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
          return {
            ...post,
            liked_by_user: !isLiked,
            likes: nextLikes
          };
        }
        return post;
      })
    );

    try {
      await supabase.from('posts').update({ likes: nextLikes }).eq('id', postId);
    } catch (e) {}
  };

  // Handle Delete Post
  const handleDeletePost = async (postId: string) => {
    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;

    const canDelete = currentUser?.role === 'admin' || currentUser?.id === postToDelete.user_id;
    if (!canDelete) {
      alert('Bạn không có quyền xóa bài đăng này!');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      if (activeFbModal?.post.id === postId) {
        setActiveFbModal(null);
      }
      setPosts(prev => prev.filter(p => p.id !== postId));

      try {
        await supabase.from('posts').delete().eq('id', postId);
      } catch (e) {}
    }
  };

  // Handle Add Comment
  const handleAddComment = async (postId: string, textOverride?: string) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận!');
      setActiveView('login');
      return;
    }

    const commentText = (textOverride !== undefined ? textOverride : commentInputs[postId])?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: 'c-' + Date.now(),
      user_id: currentUser.id,
      user_name: currentUser.name,
      content: commentText,
      created_at: 'Vừa xong'
    };

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    // Clear input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setModalCommentInput('');

    try {
      await supabase.from('comments').insert({
        id: newComment.id,
        post_id: postId,
        user_id: currentUser.id,
        user_name: currentUser.name,
        content: newComment.content
      });
    } catch (e) {}
  };

  // Handle Delete Comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const canDelete = currentUser?.role === 'admin' || currentUser?.id === comment.user_id;
    if (!canDelete) {
      alert('Bạn không có quyền xóa bình luận này!');
      return;
    }

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      })
    );

    try {
      await supabase.from('comments').delete().eq('id', commentId);
    } catch (e) {}
  };

  // Handle Share Post
  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to open Facebook-style popup
  const openFacebookModal = (post: Post, imageIndex: number = 0) => {
    setActiveFbModal({ post, activeImgIndex: imageIndex });
  };

  // Compute CSS grid template columns based on gridMode
  const getGridTemplateColumns = () => {
    switch (gridMode) {
      case 'grid-5':
        return 'repeat(auto-fill, minmax(220px, 1fr))';
      case 'grid-3':
        return 'repeat(auto-fill, minmax(350px, 1fr))';
      case 'feed':
        return '1fr';
      case 'grid-4':
      default:
        return 'repeat(auto-fill, minmax(280px, 1fr))';
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px 24px' }}>
      
      {/* Community Header Banner - Full Width */}
      <div 
        className="card" 
        style={{ 
          padding: '28px 36px', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(202, 138, 4, 0.03) 100%)',
          border: '1.5px solid rgba(234, 179, 8, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> Góc Sưu Tầm & Giao Lưu
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Cộng Đồng <span style={{ color: 'var(--primary)' }}>YellowOrder</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '640px' }}>
            Bảng tin hình ảnh mô hình Figure, sách Manga Nhật Bản. Bấm vào bất kỳ ảnh nào để xem toàn màn hình và thảo luận!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Layout Grid Mode Selector */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--bg-input)', 
            padding: '4px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            gap: '4px'
          }}>
            <button
              onClick={() => setGridMode('grid-4')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: gridMode === 'grid-4' ? 700 : 500,
                backgroundColor: gridMode === 'grid-4' ? 'var(--primary)' : 'transparent',
                color: gridMode === 'grid-4' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Lưới 4 cột vừa"
            >
              <LayoutGrid size={14} /> 4 Cột
            </button>
            <button
              onClick={() => setGridMode('grid-3')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: gridMode === 'grid-3' ? 700 : 500,
                backgroundColor: gridMode === 'grid-3' ? 'var(--primary)' : 'transparent',
                color: gridMode === 'grid-3' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Lưới 3 cột lớn"
            >
              <LayoutGrid size={14} /> 3 Cột
            </button>
            <button
              onClick={() => setGridMode('grid-5')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: gridMode === 'grid-5' ? 700 : 500,
                backgroundColor: gridMode === 'grid-5' ? 'var(--primary)' : 'transparent',
                color: gridMode === 'grid-5' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Lưới 5 cột nhỏ"
            >
              <LayoutGrid size={14} /> 5 Cột
            </button>
            <button
              onClick={() => setGridMode('feed')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: gridMode === 'feed' ? 700 : 500,
                backgroundColor: gridMode === 'feed' ? 'var(--primary)' : 'transparent',
                color: gridMode === 'feed' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Dạng danh sách cuộn"
            >
              <List size={14} /> Danh sách
            </button>

            {/* Quick NSFW Unblur Toggle */}
            <button
              onClick={() => setBlurNsfw(!blurNsfw)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: blurNsfw ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.15)',
                color: blurNsfw ? '#ef4444' : '#22c55e',
                border: `1px solid ${blurNsfw ? 'rgba(239, 68, 68, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
              title={blurNsfw ? 'Đang tự động làm mờ ảnh 18+. Bấm để Unblur (Hiện nét toàn bộ)' : 'Đang mở nét tất cả ảnh 18+. Bấm để tự động làm mờ'}
            >
              {blurNsfw ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{blurNsfw ? 'Mờ 18+: BẬT' : 'Ảnh 18+: UNBLUR'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (!currentUser) {
                alert('Vui lòng đăng nhập để đăng bài viết!');
                setActiveView('login');
                return;
              }
              setShowCreateModal(true);
            }}
            className="btn btn-primary"
            style={{
              height: '42px',
              padding: '0 20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px var(--primary-glow-strong)'
            }}
          >
            <PlusCircle size={18} /> Đăng bài viết
          </button>
        </div>
      </div>

      {/* Quick create post box for logged-in user - Full Width */}
      {currentUser && (
        <div 
          className="card" 
          style={{ 
            padding: '16px 24px', 
            marginBottom: '24px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px',
            cursor: 'pointer'
          }}
          onClick={() => setShowCreateModal(true)}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-on-primary)',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0
          }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div 
            style={{ 
              flex: 1, 
              backgroundColor: 'var(--bg-input)', 
              borderRadius: 'var(--radius-full)', 
              padding: '12px 24px',
              color: 'var(--text-muted)',
              fontSize: '0.92rem'
            }}
          >
            {currentUser.name} ơi, hôm nay bạn có album ảnh mô hình hay sách nào mới muốn khoe không? Bấm để đăng bài...
          </div>
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ padding: '8px 18px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ImageIcon size={16} style={{ color: 'var(--primary)' }} /> Đăng ảnh
          </button>
        </div>
      )}

      {/* Main Grid View of Post Cards (Thu nhỏ bài viết thành lưới ảnh) */}
      {gridMode !== 'feed' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: getGridTemplateColumns(),
          gap: '20px'
        }}>
          {posts.map(post => {
            const images = post.image_urls && post.image_urls.length > 0 
              ? post.image_urls 
              : (post.image_url ? [post.image_url] : []);
            
            const currentSlide = cardSlideIndices[post.id] || 0;
            const activeImg = images[currentSlide] || images[0] || '';
            const canManage = currentUser?.role === 'admin' || currentUser?.id === post.user_id;
            const isPostNsfw = Boolean(post.is_nsfw);
            const isBlurred = isPostNsfw && blurNsfw && !unblurredPostIds[post.id];

            return (
              <div 
                key={post.id}
                className="card"
                onClick={() => openFacebookModal(post, currentSlide)}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Photo Thumbnail Wrapper with Slide Controls */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: gridMode === 'grid-5' ? '180px' : gridMode === 'grid-4' ? '230px' : '280px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={activeImg} 
                    alt={post.caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease, filter 0.3s ease',
                      filter: isBlurred ? 'blur(26px)' : 'none',
                      transform: isBlurred ? 'scale(1.18)' : 'scale(1)'
                    }}
                    loading="lazy"
                  />

                  {/* NSFW 18+ Overlay when blurred */}
                  {isBlurred && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnblurredPostIds(prev => ({ ...prev, [post.id]: true }));
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        zIndex: 5,
                        cursor: 'pointer',
                        padding: '10px',
                        textAlign: 'center'
                      }}
                      title="Bấm để mở ảnh nhạy cảm 18+"
                    >
                      <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.25)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        color: '#ef4444',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <AlertTriangle size={12} /> 18+ NSFW
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                        Ảnh nhạy cảm đã mờ
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUnblurredPostIds(prev => ({ ...prev, [post.id]: true }));
                        }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.18)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Eye size={12} /> Mở ảnh
                      </button>
                    </div>
                  )}

                  {/* Small NSFW Badge when unblurred */}
                  {!isBlurred && isPostNsfw && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      zIndex: 3,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                    }}>
                      18+
                    </div>
                  )}

                  {/* Multi-photo badge with current counter */}
                  {images.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backdropFilter: 'blur(4px)',
                      zIndex: 3
                    }}>
                      <Layers size={12} /> {currentSlide + 1}/{images.length}
                    </div>
                  )}

                  {/* On-Card Slide Navigation Arrows if post has multiple images */}
                  {images.length > 1 && (
                    <>
                      {/* Prev Arrow */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const prevIdx = (currentSlide - 1 + images.length) % images.length;
                          setCardSlideIndices(prev => ({ ...prev, [post.id]: prevIdx }));
                        }}
                        style={{
                          position: 'absolute',
                          left: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          backdropFilter: 'blur(3px)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                        }}
                        title="Ảnh trước"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Next Arrow */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const nextIdx = (currentSlide + 1) % images.length;
                          setCardSlideIndices(prev => ({ ...prev, [post.id]: nextIdx }));
                        }}
                        style={{
                          position: 'absolute',
                          right: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          backdropFilter: 'blur(3px)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                        }}
                        title="Ảnh kế tiếp"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Dot indicators at bottom of photo */}
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 3
                      }}>
                        {images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            style={{
                              width: dotIdx === currentSlide ? '12px' : '5px',
                              height: '5px',
                              borderRadius: '3px',
                              backgroundColor: dotIdx === currentSlide ? 'var(--primary)' : 'rgba(255, 255, 255, 0.55)',
                              transition: 'all 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card Info Section */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Author line with 3-dots actions button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: post.user_role === 'admin' ? 'var(--primary)' : 'var(--bg-input)',
                          color: post.user_role === 'admin' ? 'var(--text-on-primary)' : 'var(--text-primary)',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          flexShrink: 0
                        }}>
                          {post.user_name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.user_name}
                        </span>
                      </div>

                      {/* 3-dots Action Menu for Author or Admin */}
                      {canManage && (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                            }}
                            style={{
                              background: 'var(--bg-input)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '26px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                            title="Tùy chọn bài viết"
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {/* Dropdown Options */}
                          {activeMenuPostId === post.id && (
                            <div 
                              onClick={e => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                top: '32px',
                                right: 0,
                                backgroundColor: '#131926',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                borderRadius: '10px',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                                zIndex: 60,
                                minWidth: '190px',
                                padding: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3px',
                                backdropFilter: 'blur(16px)'
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuPostId(null);
                                  handleOpenEditModal(post);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  color: 'var(--text-primary)',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  width: '100%',
                                  justifyContent: 'flex-start',
                                  whiteSpace: 'nowrap',
                                  transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Pencil size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
                                <span>Sửa bài viết & ảnh</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuPostId(null);
                                  handleDeletePost(post.id);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  color: '#ef4444',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  width: '100%',
                                  justifyContent: 'flex-start',
                                  whiteSpace: 'nowrap',
                                  transition: 'background-color 0.15s'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Trash2 size={15} style={{ color: '#ef4444', flexShrink: 0 }} /> 
                                <span>Xóa bài viết</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Caption */}
                    <h3 style={{ 
                      fontSize: '0.98rem', 
                      fontWeight: 800, 
                      lineHeight: 1.4, 
                      margin: '0 0 6px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.caption}
                    </h3>

                    {/* Description Excerpt */}
                    {post.description && (
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Meta */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>{post.created_at}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: post.liked_by_user ? '#ef4444' : 'var(--text-muted)' }}>
                        <Heart size={13} fill={post.liked_by_user ? '#ef4444' : 'none'} /> {post.likes}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={13} /> {post.comments.length}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Full Single Column Feed View (Khi chọn chế độ Danh sách) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '880px', margin: '0 auto' }}>
          {posts.map(post => {
            const images = post.image_urls && post.image_urls.length > 0 
              ? post.image_urls 
              : (post.image_url ? [post.image_url] : []);
            const canManage = currentUser?.role === 'admin' || currentUser?.id === post.user_id;

            return (
              <article 
                key={post.id} 
                className="card" 
                style={{ 
                  padding: '0', 
                  overflow: 'hidden', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Post Header */}
                <div style={{ 
                  padding: '16px 20px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-color)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: post.user_role === 'admin' ? 'var(--primary)' : 'var(--bg-input)',
                      color: post.user_role === 'admin' ? 'var(--text-on-primary)' : 'var(--text-primary)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{post.user_name}</span>
                        {post.user_role === 'admin' && (
                          <span className="badge badge-yellow" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                            <ShieldCheck size={11} style={{ marginRight: '2px' }} /> Quản trị viên
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.created_at}</span>
                    </div>
                  </div>

                  {/* 3-dots Menu */}
                  {canManage && (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                        }}
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer'
                        }}
                        title="Tùy chọn"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {activeMenuPostId === post.id && (
                        <div 
                          onClick={e => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '38px',
                            right: 0,
                            backgroundColor: '#131926',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            borderRadius: '10px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                            zIndex: 60,
                            minWidth: '190px',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                            backdropFilter: 'blur(16px)'
                          }}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuPostId(null);
                              handleOpenEditModal(post);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              width: '100%',
                              justifyContent: 'flex-start',
                              whiteSpace: 'nowrap',
                              transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Pencil size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} /> 
                            <span>Sửa bài viết & ảnh</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuPostId(null);
                              handleDeletePost(post.id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              color: '#ef4444',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              width: '100%',
                              justifyContent: 'flex-start',
                              whiteSpace: 'nowrap',
                              transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={15} style={{ color: '#ef4444', flexShrink: 0 }} /> 
                            <span>Xóa bài viết</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Caption & Description */}
                <div style={{ padding: '18px 20px 14px 20px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {post.caption}
                  </h2>
                  {post.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                      {post.description}
                    </p>
                  )}
                </div>

                {/* Photo Slider / Grid Preview in Danh sách mode */}
                {images.length > 0 && (() => {
                  const currentSlide = cardSlideIndices[post.id] || 0;
                  const activeImg = images[currentSlide] || images[0];
                  const isPostNsfw = Boolean(post.is_nsfw);
                  const isBlurred = isPostNsfw && blurNsfw && !unblurredPostIds[post.id];

                  return (
                    <div 
                      onClick={() => openFacebookModal(post, currentSlide)}
                      style={{ 
                        position: 'relative', 
                        width: '100%', 
                        cursor: 'pointer', 
                        overflow: 'hidden',
                        backgroundColor: '#0a0d14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '340px',
                        maxHeight: '560px'
                      }}
                    >
                      <img 
                        src={activeImg} 
                        alt={post.caption}
                        style={{ 
                          width: '100%', 
                          maxHeight: '560px', 
                          objectFit: 'contain', 
                          display: 'block',
                          transition: 'opacity 0.2s ease-in-out, filter 0.3s ease',
                          filter: isBlurred ? 'blur(30px)' : 'none',
                          transform: isBlurred ? 'scale(1.15)' : 'none'
                        }}
                      />

                      {/* NSFW 18+ Overlay when blurred */}
                      {isBlurred && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setUnblurredPostIds(prev => ({ ...prev, [post.id]: true }));
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            zIndex: 5,
                            cursor: 'pointer',
                            padding: '20px',
                            textAlign: 'center'
                          }}
                          title="Bấm để mở khoá xem ảnh nhạy cảm 18+"
                        >
                          <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.25)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            color: '#ef4444',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <AlertTriangle size={14} /> 18+ NSFW
                          </div>
                          <span style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 700 }}>
                            Nội dung hình ảnh nhạy cảm đã được làm mờ
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUnblurredPostIds(prev => ({ ...prev, [post.id]: true }));
                            }}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.18)',
                              border: '1px solid rgba(255, 255, 255, 0.35)',
                              color: '#ffffff',
                              padding: '6px 16px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            <Eye size={14} /> Bấm để mở ảnh
                          </button>
                        </div>
                      )}

                      {/* Small NSFW Badge when unblurred */}
                      {!isBlurred && isPostNsfw && (
                        <div style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          padding: '3px 9px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          zIndex: 3,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}>
                          18+ NSFW
                        </div>
                      )}

                      {/* Multi-photo badge counter */}
                      {images.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backdropFilter: 'blur(6px)',
                          zIndex: 3,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                        }}>
                          <Layers size={14} /> {currentSlide + 1}/{images.length} (Bấm để xem)
                        </div>
                      )}

                      {/* On-Card Slide Navigation Arrows if post has multiple images */}
                      {images.length > 1 && (
                        <>
                          {/* Previous Button */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              const prevIdx = (currentSlide - 1 + images.length) % images.length;
                              setCardSlideIndices(prev => ({ ...prev, [post.id]: prevIdx }));
                            }}
                            style={{
                              position: 'absolute',
                              left: '14px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.65)',
                              color: '#ffffff',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 4,
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                              transition: 'transform 0.15s, background-color 0.15s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)')}
                            title="Ảnh trước"
                          >
                            <ChevronLeft size={24} />
                          </button>

                          {/* Next Button */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              const nextIdx = (currentSlide + 1) % images.length;
                              setCardSlideIndices(prev => ({ ...prev, [post.id]: nextIdx }));
                            }}
                            style={{
                              position: 'absolute',
                              right: '14px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.65)',
                              color: '#ffffff',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 4,
                              backdropFilter: 'blur(4px)',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                              transition: 'transform 0.15s, background-color 0.15s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)')}
                            title="Ảnh kế tiếp"
                          >
                            <ChevronRight size={24} />
                          </button>

                          {/* Dot indicators at bottom of photo */}
                          <div style={{
                            position: 'absolute',
                            bottom: '14px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            zIndex: 3,
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            backdropFilter: 'blur(4px)'
                          }}>
                            {images.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                onClick={e => {
                                  e.stopPropagation();
                                  setCardSlideIndices(prev => ({ ...prev, [post.id]: dotIdx }));
                                }}
                                style={{
                                  width: dotIdx === currentSlide ? '18px' : '6px',
                                  height: '6px',
                                  borderRadius: '3px',
                                  backgroundColor: dotIdx === currentSlide ? 'var(--primary)' : 'rgba(255, 255, 255, 0.55)',
                                  transition: 'all 0.25s',
                                  cursor: 'pointer'
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* Action Bar */}
                <div style={{ 
                  padding: '12px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.88rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: post.liked_by_user ? '#ef4444' : 'var(--text-secondary)',
                        fontWeight: 700,
                        padding: '4px 8px'
                      }}
                    >
                      <Heart size={18} fill={post.liked_by_user ? '#ef4444' : 'none'} />
                      <span>{post.likes} Yêu thích</span>
                    </button>

                    <button
                      onClick={() => openFacebookModal(post, cardSlideIndices[post.id] || 0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      <MessageSquare size={18} />
                      <span>{post.comments.length} Bình luận</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleShare(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      color: copiedId === post.id ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      padding: '4px 8px'
                    }}
                  >
                    {copiedId === post.id ? <Check size={16} /> : <Share2 size={16} />}
                    <span>{copiedId === post.id ? 'Đã sao chép' : 'Chia sẻ'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODAL ĐĂNG BÀI VIẾT TOÀN MÀN HÌNH Ở CHÍNH GIỮA (VIA REACT PORTAL)     */}
      {/* ========================================================================= */}
      {showCreateModal && createPortal(
        <div 
          onClick={() => setShowCreateModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="card" 
            style={{ 
              width: '100%', 
              maxWidth: '640px', 
              maxHeight: '88vh', 
              overflowY: 'auto',
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Tạo bài viết mới</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chia sẻ album ảnh mô hình & manga với cộng đồng</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ 
                  background: 'var(--bg-input)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '34px', 
                  height: '34px', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.88rem'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* User identity */}
              {currentUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-on-primary)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>{currentUser.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đăng công khai trong Cộng Đồng</span>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tiêu đề / Caption <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Đập hộp em figure Saber cực nét vừa về tay..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mô tả chi tiết (Description)
                </label>
                <textarea
                  placeholder="Chia sẻ trải nghiệm unboxing, độ hoàn thiện, hãng sản xuất hoặc phụ kiện đi kèm..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Multiple Images Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
                    Album hình ảnh ({uploadedImages.length} ảnh đã chọn) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => multiFileInputRef.current?.click()}
                    className="btn btn-outline"
                    style={{ padding: '4px 12px', fontSize: '0.78rem', height: '30px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Thêm ảnh từ máy
                  </button>
                </div>

                {/* Uploaded images thumbnail grid */}
                {uploadedImages.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                    gap: '10px', 
                    padding: '12px', 
                    backgroundColor: 'var(--bg-input)', 
                    borderRadius: 'var(--radius-md)', 
                    marginBottom: '10px',
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}>
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', height: '90px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedImage(idx)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Xóa ảnh này"
                        >
                          <X size={13} />
                        </button>
                        <span style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          color: '#ffffff',
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '4px'
                        }}>
                          #{idx + 1}
                        </span>
                      </div>
                    ))}

                    <div 
                      onClick={() => multiFileInputRef.current?.click()}
                      style={{
                        height: '90px',
                        border: '2px dashed var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Plus size={18} /> Thêm ảnh
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => multiFileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '24px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-input)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '10px'
                    }}
                  >
                    <Upload size={32} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Tải một hoặc nhiều ảnh từ máy tính</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hỗ trợ chọn nhiều ảnh cùng lúc (JPG, PNG, WEBP, GIF)</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={multiFileInputRef} 
                  onChange={handleFilesSelected} 
                  accept="image/*" 
                  multiple 
                  style={{ display: 'none' }} 
                />

                {/* Add by URL */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="Hoặc dán URL ảnh: https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.85rem', height: '38px', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim()}
                    className="btn btn-outline"
                    style={{ height: '38px', padding: '0 14px', fontSize: '0.82rem' }}
                  >
                    Thêm URL
                  </button>
                </div>
              </div>

              {/* NSFW (18+) Toggle Option */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 14px', 
                borderRadius: 'var(--radius-md)', 
                border: isNsfw ? '1.5px solid #ef4444' : '1px solid var(--border-color)', 
                backgroundColor: isNsfw ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-input)', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="checkbox" 
                  checked={isNsfw} 
                  onChange={e => setIsNsfw(e.target.checked)} 
                  style={{ accentColor: '#ef4444', width: '18px', height: '18px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isNsfw ? '#ef4444' : 'var(--text-primary)' }}>
                      Đánh dấu ảnh NSFW (18+ / Nội dung nhạy cảm)
                    </span>
                    <span style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                      18+
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Hình ảnh sẽ được tự động làm mờ (blur) để bảo đảm sự riêng tư cho người xem.
                  </span>
                </div>
              </label>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                  disabled={isUploading}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUploading}
                  style={{ minWidth: '130px' }}
                >
                  {isUploading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> Đang đăng...
                    </span>
                  ) : (
                    'Đăng bài viết'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL CHỈNH SỬA BÀI VIẾT & ẢNH (VIA REACT PORTAL)                     */}
      {/* ========================================================================= */}
      {editingPost && createPortal(
        <div 
          onClick={() => setEditingPost(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="card" 
            style={{ 
              width: '100%', 
              maxWidth: '640px', 
              maxHeight: '88vh', 
              overflowY: 'auto',
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Chỉnh sửa bài viết & ảnh</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cập nhật tiêu đề, mô tả và danh sách hình ảnh</span>
                </div>
              </div>
              <button 
                onClick={() => setEditingPost(null)}
                style={{ 
                  background: 'var(--bg-input)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '34px', 
                  height: '34px', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                fontSize: '0.88rem'
              }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tiêu đề / Caption <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mô tả chi tiết (Description)
                </label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Manage Images in Edit Mode */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
                    Danh sách hình ảnh ({editImages.length} ảnh) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="btn btn-outline"
                    style={{ padding: '4px 12px', fontSize: '0.78rem', height: '30px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Thêm ảnh từ máy
                  </button>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                  gap: '10px', 
                  padding: '12px', 
                  backgroundColor: 'var(--bg-input)', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '10px',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}>
                  {editImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '90px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Xóa ảnh này"
                      >
                        <X size={13} />
                      </button>
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  <div 
                    onClick={() => editFileInputRef.current?.click()}
                    style={{
                      height: '90px',
                      border: '2px dashed var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Plus size={18} /> Thêm ảnh
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={editFileInputRef} 
                  onChange={handleEditFilesSelected} 
                  accept="image/*" 
                  multiple 
                  style={{ display: 'none' }} 
                />

                {/* Add by URL */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="Dán thêm link ảnh URL: https://..."
                    value={editNewImageUrl}
                    onChange={e => setEditNewImageUrl(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.85rem', height: '38px', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddEditImageUrl}
                    disabled={!editNewImageUrl.trim()}
                    className="btn btn-outline"
                    style={{ height: '38px', padding: '0 14px', fontSize: '0.82rem' }}
                  >
                    Thêm URL
                  </button>
                </div>
              </div>

              {/* NSFW (18+) Toggle Option */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 14px', 
                borderRadius: 'var(--radius-md)', 
                border: editIsNsfw ? '1.5px solid #ef4444' : '1px solid var(--border-color)', 
                backgroundColor: editIsNsfw ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-input)', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="checkbox" 
                  checked={editIsNsfw} 
                  onChange={e => setEditIsNsfw(e.target.checked)} 
                  style={{ accentColor: '#ef4444', width: '18px', height: '18px', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: editIsNsfw ? '#ef4444' : 'var(--text-primary)' }}>
                      Đánh dấu ảnh NSFW (18+ / Nội dung nhạy cảm)
                    </span>
                    <span style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                      18+
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Hình ảnh sẽ được tự động làm mờ (blur) để bảo đảm sự riêng tư cho người xem.
                  </span>
                </div>
              </label>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="btn btn-outline"
                  disabled={isSavingEdit}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSavingEdit}
                  style={{ minWidth: '130px' }}
                >
                  {isSavingEdit ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span> Đang lưu...
                    </span>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 3. FACEBOOK-STYLE FULLSCREEN POPUP (ẢNH TRÁI, BÌNH LUẬN PHẢI)            */}
      {/* ========================================================================= */}
      {activeFbModal && createPortal(
        <div 
          onClick={() => setActiveFbModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 999999,
            display: 'flex',
            overflow: 'hidden'
          }}
        >
          {/* Main Modal Container: Left Photo + Right Comments */}
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative'
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setActiveFbModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
              title="Đóng popup (Esc)"
            >
              <X size={22} />
            </button>

            {/* LEFT COLUMN: Photo Theater */}
            <div style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#05070a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '20px'
            }}>
              {/* Photo Display */}
              {(() => {
                const images = activeFbModal.post.image_urls || [activeFbModal.post.image_url];
                const activeImg = images[activeFbModal.activeImgIndex] || images[0];
                const isPostNsfw = Boolean(activeFbModal.post.is_nsfw);
                const isModalBlurred = isPostNsfw && blurNsfw && !unblurredPostIds[activeFbModal.post.id];

                return (
                  <>
                    <div style={{
                      width: '100%',
                      height: 'calc(100% - 90px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={activeImg} 
                        alt="" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: 'var(--radius-sm)',
                          userSelect: 'none',
                          filter: isModalBlurred ? 'blur(36px)' : 'none',
                          transform: isModalBlurred ? 'scale(1.15)' : 'none',
                          transition: 'filter 0.3s ease, transform 0.3s ease'
                        }}
                      />

                      {/* NSFW 18+ Overlay in Modal */}
                      {isModalBlurred && (
                        <div 
                          onClick={() => setUnblurredPostIds(prev => ({ ...prev, [activeFbModal.post.id]: true }))}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.72)',
                            backdropFilter: 'blur(12px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '14px',
                            zIndex: 6,
                            cursor: 'pointer',
                            padding: '24px',
                            textAlign: 'center'
                          }}
                          title="Bấm để mở xem ảnh rõ nét"
                        >
                          <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.25)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            color: '#ef4444',
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <AlertTriangle size={16} /> 18+ NSFW (Nội dung nhạy cảm)
                          </div>
                          <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>
                            Hình ảnh này đã được làm mờ để bảo đảm sự riêng tư
                          </span>
                          <button
                            onClick={() => setUnblurredPostIds(prev => ({ ...prev, [activeFbModal.post.id]: true }))}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.18)',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              color: '#ffffff',
                              padding: '8px 22px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              backdropFilter: 'blur(4px)',
                              marginTop: '4px'
                            }}
                          >
                            <Eye size={16} /> Bấm để xem ảnh rõ nét
                          </button>
                        </div>
                      )}

                      {/* Previous button */}
                      {images.length > 1 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const prevIdx = (activeFbModal.activeImgIndex - 1 + images.length) % images.length;
                            setActiveFbModal({ ...activeFbModal, activeImgIndex: prevIdx });
                          }}
                          style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          title="Ảnh trước (Mũi tên trái)"
                        >
                          <ChevronLeft size={28} />
                        </button>
                      )}

                      {/* Next button */}
                      {images.length > 1 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const nextIdx = (activeFbModal.activeImgIndex + 1) % images.length;
                            setActiveFbModal({ ...activeFbModal, activeImgIndex: nextIdx });
                          }}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          title="Ảnh tiếp theo (Mũi tên phải)"
                        >
                          <ChevronRight size={28} />
                        </button>
                      )}
                    </div>

                    {/* Bottom Thumbnails Strip with Drag & Zero Scrollbars */}
                    {images.length > 1 && (
                      <ThumbnailsStrip
                        images={images}
                        activeIndex={activeFbModal.activeImgIndex}
                        onSelect={(idx) => setActiveFbModal({ ...activeFbModal, activeImgIndex: idx })}
                      />
                    )}
                  </>
                );
              })()}
            </div>

            {/* RIGHT COLUMN: Facebook-Style Post & Comments Sidebar */}
            <div style={{
              width: '440px',
              height: '100%',
              backgroundColor: 'var(--bg-card)',
              borderLeft: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 25px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              {/* Sidebar Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: activeFbModal.post.user_role === 'admin' ? 'var(--primary)' : 'var(--bg-input)',
                    color: activeFbModal.post.user_role === 'admin' ? 'var(--text-on-primary)' : 'var(--text-primary)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.05rem',
                    boxShadow: activeFbModal.post.user_role === 'admin' ? '0 0 10px var(--primary-glow-strong)' : 'none'
                  }}>
                    {activeFbModal.post.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{activeFbModal.post.user_name}</span>
                      {activeFbModal.post.user_role === 'admin' && (
                        <span className="badge badge-yellow" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          <ShieldCheck size={11} style={{ marginRight: '2px' }} /> Admin
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeFbModal.post.created_at}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Edit/Delete options in modal if author or admin */}
                  {(currentUser?.role === 'admin' || currentUser?.id === activeFbModal.post.user_id) && (
                    <button
                      onClick={() => handleOpenEditModal(activeFbModal.post)}
                      style={{
                        background: 'var(--bg-input)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                      title="Chỉnh sửa bài viết"
                    >
                      <Pencil size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveFbModal(null)}
                    style={{
                      background: 'var(--bg-input)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                    title="Đóng"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Sidebar Scrollable Body: Caption, Description, Comments */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {/* Post text */}
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {activeFbModal.post.caption}
                </h2>
                {activeFbModal.post.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '0 0 16px 0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {activeFbModal.post.description}
                  </p>
                )}

                {/* Interactions Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderTop: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={() => handleToggleLike(activeFbModal.post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      color: activeFbModal.post.liked_by_user ? '#ef4444' : 'var(--text-secondary)',
                      fontWeight: 700,
                      padding: '4px 8px'
                    }}
                  >
                    <Heart 
                      size={18} 
                      fill={activeFbModal.post.liked_by_user ? '#ef4444' : 'none'} 
                      style={{ color: activeFbModal.post.liked_by_user ? '#ef4444' : 'var(--text-secondary)' }} 
                    />
                    <span>{activeFbModal.post.likes} Thích</span>
                  </button>

                  <button
                    onClick={() => handleShare(activeFbModal.post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      color: copiedId === activeFbModal.post.id ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      padding: '4px 8px'
                    }}
                  >
                    {copiedId === activeFbModal.post.id ? <Check size={16} /> : <Share2 size={16} />}
                    <span>{copiedId === activeFbModal.post.id ? 'Đã sao chép' : 'Chia sẻ'}</span>
                  </button>
                </div>

                {/* Comments Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    Bình luận ({activeFbModal.post.comments.length})
                  </span>
                </div>

                {/* Comments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeFbModal.post.comments.length > 0 ? (
                    activeFbModal.post.comments.map(c => {
                      const canDelete = currentUser?.role === 'admin' || currentUser?.id === c.user_id;
                      return (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            flexShrink: 0
                          }}>
                            {c.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{
                            flex: 1,
                            backgroundColor: 'var(--bg-input)',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.user_name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.created_at}</span>
                                {canDelete && (
                                  <button
                                    onClick={() => handleDeleteComment(activeFbModal.post.id, c.id)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                    title="Xóa bình luận"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.4 }}>
                              {c.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ!
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Sticky Comment Input */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)'
              }}>
                {currentUser ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--text-on-primary)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Viết bình luận... (Enter để gửi)"
                        value={modalCommentInput}
                        onChange={e => setModalCommentInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(activeFbModal.post.id, modalCommentInput);
                          }
                        }}
                        className="input-field"
                        style={{ height: '40px', paddingRight: '44px', fontSize: '0.88rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(activeFbModal.post.id, modalCommentInput)}
                        disabled={!modalCommentInput.trim()}
                        style={{
                          position: 'absolute',
                          right: '6px',
                          background: 'none',
                          border: 'none',
                          color: modalCommentInput.trim() ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: modalCommentInput.trim() ? 'pointer' : 'default',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Gửi"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Bạn cần <button 
                      onClick={() => {
                        setActiveFbModal(null);
                        setActiveView('login');
                      }} 
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      đăng nhập
                    </button> để bình luận.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
