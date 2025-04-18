'use client'; // Enable client-side rendering for state management

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze sentiment');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Sentiment Analysis Service</h1>
      <p className="text-lg text-gray-700 max-w-md text-center mb-6">
        Analyze user reviews or social media posts for sentiment using AI.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Enter text for sentiment analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading || !text.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg max-w-lg w-full">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow max-w-lg w-full">
          <h2 className="text-xl font-semibold text-gray-800">Analysis Result</h2>
          <p className="mt-2 text-gray-600">
            <strong>Text:</strong> {result.text}
          </p>
          <p className="mt-1 text-gray-600">
            <strong>Sentiment:</strong>{' '}
            <span
              className={
                result.sentiment === 'POSITIVE' ? 'text-green-600' : 'text-red-600'
              }
            >
              {result.sentiment}
            </span>
          </p>
          <p className="mt-1 text-gray-600">
            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}