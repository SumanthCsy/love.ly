import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, DocumentData, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// Define the shape of a review document from Firestore
export interface Review {
  id: string;
  name: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

// Zod schema for validating incoming review data
const reviewSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

// Handler for POST requests to create a new review
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedData = reviewSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json({ error: "Validation failed", details: parsedData.error.flatten() }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "reviews"), {
      ...parsedData.data,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: "Review submitted successfully!", id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/reviews:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

// Handler for GET requests to fetch all reviews
export async function GET(request: Request) {
    try {
        const reviewsCollection = collection(db, "reviews");
        const q = query(reviewsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const reviews: Review[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt;
            
            // Firestore timestamp needs to be converted to a JS Date object
            const createdAtDate = createdAt instanceof Timestamp ? createdAt.toDate() : new Date();

            reviews.push({
                id: doc.id,
                name: data.name,
                rating: data.rating,
                review: data.review,
                createdAt: createdAtDate,
            });
        });

        return NextResponse.json(reviews, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}
