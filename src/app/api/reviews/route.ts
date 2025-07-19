
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  query, 
  orderBy, 
  Timestamp,
  doc,
  deleteDoc
} from 'firebase/firestore';
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
  try {
    const json = await request.json();
    const parsedData = reviewSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json({ error: "Validation failed", details: parsedData.error.flatten() }, { status: 400 });
    }

    const dataToSave: { name: string; rating: number; review?: string; createdAt: any } = {
        name: parsedData.data.name,
        rating: parsedData.data.rating,
        createdAt: serverTimestamp(),
    };

    // Only include review if it's not empty
    if (parsedData.data.review && parsedData.data.review.trim() !== '') {
        dataToSave.review = parsedData.data.review;
    }

    const docRef = await addDoc(collection(db, "reviews"), dataToSave);

    return NextResponse.json({ message: "Review submitted successfully!", id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("API POST Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const reviewsCollection = collection(db, "reviews");
        const q = query(reviewsCollection, orderBy("createdAt", "desc"));
        
        const querySnapshot = await getDocs(q);

        const reviews: Review[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt;
            
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
        console.error("API GET Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred";
        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const reviewDocRef = doc(db, "reviews", id);
    await deleteDoc(reviewDocRef);

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API DELETE Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}
