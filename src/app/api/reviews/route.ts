
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export interface Review {
  id: string;
  name: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

const reviewSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export async function POST(request: Request) {
  console.log("API ROUTE: Received POST request.");
  try {
    const json = await request.json();
    console.log("API ROUTE: Request body parsed:", json);

    const parsedData = reviewSchema.safeParse(json);

    if (!parsedData.success) {
      console.error("API ROUTE: Validation failed.", parsedData.error.flatten());
      return NextResponse.json({ error: "Validation failed", details: parsedData.error.flatten() }, { status: 400 });
    }

    console.log("API ROUTE: Data validated successfully. Writing to Firestore...");
    const docRef = await addDoc(collection(db, "reviews"), {
      ...parsedData.data,
      createdAt: serverTimestamp(),
    });
    console.log("API ROUTE: Successfully written to Firestore with ID:", docRef.id);

    return NextResponse.json({ message: "Review submitted successfully!", id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("API ROUTE: An error occurred in the POST handler:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
    console.log("API ROUTE: Received GET request.");
    try {
        const reviewsCollection = collection(db, "reviews");
        const q = query(reviewsCollection, orderBy("createdAt", "desc"));
        
        console.log("API ROUTE: Fetching documents from Firestore...");
        const querySnapshot = await getDocs(q);
        console.log(`API ROUTE: Found ${querySnapshot.docs.length} documents.`);

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
        console.error("API ROUTE: Failed to fetch reviews:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}
