# 🌶️ Dashboard Forecasting Harga Cabai Rawit

Aplikasi web modern untuk forecasting harga cabai rawit Kalimantan Tengah menggunakan LSTM deep learning. Dibangun dengan Next.js 16, Tailwind CSS, dan shadcn/ui dengan desain glassmorphism dan dark mode premium.

## ✨ Fitur Utama

### 1. **Header Responsif**
- Judul dengan emoji cabai rawit yang menarik
- Subtitle menjelaskan lokasi dan metode (Kalimantan Tengah, LSTM)
- Design profesional dengan glassmorphism dan backdrop blur

### 2. **Statistik Dashboard**
- **Jumlah Data**: Menampilkan total data historis
- **Harga Maksimum**: Nilai tertinggi dengan warna hijau (emerald)
- **Harga Minimum**: Nilai terendah dengan warna merah
- Hover effects untuk interaktivitas

### 3. **Grafik Harga Historis**
- Visualisasi interaktif menggunakan Recharts
- Garis trend dengan warna merah cabai
- Grid dan tooltip untuk kemudahan pembacaan
- Responsive design untuk semua ukuran layar

### 4. **Evaluasi Model**
- MAE (Mean Absolute Error)
- RMSE (Root Mean Square Error)
- MAPE (Mean Absolute Percentage Error)
- Cards glassmorphic dengan styling premium

### 5. **Kontroler Forecast**
- **Slider Interaktif**: Pilih 1-30 hari prediksi
- **Tombol Forecast**: Trigger forecasting dengan animasi loading
- **Status Indikator**: Pesan sukses dengan styling emerald
- Sticky positioning untuk akses mudah saat scroll

### 6. **Hasil Forecast**
- **Prediksi Harga Besok**: Card highlighted dengan warna emerald
- **Grafik Forecast**: Kombinasi data historis dan prediksi
- **Tabel Forecast**: Detail prediksi per hari dengan status
- **Download CSV**: Export hasil prediksi untuk analisis lebih lanjut

### 7. **Footer**
- Informasi tentang teknologi yang digunakan
- Professional branding

## 🎨 Design System

### Warna
- **Background Gelap**: `oklch(0.1 0 0)` - Latar belakang premium
- **Chili Red**: `oklch(0.65 0.16 30)` - Aksen merah utama
- **Chili Green**: `oklch(0.45 0.08 140)` - Aksen hijau tambahan
- **Foreground**: `oklch(0.95 0 0)` - Teks terang

### Styling Utama
- **Glassmorphism**: Background dengan `bg-white/5` dan `backdrop-blur-md`
- **Borders**: `border-white/10` untuk subtlety
- **Hover Effects**: `hover:bg-white/10` untuk interaktivitas
- **Rounded Corners**: `rounded-lg` dan `rounded-xl` untuk modern look

### Typography
- **Headings**: Font bold dengan text-balance untuk readability
- **Body**: Font sans dengan tracking yang tepat
- **Emojis**: Digunakan sebagai visual icons di section headers

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS dengan custom theme
- **UI Components**: shadcn/ui
- **Charting**: Recharts untuk visualisasi data
- **Language**: TypeScript
- **Icons**: Lucide React

## 📁 Struktur File

```
app/
├── layout.tsx              # Root layout dengan metadata
├── globals.css             # Theme colors dan styling global
└── page.tsx               # Dashboard utama (Client component)

components/
└── ui/                    # shadcn/ui components pre-installed
    ├── button.tsx
    ├── card.tsx
    ├── slider.tsx
    ├── tabs.tsx
    ├── chart.tsx
    └── ... (komponen lainnya)
```

## 🚀 Fitur Responsif

- **Desktop**: Full layout dengan 3 kolom (2 col content + 1 col sidebar)
- **Tablet**: Grid auto-adjust untuk space optimal
- **Mobile**: Single column stackable dengan sticky control panel

## 🔄 State Management

- **useState Hook**: Untuk state local
  - `days`: Jumlah hari prediksi (1-30)
  - `isLoading`: Status loading forecast
  - `showForecast`: Visibility forecast results

- **Smooth Animations**:
  - Loading spinner saat forecast
  - Fade-in animation untuk hasil (animate-in)
  - Transition effects pada hover

## 📊 Data Integration

Dashboard saat ini menggunakan **mock data** untuk demonstrasi. Untuk menghubungkan ke backend FastAPI:

### Contoh API Integration:
```typescript
// Contoh di page.tsx
const response = await fetch('/api/forecast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ days })
});
const results = await response.json();
setForecastData(results);
```

### Backend Endpoints yang Diperlukan:
1. `GET /api/data` - Ambil data historis
2. `GET /api/metrics` - Ambil metrik model (MAE, RMSE, MAPE)
3. `POST /api/forecast` - Jalankan forecast dengan parameter hari

## ♿ Accessibility

- **Semantic HTML**: Menggunakan main, header, section, footer
- **ARIA Labels**: Labels untuk form controls
- **Keyboard Navigation**: Slider dan buttons fully keyboard accessible
- **Color Contrast**: Text colors memenuhi WCAG standards
- **Screen Readers**: Alt text dan descriptions untuk visual elements

## 🎯 Cara Menggunakan

1. **Clone Repository**
```bash
git clone <repo-url>
cd project
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Run Development Server**
```bash
pnpm dev
```

4. **Open Browser**
Navigasi ke `http://localhost:3000`

5. **Interact dengan Dashboard**
- Adjust slider untuk jumlah hari prediksi
- Click tombol "🚀 Jalankan Forecast"
- Tunggu 2 detik untuk simulasi API call
- Lihat hasil di bawah dengan grafik dan tabel
- Download CSV jika diperlukan

## 🔗 Koneksi Backend

Untuk menghubungkan ke FastAPI backend, update endpoint di `page.tsx`:

```typescript
const handleForecast = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('http://your-backend:8000/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days })
    });
    const data = await response.json();
    setForecastData(data);
    setShowForecast(true);
  } catch (error) {
    console.error('Forecast error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## 📱 Deployment

### Ke Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Ke Platform Lain
Dashboard ini fully compatible dengan:
- Netlify
- AWS Amplify
- GitHub Pages (static export)
- Docker containers

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

## 📝 Notes

- Mock data berisi 10 data point historis (dari Jan-May 2024)
- Forecast berjalan dengan simulasi 2 detik untuk testing
- Semua component sudah dioptimalkan untuk performance
- Design responsif ditest di berbagai breakpoints

## 🚀 Next Steps

1. Hubungkan ke backend FastAPI
2. Implementasi real-time data updates
3. Tambah fitur export ke multiple format
4. Implementasi user authentication
5. Tambah analisis trend dan insights

---

**Built with ❤️ using v0 for Indonesian Agriculture**
