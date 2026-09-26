import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const res = await axiosInstance.post('/assistant/chat', { message: userMessage.content });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ask Your Career AI</h1>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4 space-y-3 min-h-[400px]">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">
            Ask me anything about your career path, skills, or roadmap.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && <p className="text-gray-400 text-sm">Thinking...</p>}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Assistant;