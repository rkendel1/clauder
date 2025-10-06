# Aider Provider - Expanded Model Selection

The Aider provider now supports a wide range of Large Language Models (LLMs) from multiple providers, giving you more flexibility in choosing the right model for your coding tasks.

## Overview

Aider acts as a unified interface to various AI models and providers. This configuration allows the VS Code extension to communicate with Aider through its OpenAI-compatible API interface.

## Configuration

- **Base URL**: `http://localhost:8080/v1` (default)
  - For Docker: Use container name or localhost with port mapping
  - For remote servers: Use full URL including protocol and port
  
- **API Key**: Required for the underlying AI provider
  - Passed through to the configured backend provider
  - May be optional for local models

## Supported Models

### OpenAI Models

#### GPT-4o (Recommended)
- **Model ID**: `gpt-4o`
- **Context Window**: 128K tokens
- **Max Output**: 16,384 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $2.50 input / $10.00 output per 1M tokens
- **Cache Pricing**: $3.125 writes / $0.25 reads per 1M tokens

#### GPT-4o Mini
- **Model ID**: `gpt-4o-mini`
- **Context Window**: 128K tokens
- **Max Output**: 16,384 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $0.15 input / $0.60 output per 1M tokens
- **Cache Pricing**: $0.1875 writes / $0.015 reads per 1M tokens

#### GPT-4
- **Model ID**: `gpt-4`
- **Context Window**: 128K tokens
- **Max Output**: 4,096 tokens
- **Features**: Images
- **Pricing**: $30.00 input / $60.00 output per 1M tokens

#### GPT-4 Turbo
- **Model ID**: `gpt-4-turbo`
- **Context Window**: 128K tokens
- **Max Output**: 4,096 tokens
- **Features**: Images
- **Pricing**: $10.00 input / $30.00 output per 1M tokens

#### GPT-3.5 Turbo
- **Model ID**: `gpt-3.5-turbo`
- **Context Window**: 16,385 tokens
- **Max Output**: 4,096 tokens
- **Pricing**: $0.50 input / $1.50 output per 1M tokens

#### O1 Preview (Thinking Model)
- **Model ID**: `o1-preview`
- **Context Window**: 128K tokens
- **Max Output**: 32,768 tokens
- **Features**: Images, Extended Reasoning
- **Pricing**: $15.00 input / $60.00 output per 1M tokens

#### O1 Mini (Thinking Model)
- **Model ID**: `o1-mini`
- **Context Window**: 128K tokens
- **Max Output**: 65,536 tokens
- **Features**: Images, Extended Reasoning
- **Pricing**: $3.00 input / $12.00 output per 1M tokens

### Claude Models (Anthropic)

#### Claude 3.5 Sonnet (Recommended)
- **Model ID**: `claude-3-5-sonnet-20241022`
- **Context Window**: 200K tokens
- **Max Output**: 8,096 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $3.00 input / $15.00 output per 1M tokens
- **Cache Pricing**: $3.75 writes / $0.30 reads per 1M tokens

#### Claude 3.5 Haiku
- **Model ID**: `claude-3-5-haiku-20241022`
- **Context Window**: 200K tokens
- **Max Output**: 8,096 tokens
- **Features**: Prompt Caching
- **Pricing**: $0.80 input / $4.00 output per 1M tokens
- **Cache Pricing**: $1.00 writes / $0.08 reads per 1M tokens

#### Claude 3 Opus
- **Model ID**: `claude-3-opus-20240229`
- **Context Window**: 200K tokens
- **Max Output**: 4,096 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $15.00 input / $75.00 output per 1M tokens
- **Cache Pricing**: $18.75 writes / $1.50 reads per 1M tokens

#### Claude 3 Haiku
- **Model ID**: `claude-3-haiku-20240307`
- **Context Window**: 200K tokens
- **Max Output**: 4,096 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $0.25 input / $1.25 output per 1M tokens
- **Cache Pricing**: $0.3125 writes / $0.025 reads per 1M tokens

### Google Gemini Models

#### Gemini 2.0 Flash Exp
- **Model ID**: `gemini-2.0-flash-exp`
- **Context Window**: 1M tokens
- **Max Output**: 8,192 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: Free (experimental)

