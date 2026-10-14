import { NextResponse } from "next/server";
import { eq, desc, count } from "drizzle-orm";
import { db } from "@/db";
import { domains, inquiries, sellSubmissions } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      activeDomainsRes,
      totalDomainsRes,
      newInquiriesRes,
      totalInquiriesRes,
      pendingSubmissionsRes,
      totalSubmissionsRes,
      recentInquiries,
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(domains)
        .where(eq(domains.status, "active")),
      db.select({ count: count() }).from(domains),
      db
        .select({ count: count() })
        .from(inquiries)
        .where(eq(inquiries.status, "new")),
      db.select({ count: count() }).from(inquiries),
      db
        .select({ count: count() })
        .from(sellSubmissions)
        .where(eq(sellSubmissions.status, "pending")),
      db.select({ count: count() }).from(sellSubmissions),
      db
        .select()
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt))
        .limit(5),
    ]);

    const activeDomains = Number(activeDomainsRes[0]?.count || 0);
    const totalDomains = Number(totalDomainsRes[0]?.count || 0);
    const newInquiries = Number(newInquiriesRes[0]?.count || 0);
    const totalInquiries = Number(totalInquiriesRes[0]?.count || 0);
    const pendingSubmissions = Number(pendingSubmissionsRes[0]?.count || 0);
    const totalSubmissions = Number(totalSubmissionsRes[0]?.count || 0);

    return NextResponse.json({
      // Primary stats requested
      activeDomains,
      newInquiries,
      pendingSubmissions,
      recentInquiries,
      // Aggregates / aliases for flexible frontend consumption
      totalDomains: activeDomains,
      allDomains: totalDomains,
      totalInquiries: newInquiries,
      allInquiries: totalInquiries,
      totalSellSubmissions: pendingSubmissions,
      allSellSubmissions: totalSubmissions,
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching statistics" },
      { status: 500 }
    );
  }
}
