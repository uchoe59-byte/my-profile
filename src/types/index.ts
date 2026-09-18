export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string | null;
  isGuest?: boolean;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  authorUid?: string;
  authorEmail?: string;
  category: 'cheer' | 'inquiry' | 'feedback';
  message: string;
  likes: number;
  createdAt: number;
}
