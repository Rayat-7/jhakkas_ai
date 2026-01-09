# Jhakkas AI - Vibe Studio Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
The Google Generative AI SDK has already been installed. If you need to reinstall:
```bash
npm install
```

### 2. Set Up Your API Key

You need a Google AI API key to use Gemini 1.5 Flash:

1. **Get your API key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Create `.env.local` file** in the project root:
   ```bash
   # .env.local
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```
3. **Restart the dev server** after adding the key

### 3. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` and click the **"Try Now"** button to launch Vibe Studio!

## 🎨 Features

### Phase 1: Image Processing ✅
- **Location**: `src/utils/image-helpers.ts`
- Converts images to Base64
- Automatically resizes to max 1024px width
- Supports JPEG, PNG, and WebP formats

### Phase 2: Vibe Studio Interface ✅
- **Location**: `components/VibeStudio.tsx`
- Multi-step form with smooth Framer Motion animations
- **Step 1**: Upload your photo
- **Step 2**: Specify focus point (e.g., "my leather jacket")
- **Step 3**: Choose mood (Deep, Hype, Aesthetic, Desi, Dark)
- **Step 4**: Select language (English or Banglish)
- Glassmorphism design matching Jhakkas aesthetic

### Phase 3: AI Backend ✅
- **Location**: `app/api/generate/route.ts`
- Powered by Gemini 1.5 Flash
- Generates 5 viral-worthy captions
- Recommends 3 trending songs with iconic lyrics
- Supports both English and Romanized Banglish

## 📁 Project Structure

```
jhakkas_ai/
├── src/
│   └── utils/
│       └── image-helpers.ts       # Image processing utilities
├── components/
│   ├── Landing.tsx                # Main landing page (updated)
│   └── VibeStudio.tsx            # Multi-step interview modal
├── app/
│   └── api/
│       └── generate/
│           └── route.ts          # Gemini API integration
└── .env.local                    # Your API key (create this!)
```

## 🔧 Troubleshooting

### "Failed to generate content" Error
- Ensure your `GOOGLE_AI_API_KEY` is set in `.env.local`
- Restart the dev server after adding the key
- Check that your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Image Upload Issues
- Supported formats: JPEG, PNG, WebP
- Images are automatically resized to 1024px width
- Check browser console for detailed error messages

## 🎯 Usage Flow

1. Click **"Try Now"** on the landing page
2. Upload your photo
3. Describe what to highlight (e.g., "the sunset", "my outfit")
4. Choose your vibe (Deep, Hype, Aesthetic, Desi, Dark)
5. Select language (English or Banglish)
6. Get AI-generated captions and song recommendations!
7. Click any caption to copy it to clipboard

## 🌟 Next Steps

- Add user authentication
- Save favorite captions and songs
- Share directly to social media
- Add more mood options
- Support video uploads
