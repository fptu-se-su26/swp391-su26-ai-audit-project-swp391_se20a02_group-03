import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// vite.config.js không bật `globals: true` nên RTL không tự đăng ký afterEach cleanup —
// phải cleanup thủ công để mỗi test render trên DOM sạch (tránh "multiple elements found").
afterEach(() => {
  cleanup();
});