#### Gemini 1.5 Pro
- **Model ID**: `gemini-1.5-pro`
- **Context Window**: 2M tokens
- **Max Output**: 8,192 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $1.25 input / $5.00 output per 1M tokens
- **Cache Pricing**: $1.5625 writes / $0.125 reads per 1M tokens

#### Gemini 1.5 Flash
- **Model ID**: `gemini-1.5-flash`
- **Context Window**: 1M tokens
- **Max Output**: 8,192 tokens
- **Features**: Images, Prompt Caching
- **Pricing**: $0.075 input / $0.30 output per 1M tokens
- **Cache Pricing**: $0.09375 writes / $0.0075 reads per 1M tokens

### DeepSeek Models

#### DeepSeek Chat
- **Model ID**: `deepseek-chat`
- **Context Window**: 64K tokens
- **Max Output**: 8,192 tokens
- **Features**: Prompt Caching
- **Pricing**: $0.14 input / $0.28 output per 1M tokens
- **Cache Pricing**: $0.14 writes / $0.014 reads per 1M tokens

#### DeepSeek Coder
- **Model ID**: `deepseek-coder`
- **Context Window**: 64K tokens
- **Max Output**: 8,192 tokens
- **Pricing**: $0.14 input / $0.28 output per 1M tokens

### Mistral Models

#### Mistral Large
- **Model ID**: `mistral-large-latest`
- **Context Window**: 128K tokens
- **Max Output**: 8,192 tokens
- **Pricing**: $2.00 input / $6.00 output per 1M tokens

#### Mistral Medium
- **Model ID**: `mistral-medium-latest`
- **Context Window**: 32K tokens
- **Max Output**: 8,192 tokens
- **Pricing**: $2.70 input / $8.10 output per 1M tokens

### Meta Llama Models

#### Llama 3.1 70B
- **Model ID**: `meta-llama/llama-3.1-70b-instruct`
- **Context Window**: 128K tokens
- **Max Output**: 8,192 tokens
- **Pricing**: $0.35 input / $0.40 output per 1M tokens

#### Llama 3.1 405B
- **Model ID**: `meta-llama/llama-3.1-405b-instruct`
- **Context Window**: 128K tokens
- **Max Output**: 8,192 tokens
- **Pricing**: $2.70 input / $2.70 output per 1M tokens

## Prompt Caching

Many models support prompt caching, which can significantly reduce costs for repetitive tasks:

- **Cache Writes**: Slightly more expensive than regular input tokens (stores frequently used prompts)
- **Cache Reads**: Much cheaper than regular input tokens (reuses stored prompts)
- **Benefits**: Up to 90% cost reduction for cached portions of prompts

Models with prompt caching support are marked with "Prompt Caching" in their features.

## Model Selection Guide

### For General Coding Tasks
- **Recommended**: Claude 3.5 Sonnet or GPT-4o
- **Budget-Friendly**: Claude 3.5 Haiku or GPT-4o Mini

### For Complex Reasoning
- **Best**: O1 Preview or O1 Mini (thinking models)
- **Alternative**: Claude 3 Opus or GPT-4

### For Speed and Cost
- **Best**: Gemini 2.0 Flash Exp (free)
- **Alternative**: Claude 3.5 Haiku or Gemini 1.5 Flash

### For Code-Specific Tasks
- **Best**: DeepSeek Coder
- **Alternative**: Claude 3.5 Sonnet

### For Large Context
- **Best**: Gemini 1.5 Pro (2M tokens)
- **Alternative**: Claude 3.5 Sonnet (200K tokens)

## Usage Notes

1. **Aider Setup**: Ensure Aider is running and accessible at the configured base URL
2. **Model Availability**: Depends on your Aider backend configuration
3. **API Keys**: Required for cloud providers (OpenAI, Anthropic, etc.)
4. **Local Models**: Some models (Ollama, LMStudio) may not require API keys
5. **Testing**: Test connection before starting tasks for best experience

## Configuration Example

```json
{
  "aider": {
    "providerId": "aider",
    "apiKey": "your-api-key",
    "baseUrl": "http://localhost:8080/v1",
    "modelId": "claude-3-5-sonnet-20241022"
  }
}
```

## See Also

- [Caching Documentation](./CACHING.md) - Learn about the caching mechanism
- [Aider Official Site](https://aider.chat) - More about Aider
- [Provider Support](../../PROVIDER-SUPPORT.md) - All supported providers
