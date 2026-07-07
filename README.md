# Fluens Echo

> A modern form builder powered by AI.

Fluens Echo is a modern web-based form builder that enables users to create, share, and analyze online forms with ease. Inspired by Google Forms, Fluens Echo focuses on providing a clean user experience while introducing AI-powered capabilities to streamline form creation.

One of its flagship features is **PDF to Form Extraction**, allowing users to generate editable forms directly from PDF documents using AI. This feature is currently under development.

---

## ✨ Features

* User authentication
* Drag-and-drop form builder
* Multiple question types
* Share forms via public links
* Collect responses in real time
* Response analytics
* AI-powered PDF to Form Extraction *(Work in Progress)*

---

## 📸 Screenshots

### Dashboard

```
docs/screenshots/dashboard.png
```

![Dashboard](docs/screenshots/dashboard.png)

---

### Form Builder

```
docs/screenshots/form-builder.png
```

![Form Builder](docs/screenshots/form-builder.png)

---

### Form Preview

```
docs/screenshots/form-preview.png
```

![Form Preview](docs/screenshots/form-preview.png)

---

### Analytics

```
docs/screenshots/analytics-summary.png
```

![Analytics Summary](docs/screenshots/analytics-summary.png)

```
docs/screenshots/analytics-questions.png
```

![Analytics Questions](docs/screenshots/analytics-questions.png)

```
docs/screenshots/analytics-individual.png
```

![Analytics Individual](docs/screenshots/analytics-individual.png)

---

### PDF → Form Extraction (Coming Soon)

---

## 🏗️ Tech Stack

| Category       | Technology        |
| -------------- | ----------------- |
| Frontend       | Next.js + React   |
| Backend        | Next.js           |
| Database       | Supabase          |
| Authentication | Supabase Auth     |
| Image Storage  | Cloudinary        |
| AI             | Google Gemini API |
| PDF Parsing    | unpdf             |
| Deployment     | Vercel            |

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/jst-san/Fluens-Echo.git
cd Fluens-Echo
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

SUPABASE_SECRET_KEY=

GOOGLE_AI_API_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

### Start the development server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
Fluens-Echo
├── app/
├── docs/
├── helpers/
├── lib/
├── public/
├── stores/
├── types/
├── utils/
├── package.json
├── proxy.ts
├── README.md
```

---

## 🧠 PDF to Form Extraction

The upcoming AI-powered PDF extraction feature is designed to convert PDF documents into editable online forms.

Planned workflow:

```
PDF Document
      │
      ▼
PDF Parsing (unpdf)
      │
      ▼
Gemini API
      │
      ▼
Structured Questions
      │
      ▼
Editable Form Builder
```

> **Status:** 🚧 In Development

---

## 🛣️ Roadmap

* [x] Authentication
* [x] Form Builder
* [x] Multiple Question Types
* [x] Form Sharing
* [x] Response Collection
* [x] Response Analytics
* [ ] PDF to Form Extraction
* [ ] Improve AI-generated form accuracy

---

## 🤝 Contributing

Contributions are welcome.

If you'd like to contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Commit your changes.
4. Open a Pull Request.

Please ensure your code follows the project's coding conventions and includes appropriate documentation where necessary.

---

## 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.
