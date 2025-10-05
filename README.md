<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=rkendel1.claude-dev-experimental" target="_blank"><strong>Download Extension</strong></a> | <a href="https://discord.gg/Fn97SD34qk" target="_blank"><strong>Join the Discord</strong></a>
</p>

# 👋 Hey there !

Welcome to Kuhmpel. Whether you're a developer looking to supercharge your workflow, or someone with a brilliant idea but limited coding experience, you're in the right place. I created this tool to bridge the gap between imagination and implementation, making coding more accessible and efficient for everyone.

## 🚀 What's Kuhmpel?

Think of Kuhmpel as your 24/7 AI-powered Software Developer. It's a VS Code extension that adapts to your skill level, helping you bring ideas to life faster than ever before.

**🎯 Multi-Provider Support**: Choose from multiple AI providers including Anthropic, OpenAI, DeepSeek, Google, Mistral, and more. No vendor lock-in - switch providers seamlessly based on your needs. [Learn more about provider support](PROVIDER-SUPPORT.md)

All you need to is tell Claude what's your task and Claude will take care of it for you, need a website? dashboard? server? design? Claude got it all covered for you.

### 🌟 Here's what Kuhmpel can do for you:

- 💡 **Idea to Implementation**: Transform concepts into code, whether you're starting from scratch or building complex systems
- 🎨 **Design to Reality**: Convert mockups and wireframes into functional applications
- 🐞 **Intuitive Debugging**: Identify and fix issues quickly, saving you hours of troubleshooting
- 🚗 **Accelerate Development**: Automate repetitive tasks and generate boilerplate code
- 📚 **Learn and Grow**: Improve your coding skills with explanations and best practices
- 🔍 **Search The Web**: Take inspiration from existing content, or ask claude to do it's own research to adapt his knowledge for your needings
- 🚀 **Deploy and Publish**: Claude can help you publish your project online, using existing tools without you breaking your head how to get your awesome project online
- 🔄 **Multiple AI Providers**: Switch between Anthropic, OpenAI, DeepSeek, Google, and more - use the best model for each task

## 🎬 See it in action

Here's a demo of Kuhmpel helping Joy create her landing page for her business in Tokyo under 5 minutes:
[Joy Coffee Shop Preview](https://joy-coffee-shop.vercel.app)




<p align="center">
<video alt="video" src="https://github.com/user-attachments/assets/4f00201e-12d1-4a91-aeb0-614726dab8b3" width="500" />
</p>

<p align="center">
<img src="https://res.cloudinary.com/ddqtnp0ic/image/upload/v1727892212/50888505-4eb097dc4d688fd44252eafcae7c152e_mebjvs.webp" alt="Joy Website Preview">
</p>

## 🛠 Getting Started

1. **Install VS Code**: If you haven't already, [download it here](https://code.visualstudio.com/).
2. **Add Kuhmpel**:
   - Open VS Code
   - Click the puzzle piece icon on the left sidebar
   - Search for ["Kuhmpel"](https://www.github.com/rkendel1/l/ext)
   - Click "Install"
3. **Start Coding**:
   - Open a project or create a new file
   - Describe what you want to build or get help with
   - Let Kuhmpel assist you in bringing your ideas to life!

## 💖 Why I Made This

As someone who's been in tech for years, I've seen the challenges faced by both newcomers and experienced developers. I wanted to create a tool that could level the playing field, making development more accessible to beginners while also boosting the productivity of seasoned coders. Kuhmpel is my way of empowering everyone to build amazing things, regardless of their coding background.

## 🤝 Join Our Community

Whether you're stuck on a problem, have a cool idea to share, or just want to connect with fellow creators, join our [Discord](https://discord.gg/Fn97SD34qk)! It's a vibrant community of developers and innovators at all skill levels.

## 🙏 Special Thanks

A big shoutout to the amazing projects and people that inspired Kuhmpel:

- **Aider**: For innovative ideas on enhancing user experience
- **Claude Dev**: Especially Saoud, for laying an incredible foundation

## 🚀 Ready to Elevate Your Coding?

[Get Kuhmpel Now](https://www.github.com/rkendel1/l/ext) and start transforming your ideas into reality!

Whether you're crafting your first "Hello, World!" or architecting complex systems, Kuhmpel is here to help you push the boundaries of what's possible. Can't wait to see what you create! 🌟

---

## 🐳 Docker Deployment

**New!** Run Kuhmpel with Code Server and Aider in a single Docker container:

```bash
git clone https://github.com/rkendel1/clauder.git
cd clauder
./start.sh
```

Access Code Server at http://localhost:8443 - Everything is pre-configured!

📚 **See full documentation:**
- [Docker Deployment Guide](./DOCKER.md) - Complete Docker setup and configuration
- [Aider Integration Guide](./AIDER.md) - Using Aider as an AI provider

---

<details>
<summary>🔧 For the tech-savvy: How to Contribute</summary>

If you're a developer and want to help make Kuhmpel even better, here's how:

### Prerequisites
- Node.js 20.x or later
- npm (comes with Node.js)
- Git

### Quick Start

1. Clone the repo: `git clone https://github.com/rkendel1/clauder.git`
2. Open in VS Code: `code clauder`
3. Navigate to extension folder: `cd extension`
4. Install all dependencies: `npm run install:all`
   - This installs dependencies for both the extension and the webview UI
5. Press `F5` to run the extension in development mode

### Development Tips

- **Webview changes**: The webview UI hot-reloads automatically during development
- **Extension changes**: Reload the extension host (Cmd/Ctrl + R) to see changes
- **Build webview**: `npm run build:webview`
- **Build extension**: `npm run compile`
- **Watch mode**: `npm run watch` for automatic rebuilding

### Project Structure

- `/extension` - Main extension code and configuration
  - `/src` - TypeScript source code
  - `/webview-ui-vite` - React-based webview UI built with Vite
  - `/dist` - Compiled extension code

### Alternative: Using Yarn

If you prefer yarn over npm:
```bash
cd extension
yarn install
cd webview-ui-vite && yarn install
```

### Docker Development

To test the Docker deployment:
```bash
# Build and run
./start.sh --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

See [DOCKER.md](./DOCKER.md) for detailed Docker documentation.

Make your changes, create a pull request, and let's make magic together!

</details>
