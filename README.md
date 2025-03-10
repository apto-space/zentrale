# 📡 Zentrale

A production-ready template for building conversational AI applications with Next.js, React, and Vercel AI SDK. This template provides a solid foundation for creating chat interfaces with LLMs, tool integration, and persistent conversations.

## Features

- 🎨 **Modern UI/UX**
  - Clean, responsive chat interface
  - Light/dark mode support
  - Loading states and animations
  - Mobile-friendly design

- 🤖 **LLM Integration**
  - Built on Vercel AI SDK
  - Streaming responses
  - Support for multiple LLM providers
  - Configurable system prompts

- 🛠️ **Tool System**
  - Type-safe tool definitions
  - Easy tool integration
  - Built-in search tool
  - Extensible tool architecture

- 💾 **Data Persistence**
  - Conversation history
  - Message storage
  - User feedback tracking
  - Database integration with geldata

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/apto-space/zentrale.git
   cd zentrale
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API keys and configuration.

4. Start the development server:
   ```bash
   bun dev
   ```

## Creating a New Chat App

1. Define your app configuration:
   ```typescript
   const myAppConfig: ChatAppConfig = {
     id: "my-chat-app",
     name: "My AI Assistant",
     prompts: {
       system: "You are a helpful assistant...",
     },
     options: {
       tools: [myTool],
       greeting: "Welcome to My AI Assistant!",
       examples: ["Example question 1", "Example question 2"],
     },
   };
   ```

2. Create your tools:
   ```typescript
   export const myTool: ToolExport = {
     myTool: {
       aiTool: {
         name: "myTool",
         description: "Description of my tool",
         parameters: z.object({
           // Your tool parameters
         }),
       },
       view: MyToolView,
     },
   };
   ```

3. Use the template:
   ```typescript
   <ChatPageWrapper config={myAppConfig} />
   ```

## Customization

### Styling
The template uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
};
```

### Database
The template uses geldata for data persistence. Configure your database connection in `.env.local`:
```
DATABASE_URL=your_database_url
```

### LLM Configuration
Configure your LLM provider in `app/core/api/chat/aiConfig.ts`:
```typescript
export function createStream(messages: any[], config: ChatAppConfig) {
  return streamText({
    messages,
    model: anthropic("claude-3-5-haiku-latest"),
    system: config.prompts.system,
    tools: config.options?.tools,
  });
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this template for your own projects.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [geldata](https://github.com/apto-space/geldata)
- [Tailwind CSS](https://tailwindcss.com/)
