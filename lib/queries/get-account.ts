import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAccount(id: string) {
	const currentUser = await db.select().from(user).where(eq(user.id, id));

	return currentUser[0];
}
