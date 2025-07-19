import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';
import type { WithId, Document } from 'mongodb';

export interface Review extends WithId<Document> {
  name: string;
  rating: number;
  review: string;
  createdAt: Date;
}

const reviewSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = reviewSchema.safeParse(json);

    if (!parsedData.success) {
      console.error("Zod validation failed:", parsedData.error.flatten());
      return NextResponse.json({ error: "Validation failed", details: parsedData.error.flatten() }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("lovely_app");

    const result = await db.collection("reviews").insertOne({
      ...parsedData.data,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Review submitted successfully!", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit review:", error);
    // Ensure a descriptive error is returned
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}


export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("lovely_app");

        const reviews = await db.collection("reviews").find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(reviews, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}
