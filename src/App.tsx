import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateStreamingResponse = async (userInput: string) => {
    setIsStreaming(true);
    const response = `Here's a Markdown response to your input: "${userInput}"\n\n# Heading 1\n## Heading 2\n\n- List item 1\n- List item 2\n\n**Bold text** and *italic text*\n\n[A link](https://example.com)\n\n\`\`\`javascript\nconsole.log('Hello, World!');\n\`\`\``;

    let streamedResponse = '';
    setMessages(prev => [...prev, { text: '', isUser: false }]);

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
      streamedResponse += response[i];
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: streamedResponse, isUser: false }
      ]);
    }

    setIsStreaming(false);
  };

  const handleSend = async () => {
    if (input.trim() && !isStreaming) {
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      setInput('');
      await simulateStreamingResponse(input);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2" />
            Markdown Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.isUser ? (
                    message.text
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="markdown-body"
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isStreaming}
            />
            <Button type="submit" disabled={isStreaming}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;