# Browser Inspector

The Browser Inspector is a powerful feature of the Kuhmpel VS Code extension that allows you to inspect and interact with web applications running locally or remotely directly within VS Code.

## Features

### 1. Embedded Browser View
- View any web application in an iframe within VS Code
- Default URL: `http://localhost:3000`
- Configurable URL via input field

### 2. Inspect Mode
- Toggle "Inspect Mode" to interact with web page elements
- Hover over elements to see them highlighted with an outline
- Click on elements to capture their information

### 3. Element Information Capture
When you click on an element in Inspect Mode, the following information is captured:
- **Tag Name**: The HTML tag (e.g., `DIV`, `BUTTON`, `SPAN`)
- **CSS Selector**: An intelligently generated CSS selector (e.g., `button.primary`, `div#root > span`)
- **Data Component**: Any `data-component` attribute if present

### 4. AI Integration
- Automatically sends element information to Claude AI (if available)
- Falls back to VS Code Output Console if Claude is unavailable
- Message format: `Explain this component: {selector}`

## How to Use

### Opening the Browser Inspector

1. **Via Command Palette**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Open Browser Inspector"
   - Press Enter

2. The Browser Inspector panel will open beside your current editor

### Changing the URL

1. Enter a URL in the text input field at the top of the panel
2. Press Enter or click the "Load" button
3. The iframe will navigate to the new URL

**Supported URL formats:**
- `http://localhost:3000`
- `http://localhost:8080/app`
- `https://example.com`
- Any valid HTTP/HTTPS URL

### Using Inspect Mode

1. Click the "Inspect Mode: OFF" button to enable inspect mode
2. The button will change to "Inspect Mode: ON" with a different background
3. Hover over elements in the iframe to see them highlighted
4. Click on any element to capture its information and send it to Claude

### Viewing Element Information

Element information is displayed in two places:

1. **Status Bar**: At the bottom of the Browser Inspector panel
2. **VS Code Output Console**: 
   - View → Output → Select "Kuhmpel" from the dropdown
   - Shows detailed element information including tag, selector, and data-component attributes

## Technical Details

### CSS Selector Generation

The Browser Inspector uses an intelligent algorithm to generate CSS selectors:

1. **ID-based**: If an element has an ID, uses `#id` format
2. **Class-based**: Includes class names in the selector (e.g., `button.primary.large`)
3. **Hierarchical**: Builds parent-child relationships (e.g., `div > span > button`)
4. **nth-of-type**: Adds position when needed for uniqueness

Examples:
- `#header` - Element with ID "header"
- `button.primary` - Button with class "primary"
- `div#root > nav.navbar > button.menu:nth-of-type(2)` - Second menu button in navbar

### CORS Considerations

The Browser Inspector injects JavaScript into the iframe to enable element inspection. This works perfectly for:
- Local development servers (`http://localhost:*`)
- Servers with permissive CORS policies

For production sites with strict CORS policies:
- The iframe will still display the page
- Inspect Mode may have limited functionality
- A status message will indicate CORS restrictions

### Message Passing

The extension uses the VS Code webview message passing API:

1. **From Webview to Extension**:
   - `elementSelected`: Sent when an element is clicked in Inspect Mode
   - `urlChange`: Sent when the URL is changed
   - `ready`: Sent when the webview is initialized

2. **From Extension to Webview**:
   - No messages currently sent from extension to webview

## Use Cases

### Frontend Development
- Quickly inspect React, Vue, or Angular components
- Understand component structure and class names
- Ask Claude about component purpose and implementation

### UI/UX Analysis
- Analyze competitor websites
- Study design patterns and implementations
- Get AI-powered explanations of UI components

### Debugging
- Inspect elements causing layout issues
- Check class names and selectors
- Verify component attributes

### Learning
- Explore how websites are built
- Learn about CSS selectors and DOM structure
- Get AI assistance in understanding web technologies

## Troubleshooting

### Panel doesn't open
- Check VS Code Output Console for errors
- Ensure the extension is activated
- Try reloading VS Code window

### Iframe shows blank page
- Verify the URL is correct and accessible
- Check if the server is running
- Look for CORS or security policy errors in the browser console

### Inspect Mode doesn't work
- This is likely due to CORS restrictions
- Try using a local development server instead
- Check the status bar for CORS-related messages

### Claude command fails
- The extension falls back to the Output Console
- Check that Claude extension is installed and configured
- View element information in the Kuhmpel output channel

## Future Enhancements

Potential improvements for future versions:
- Support for custom inspector scripts
- Element editing and style manipulation
- Screenshot and recording capabilities
- Multiple iframe panels
- Persistent URL history
- Bookmarks for frequently inspected sites

## Feedback

If you encounter issues or have suggestions for the Browser Inspector, please:
1. Open an issue on the GitHub repository
2. Include reproduction steps and screenshots
3. Check the VS Code Output Console for error messages
