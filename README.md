# Task Breaker v2

An ADHD-friendly task breakdown app that transforms overwhelming tasks into clear, actionable steps. Features a dark-themed interface with progress tracking, encouragement, and celebration animations to help you stay motivated and focused.

## Features

### Core Functionality
- **Smart Task Breakdown**: Automatically breaks down large tasks into manageable steps
- **Dual Modes**:
  - **Demo Mode**: Try the app instantly with preset task breakdowns (no API key required)
  - **AI Mode**: Powered by OpenAI (`gpt-4o-mini`) for intelligent, context-aware task decomposition
- **Progress Tracking**: Visual progress bar with real-time percentage updates
- **Completion Celebration**: Satisfying confetti animation when you finish all steps

### ADHD-Optimized Features
- **Dark Theme**: Eye-friendly design to reduce visual fatigue
- **Step Details**:
  - Time estimates for each step
  - Difficulty badges (Easy/Medium/Hard)
  - Quick-win tags to help you start with easy wins
- **Motivational System**: Contextual encouragement at 25%, 50%, 75%, and 90% progress milestones
- **Persistence**: Your tasks and progress are automatically saved in browser localStorage
- **Minimal Friction**: Clean, distraction-free interface with clear visual hierarchy

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- `Escape` key closes modals
- High contrast dark theme
- Clear visual indicators for all interactive elements

## Project Structure

```
task-breaker-v2/
├── index.html      # Landing page with hero, features, demo, pricing, testimonials
├── app.html        # Main app UI with settings modal, task input, results, celebration
├── app.js          # Core app logic (modes, rendering, storage, animations)
└── README.md       # This file
```

## Setup

### Quick Start (Demo Mode)

1. Download or clone the repository
2. Open `app.html` directly in your browser
3. Start breaking down tasks immediately with demo mode

### AI Mode Setup

To use AI-powered task breakdown:

1. Open `app.html` in your browser
2. Click the **Settings** button (gear icon)
3. Enter your OpenAI API key
4. Click **Save**
5. The app will now use AI to generate personalized task breakdowns

**Getting an OpenAI API Key:**
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into Task Breaker settings

### Local Development

No build process required! Simply:

```bash
# Serve with any HTTP server (optional)
python -m http.server 8000
# Or
npx serve
```

Then open `http://localhost:8000/index.html` or `http://localhost:8000/app.html`

## Usage

### Landing Page (`index.html`)
- View app features and benefits
- See demo screenshots
- Read testimonials
- Access pricing information
- Quick link to launch the app

### Main App (`app.html`)

#### Breaking Down a Task

1. **Enter Your Task**: Type or paste an overwhelming task into the input field
2. **Choose Mode**:
   - Click **"Try Demo"** for a preset breakdown
   - Click **"Break It Down"** for AI-powered analysis (requires API key)
3. **Review Steps**: The app displays actionable steps with:
   - Time estimates
   - Difficulty levels
   - Quick-win indicators
4. **Track Progress**: Check off steps as you complete them
5. **Stay Motivated**: Receive encouragement at milestone percentages
6. **Celebrate**: Enjoy confetti when you complete all steps

#### Tips for Best Results

- **Be Specific**: Instead of "Work on project", try "Create presentation for Q1 review meeting"
- **Right Size**: Best for tasks that feel overwhelming but can be done in a day or two
- **Quick Wins First**: Look for steps tagged as quick wins to build momentum
- **Match Energy**: Use difficulty badges to match tasks to your current energy level

### Keyboard Shortcuts

- `Escape` - Close settings modal
- `Enter` - Submit task (when input is focused)
- `Space` - Check/uncheck steps (when focused)

## Data Privacy

- **All data stays local**: Tasks and progress are stored in your browser's localStorage
- **API Key Security**: Your OpenAI API key is stored locally and never sent anywhere except directly to OpenAI
- **No Tracking**: No analytics or user tracking
- **Offline First**: Demo mode works completely offline

## Technical Details

### Demo Mode
- Works without any external dependencies
- Preset task breakdowns for common scenarios
- Perfect for testing or when API access isn't available

### AI Mode
- Uses OpenAI's `gpt-4o-mini` model for cost-effective, fast responses
- Generates context-aware breakdowns based on your specific task
- Includes time estimates, difficulty assessment, and quick-win identification

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses localStorage API for persistence
- Canvas API for confetti animation

## Troubleshooting

**"Break It Down" button doesn't work**
- Ensure you've set your OpenAI API key in Settings
- Check your internet connection
- Verify your API key is valid and has available credits

**Steps don't save**
- Check if localStorage is enabled in your browser
- Some browsers disable localStorage in private/incognito mode

**Confetti doesn't appear**
- Ensure JavaScript is enabled
- Try refreshing the page

## Contributing

Contributions welcome! This project is built for the ADHD community.

Ideas for improvements:
- Additional celebration animations
- More demo task examples
- Export/import task lists
- Pomodoro timer integration
- Mobile app version

## License

MIT License - free to use and modify

## Support

If Task Breaker helps you, please:
- Star the repository
- Share with others who might benefit
- Suggest features or improvements

## Acknowledgments

Built with understanding that traditional task management apps often don't work well for ADHD brains. This app focuses on breaking down overwhelm into action.
