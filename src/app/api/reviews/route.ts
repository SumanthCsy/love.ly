import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, DocumentData } from 'firebase/firestore';
import { z } from 'zod';

// Define the shape of a review document from Firestore
export interface Review extends DocumentData {
  id: string;
  name: string;
  rating: number;
  review: string;
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
    console.log("Received submission:", json);

    // Validate the incoming data
    const parsedData = reviewSchema.safeParse(json);

    if (!parsedData.success) {
      console.error("Validation failed:", parsedData.error.flatten());
      return NextResponse.json({ error: "Validation failed", details: parsedData.error.flatten() }, { status: 400 });
    }

    // Add the review to the "reviews" collection in Firestore
    const docRef = await addDoc(collection(db, "reviews"), {
      ...parsedData.data,
      createdAt: serverTimestamp(), // Use Firestore server timestamp
    });

    console.log("Document written with ID: ", docRef.id);
    return NextResponse.json({ message: "Review submitted successfully!", id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("Error adding document: ", error);
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
            reviews.push({
                id: doc.id,
                name: data.name,
                rating: data.rating,
                review: data.review,
                // Firestore timestamp needs to be converted to a JS Date object
                createdAt: data.createdAt.toDate(),
            });
        });

        return NextResponse.json(reviews, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}
