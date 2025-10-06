# Quick Start Guide - Browser Inspector

## 🚀 Get Started in 3 Steps

### Step 1: Start Your Web App
Run your local development server on port 3000:
```bash
# React
npm start

# Vue
npm run serve

# Angular
ng serve --port 3000

# Or use our test page
cd extension/test-page
python3 -m http.server 3000
```

### Step 2: Open Browser Inspector
In VS Code:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Open Browser Inspector`
3. Press Enter

The Browser Inspector panel opens beside your editor!

### Step 3: Inspect Elements
1. Click **"Inspect Mode: OFF"** to enable it (turns to **"Inspect Mode: ON"**)
2. Hover over elements in the web page to see them highlighted
3. Click any element to:
   - See its CSS selector in the status bar
   - Send it to Claude for AI analysis
   - View details in VS Code Output Console

## 💡 Pro Tips

### Change the URL
- Type a new URL in the input field at the top
- Press Enter or click "Load"
- Works with any http/https URL

### CSS Selectors
The inspector generates smart selectors like:
- `#header` - Elements with IDs
- `button.primary` - Elements with classes
- `div.card:nth-of-type(2)` - Specific positions

### View Detailed Logs
1. Go to View → Output
2. Select "Kuhmpel" from the dropdown
3. See tag names, selectors, and data-component attributes

### Use with Claude
If you have Claude available, selected elements are automatically sent for analysis with the message:
```
Explain this component: [CSS selector]
```

## 🎯 Common Use Cases

### Frontend Development
```bash
# Start your React app
npm start
# Open Browser Inspector
# Click components to analyze structure
```

### Component Analysis
- Click on buttons → See classes and IDs
- Click on forms → Understand input structure
- Click on cards → Analyze layout patterns

### Learning & Debugging
- Explore how websites are built
- Verify CSS class names
- Check element hierarchy
- Get AI explanations

## 🐛 Troubleshooting

### "Cannot access iframe content (CORS restriction)"
- This is normal for external websites
- Use local development servers instead
- The page will still display, just can't inspect

### Panel doesn't open
- Check VS Code Output Console for errors
- Reload VS Code window: `Cmd/Ctrl + R`
- Verify the extension is activated

### Inspect Mode not working
- Likely CORS restriction from external site
- Try with `http://localhost:3000` instead
- Check status bar for messages

## 📖 More Information

- [Full Documentation](BROWSER_INSPECTOR.md)
- [Implementation Details](IMPLEMENTATION_SUMMARY.md)
- [Test Page Demo](../test-page/README.md)

## 🎉 You're Ready!

The Browser Inspector is a powerful tool for understanding web applications. Start inspecting and let Claude help you understand your components!
