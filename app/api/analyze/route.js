import axios from 'axios';
// import { connectToDatabase } from '../../lib/mongodb';

export async function POST(request) {
  try {
    // Parse request body
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid or missing text' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Hugging Face API
    const hfResponse = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract sentiment (highest scoring label)
    const results = hfResponse.data[0];
    const sentiment = results.reduce((prev, curr) => (curr.score > prev.score ? curr : prev));
    const { label, score } = sentiment;

    // Store in MongoDB
    // const { db } = await connectToDatabase();
    // await db.collection('analyses').insertOne({
    //   text,
    //   sentiment: label,
    //   confidence: score,
    //   timestamp: new Date(),
    // });

    // Return response
    return new Response(
      JSON.stringify({
        text,
        sentiment: label,
        confidence: score,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze sentiment',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}