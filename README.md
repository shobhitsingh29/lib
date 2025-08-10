# Leben in Deutschland - German Citizenship Test App

A Next.js application that teaches the official "Leben in Deutschland" test with Tinder-like swiping mechanics and Duolingo-style learning features.

## Features

- **Interactive Learning**: Swipe through 310 official test questions
- **Timed Test Mode**: Take realistic 33-question practice tests
- **Progress Tracking**: Earn XP, maintain streaks, and unlock badges
- **Question Management**: Flag difficult questions for review
- **Dark Mode**: Toggle between light and dark themes
- **Data Export/Import**: Backup and restore your progress
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── practice/          # Practice mode
│   ├── test/              # Test simulation
│   ├── review/            # Question review
│   └── settings/          # User settings
├── components/            # Reusable components
│   ├── SwipeCard.tsx      # Main swipe interface
│   ├── ProgressBar.tsx    # Progress visualization
│   └── Badge.tsx          # Achievement badges
├── lib/                   # Utilities and state
│   ├── store.ts           # Zustand state management
│   └── persistence.ts     # Data import/export
├── public/                # Static assets
│   └── data/              # Question database
│       └── questions.json # 310 test questions
└── scripts/               # Development tools
    └── seed.ts            # Question generation
\`\`\`

## Question Schema

Each question follows this structure:

\`\`\`json
{
  "id": "q001",
  "category": "Politics",
  "question": "What is the capital of Germany?",
  "options": ["Berlin", "Munich", "Frankfurt", "Hamburg"],
  "answerIndex": 0,
  "explanation": "Berlin is the federal capital."
}
\`\`\`

## State Management

The app uses Zustand for state management with localStorage persistence:

- **User Progress**: XP, streaks, badges, completed questions
- **Question State**: Current question, flagged items, categories
- **Test Mode**: Timed sessions, answer tracking, results
- **Settings**: Dark mode, preferences

## Environment Variables

No environment variables required for basic functionality. Optional integrations:

\`\`\`env
# Optional: Database connection for user accounts
DATABASE_URL=postgresql://...

# Optional: Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Development Scripts

\`\`\`bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Generate sample questions
npm run seed

# Lint code
npm run lint
\`\`\`

## Key Components

### SwipeCard
- Drag-based gesture recognition
- Keyboard support (arrow keys, A/D)
- Visual feedback for swipe direction
- Answer validation and explanation display

### Practice Mode
- Category filtering
- Progress tracking
- XP and streak calculation
- Badge unlocking system

### Test Mode
- 33 random questions
- 60-minute timer
- Answer overview grid
- Pass/fail results (17+ correct required)

### Review Mode
- Flagged questions list
- Completed questions history
- Detailed answer explanations
- Progress statistics

## Badges System

Users can earn badges for various achievements:

- **First Correct**: Answer first question correctly
- **5 Streak**: Get 5 questions right in a row
- **10 Streak**: Get 10 questions right in a row
- **100 XP**: Earn 100 experience points
- **500 XP**: Earn 500 experience points
- **Test Master**: Pass a practice test
- **Speed Demon**: Complete 50 questions in one session

## Data Persistence

- **Local Storage**: Guest users (automatic)
- **Export/Import**: JSON backup system
- **Database Ready**: Hooks for PostgreSQL/MongoDB integration

## Testing

The app includes test utilities and can be extended with:

\`\`\`bash
# Add testing framework
npm install --save-dev jest @testing-library/react

# Run tests
npm test
\`\`\`

## Deployment

Deploy to Vercel with one click:

\`\`\`bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Official Test Information

This app is designed to help prepare for the official "Leben in Deutschland" test required for German citizenship. The actual test:

- Contains 33 questions
- Has a 60-minute time limit
- Requires 17+ correct answers to pass
- Covers politics, history, law, culture, and geography

**Note**: This is a practice app. Always verify current requirements with official sources.
