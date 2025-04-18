import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        await db.collection('analyses').insertOne({ test: 'Connection successful', timestamp: new Date() })
        return new Response(JSON.stringify({ message: 'Connected to MongoDB' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to connect to MongoDB', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
