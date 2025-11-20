
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'react-hook-form@7.55.0': 'react-hook-form',
        'figma:asset/f952ad38bb672fc5332c4f29f14334e1e5438788.png': path.resolve(__dirname, './src/assets/f952ad38bb672fc5332c4f29f14334e1e5438788.png'),
        'figma:asset/e44c577e58de6ec52819970c06264cb1a24e6f2b.png': path.resolve(__dirname, './src/assets/e44c577e58de6ec52819970c06264cb1a24e6f2b.png'),
        'figma:asset/e3152634bbcab9ac48ab6eaeb9864b9d621a326c.png': path.resolve(__dirname, './src/assets/e3152634bbcab9ac48ab6eaeb9864b9d621a326c.png'),
        'figma:asset/c51b74f80120d70a48b5d130af32fb9957bd21e1.png': path.resolve(__dirname, './src/assets/c51b74f80120d70a48b5d130af32fb9957bd21e1.png'),
        'figma:asset/9b29612580bcebe5618209405aa7bc81d92b9591.png': path.resolve(__dirname, './src/assets/9b29612580bcebe5618209405aa7bc81d92b9591.png'),
        'figma:asset/9a9cb867d4a32911b96ad6ff504b3fb55afbf8d8.png': path.resolve(__dirname, './src/assets/9a9cb867d4a32911b96ad6ff504b3fb55afbf8d8.png'),
        'figma:asset/6eb7078a157ba922a5dd2813dd4b92aae5fa18c8.png': path.resolve(__dirname, './src/assets/6eb7078a157ba922a5dd2813dd4b92aae5fa18c8.png'),
        'figma:asset/36ca095652d037ab765a0de143a4e003a4a1715d.png': path.resolve(__dirname, './src/assets/36ca095652d037ab765a0de143a4e003a4a1715d.png'),
        'figma:asset/2c4026132a5b47b981406c2f9e9883c7f1e4807d.png': path.resolve(__dirname, './src/assets/2c4026132a5b47b981406c2f9e9883c7f1e4807d.png'),
        'figma:asset/0aee55fc34da448d0c8e542ee215b72a8a9a2c5a.png': path.resolve(__dirname, './src/assets/0aee55fc34da448d0c8e542ee215b72a8a9a2c5a.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });