# Multi-Provider Support

## Overview

Clauder is built with a **universal provider architecture** that allows you to use any AI provider without vendor lock-in. The extension supports multiple providers equally, giving you the flexibility to choose the best model for your needs.

## Supported Providers

Clauder currently supports the following AI providers:

### Direct Provider Integration

- **Anthropic** - Claude models (Opus, Sonnet, Haiku)
- **OpenAI** - GPT-4, GPT-3.5, O1, O3 models
- **DeepSeek** - DeepSeek V3 and reasoning models
- **Google** - Gemini models via Google AI Studio
- **Mistral** - Mistral AI models
- **OpenRouter** - Access to 100+ models from various providers
- **Kodu** - Kodu AI tunnel for Claude models

### Custom Providers

- **OpenAI-Compatible** - Any API that implements the OpenAI-compatible interface
  - Local models (LM Studio, Ollama)
  - Custom endpoints
  - Self-hosted solutions

## Key Features

### 🔄 Easy Provider Switching
Switch between providers seamlessly without losing your workflow. The interface remains consistent regardless of which provider you're using.

### 💰 Cost Transparency
See token usage and costs for each request, helping you manage your API budget effectively.

### 🔐 Secure Credential Management
API keys and credentials are stored securely using VSCode's secret storage mechanism.

### 🎯 Model Selection
Choose from a wide range of models, each optimized for different tasks:
- Coding and development
- Reasoning and analysis
- Fast responses
- Cost-effective options

### ⚡ Smart Features
- **Prompt caching** - Reduce costs and latency for supported providers
- **Context window management** - Automatic handling of conversation history
- **Error handling** - Graceful fallbacks and clear error messages
- **Token optimization** - Efficient use of context windows

## Architecture Principles

### No Vendor Lock-In
The extension is designed to be provider-agnostic:
- All providers use the same interface
- No provider receives preferential treatment
- Easy to add new providers
- Seamless provider migration

### Universal Provider System
All providers are treated equally in the architecture:
- Unified configuration system
- Consistent error handling
- Shared authentication mechanism
- Same user experience

### Extensibility
The plugin-based architecture makes it easy to:
- Add new providers
- Support new models
- Implement custom handlers
- Integrate with new APIs

## Getting Started

### Adding a Provider

1. **Open Settings**: Click the settings icon in Clauder
2. **Select Provider**: Choose from the list of available providers
3. **Enter Credentials**: Provide your API key or required authentication
4. **Choose Model**: Select your preferred model from the provider's offerings
5. **Start Coding**: Begin using Clauder with your chosen provider

### Provider-Specific Setup

#### Anthropic
- Get your API key from [console.anthropic.com](https://console.anthropic.com)
- Models: Claude 3 Opus, Sonnet, Haiku
- Features: Prompt caching, vision

#### OpenAI
- Get your API key from [platform.openai.com](https://platform.openai.com)
- Models: GPT-4, GPT-3.5, O1, O3
- Features: Prompt caching (GPT-4), reasoning (O1/O3)

#### DeepSeek
- Get your API key from [platform.deepseek.com](https://platform.deepseek.com)
- Models: DeepSeek V3, DeepSeek Reasoner
- Features: Cost-effective, strong reasoning

#### Google
- Get your API key from [makersuite.google.com](https://makersuite.google.com)
- Models: Gemini Pro, Gemini Flash
- Features: Large context window, multimodal

#### Mistral
- Get your API key from [console.mistral.ai](https://console.mistral.ai)
- Models: Mistral Large, Medium, Small
- Features: European provider, multilingual

#### OpenRouter
- Get your API key from [openrouter.ai](https://openrouter.ai)
- Access: 100+ models from various providers
- Features: Pay-as-you-go, model comparison

#### Kodu
- Get your API key from [kodu.ai](https://kodu.ai)
- Models: Claude models via tunnel
- Features: Free tier available, no separate Anthropic account needed

#### OpenAI-Compatible
- Configure any OpenAI-compatible endpoint
- Use cases: Local models, self-hosted solutions, custom APIs
- Examples: LM Studio, Ollama, Text Generation WebUI

## Switching Providers

You can switch providers at any time:

1. Open Clauder settings
2. Select a different provider
3. Choose a model
4. Continue your conversation

**Note:** Your conversation history is preserved when switching providers, allowing you to continue your work seamlessly.

## Best Practices

### Choosing a Provider

Consider these factors when selecting a provider:

- **Task complexity**: Use more powerful models (GPT-4, Claude Opus) for complex tasks
- **Cost**: Balance performance with budget using cost-effective options
- **Speed**: Choose faster models (Claude Haiku, GPT-3.5) for quick iterations
- **Features**: Select providers with specific features you need (vision, reasoning, etc.)
- **Privacy**: Consider data handling policies of different providers

### Managing Costs

Tips for cost-effective usage:

- Use prompt caching when available
- Start with faster models for exploration
- Switch to more powerful models when needed
- Monitor token usage in the UI
- Use context window efficiently

### Optimizing Performance

- Enable prompt caching for supported providers
- Use appropriate context window sizes
- Clear conversation history when starting new tasks
- Choose models optimized for your use case

## Technical Details

For developers and advanced users who want to understand or extend the provider system:

- **Architecture Documentation**: See `extension/src/api/providers/ARCHITECTURE.md`
- **Provider Implementation Guide**: See `extension/src/api/providers/README.md`
- **Migration Guide**: See `extension/src/api/providers/MIGRATION.md`

## Troubleshooting

### Common Issues

**Provider not available**
- Verify your API key is correct
- Check provider service status
- Ensure you have credits/quota available

**Model not found**
- Provider may have updated their model names
- Try refreshing the model list
- Check provider documentation for current models

**Rate limits**
- Most providers have rate limits
- Consider upgrading your plan
- Implement retry logic or switch providers temporarily

**Authentication errors**
- Re-enter your API key
- Check key permissions and scopes
- Verify key hasn't expired

## Future Plans

We're continuously improving multi-provider support:

- Additional provider integrations
- Enhanced model comparison tools
- Automatic provider fallback
- Cost optimization features
- Performance monitoring

## Contributing

Want to add a new provider? The universal architecture makes it easy:

1. Create a provider configuration file
2. Add models and pricing information
3. Register in the provider registry
4. Submit a pull request

See the [Provider Implementation Guide](extension/src/api/providers/README.md) for details.

## Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report problems on GitHub
- **Community**: Join our Discord for help and discussions
- **Updates**: Follow our changelog for new provider additions

---

The multi-provider architecture ensures you're never locked into a single vendor and can always choose the best AI model for your specific needs. Whether you prefer Anthropic's Claude, OpenAI's GPT, or any other provider, Clauder provides a consistent, powerful experience.
