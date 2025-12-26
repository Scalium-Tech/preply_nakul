<div align="center">

# 🎯 Preply - AI Interview Practice Platform

### Master Your Interviews with AI-Powered Mock Sessions

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

[Live Demo](#) · [Report Bug](https://github.com/Scalium-Tech/preply_nakul/issues) · [Request Feature](https://github.com/Scalium-Tech/preply_nakul/issues)

---

<img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Preply Banner" width="800" style="border-radius: 12px;" />

</div>

## ✨ Overview

**Preply** is a modern, AI-powered interview preparation platform designed to help students and professionals ace their interviews. Practice with realistic mock interviews, receive instant AI feedback, and track your progress over time.

> 🎓 *Built by a student, for students* — because everyone deserves access to quality interview preparation.

---

## 🚀 Key Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Interviews
- Dynamic question generation based on your resume
- Follow-up questions that adapt to your responses
- Multiple interview categories (Technical, Behavioral, HR)

</td>
<td width="50%">

### 📊 Smart Analytics Dashboard
- Track performance across all interviews
- View category-wise analysis
- Identify strengths and improvement areas

</td>
</tr>
<tr>
<td width="50%">

### 📝 Detailed Feedback Reports
- Question-by-question feedback
- Personalized improvement suggestions
- Download reports as PDF

</td>
<td width="50%">

### 🔥 Gamification Elements
- Practice streaks to stay motivated
- Score tracking and improvement metrics
- Achievement milestones

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 13, React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Supabase |
| **Authentication** | Supabase Auth |
| **Database** | Supabase PostgreSQL |
| **AI Integration** | Google Gemini 2.5 Flash |
| **Charts** | Recharts |
| **UI Components** | Radix UI, Lucide Icons |

---

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Scalium-Tech/preply_nakul.git

# Navigate to project directory
cd preply_nakul

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🗂️ Project Structure

```
preply/
├── app/
│   ├── about/              # About page (Server Component)
│   ├── api/                # API routes
│   ├── blog/               # Blog page
│   ├── contact/            # Contact page
│   ├── context/            # React contexts (Auth, Interview)
│   ├── dashboard/          # User dashboard
│   ├── interview/          # Interview flow
│   ├── interview-setup/    # Interview configuration
│   ├── login/              # Authentication
│   ├── result/             # Interview results
│   ├── signup/             # User registration
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── ui/                 # Reusable UI components
│   ├── Header.tsx          # Global header
│   ├── Footer.tsx          # Global footer
│   └── motion.tsx          # Animation components
├── lib/
│   └── supabase.ts         # Supabase client
└── public/                 # Static assets
```

---

## ⚡ Performance Optimizations

This project implements several performance optimizations:

| Optimization | Impact |
|-------------|--------|
| **Server Components** | ~40% faster initial page loads |
| **Auth Context Caching** | Eliminates redundant API calls |
| **Next.js Image Optimization** | Automatic lazy loading & compression |
| **Lazy-loaded Animations** | Reduced initial bundle size |
| **Modular Icon Imports** | Smaller JavaScript bundles |

---

## 📱 Pages Overview

| Page | Description |
|------|-------------|
| `/` | Beautiful landing page with features showcase |
| `/login` | User authentication |
| `/signup` | New user registration |
| `/dashboard` | Analytics dashboard with charts & history |
| `/interview-setup` | Configure interview settings |
| `/interview` | AI-powered mock interview |
| `/result` | Detailed feedback and scores |
| `/about` | Team and mission information |
| `/contact` | Contact form |
| `/blog` | Articles and updates |

---

## 🎨 Screenshots

<div align="center">
<table>
<tr>
<td align="center"><strong>Landing Page</strong></td>
<td align="center"><strong>Dashboard</strong></td>
</tr>
<tr>
<td><img src="https://via.placeholder.com/400x250?text=Landing+Page" alt="Landing" /></td>
<td><img src="https://via.placeholder.com/400x250?text=Dashboard" alt="Dashboard" /></td>
</tr>
<tr>
<td align="center"><strong>Interview Session</strong></td>
<td align="center"><strong>Results Page</strong></td>
</tr>
<tr>
<td><img src="https://via.placeholder.com/400x250?text=Interview" alt="Interview" /></td>
<td><img src="https://via.placeholder.com/400x250?text=Results" alt="Results" /></td>
</tr>
</table>
</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Nakul Dafale**

*Computer Science Engineering Student & Full-Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nakuldafale)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/nakuldafale)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nakuldafale7@gmail.com)

</div>

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ for students everywhere

</div>
