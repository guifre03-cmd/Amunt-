import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icon.svg'],manifest:{name:'Amunt! Simulador Casteller',short_name:'Amunt!',description:'Funda una colla, assaja i completa temporades castelleres.',theme_color:'#dc2626',background_color:'#fff8e8',display:'standalone',orientation:'portrait',start_url:'/',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any maskable'}]},workbox:{globPatterns:['**/*.{js,css,html,svg,png}']}})]});
