import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axiosInstance from '../api/axiosInstance';

// Tailwind removes default styles, so we style each Markdown element here
const markdownStyles = {
  p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />,
  h1: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-4 mb-2" {...props} />,
  h3: ({ node, ...props }) => <h3 className="font-semibold mt-3 mb-1" {...props} />,
  hr: ({ node, ...props }) => <hr className="my-4 border-gray-200" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="border border-gray-300 px-3 py-2 align-top" {...props} />
  ),
};

const SUGGESTIONS = [
  'What should I learn first?',
  'Explain my skill gaps',
  'Suggest a beginner project',
];

function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const stickRef = useRef(true); // follow new text only when already at the bottom

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get('/assistant/history');
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  // Scroll only the message area to the bottom
  useEffect(() => {
    const box = scrollRef.current;
    if (box && stickRef.current) box.scrollTop = box.scrollHeight;
  }, [messages]);

  // Grow the input box as the student types
  useEffect(() => {
    const box = inputRef.current;
    if (!box) return;
    box.style.height = 'auto';
    box.style.height = `${Math.min(box.scrollHeight, 160)}px`;
  }, [input]);

  const handleScroll = () => {
    const box = scrollRef.current;
    stickRef.current = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  };

  // Replaces the text of the last (assistant) message
  const updateReply = (content) => {
    setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', content }]);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || sending || clearing) return;

    stickRef.current = true;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: '' },
    ]);
    setInput('');
    setSending(true);

    let received = '';
    let shown = 0;
    let finished = false;

    // Reveals the received text gradually, for a typing effect
    const typing = new Promise((resolve) => {
      const timer = setInterval(() => {
        if (shown < received.length) {
          const step = Math.max(2, Math.ceil((received.length - shown) / 40));
          shown = Math.min(received.length, shown + step);
          updateReply(received.slice(0, shown));
        } else if (finished) {
          clearInterval(timer);
          resolve();
        }
      }, 30);
    });

    try {
      const res = await axiosInstance.post(
        '/assistant/chat/stream',
        { message: text },
        {
          responseType: 'text',
          onDownloadProgress: (progress) => {
            const xhr = progress.event?.target;
            if (xhr?.status === 200) received = xhr.responseText;
          },
        }
      );
      received = res.data;
    } catch (err) {
      received = received
        ? `${received}\n\n_The answer was interrupted. Please try again._`
        : 'Sorry, something went wrong. Please try again.';
    } finally {
      finished = true;
      await typing;
      setSending(false);
    }
  };

  const handleNewChat = async () => {
    if (sending || clearing) return;
    if (!window.confirm('Start a new chat? Your current messages will be permanently deleted.')) {
      return;
    }

    setClearing(true);
    try {
      await axiosInstance.delete('/assistant/history');
      setMessages([]);
      setInput('');
      inputRef.current?.focus();
    } catch (err) {
      window.alert('Could not start a new chat. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Enter sends, Shift + Enter makes a new line
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[65px] z-10 flex flex-col bg-white">
      <div className="flex justify-end border-b border-gray-100 px-4 py-2">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={messages.length === 0 || sending || clearing}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          {clearing ? 'Clearing...' : '+ New Chat'}
        </button>
      </div>

      {/* Message area: full width, so the scrollbar sits at the screen edge */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="text-center mt-24">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Ask Your Career AI</h1>
              <p className="text-gray-500 mb-6">
                Ask me anything about your career path, skills, or roadmap.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl bg-blue-600 text-white px-4 py-2 whitespace-pre-wrap break-words">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="text-gray-800 leading-7 break-words">
                {m.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownStyles}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 animate-pulse">Thinking...</p>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Input pinned at the bottom */}
      <div className="px-4 pb-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-end gap-2 border border-gray-300 rounded-2xl p-2 shadow-sm focus-within:border-blue-500"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            aria-label="Your question"
            className="flex-1 resize-none bg-transparent px-2 py-2 outline-none"
          />
          <button
            type="submit"
            disabled={sending || clearing || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">
          AI can make mistakes. Check important details on official websites.
        </p>
      </div>
    </div>
  );
}

export default Assistant;