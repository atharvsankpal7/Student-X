import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Certificate from "@/lib/models/certificate";
import User from "@/lib/models/user";
// import { BlockchainService } from '@/lib/blockchain';
import { createHash } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "issuer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const username = formData.get("username") as string;

    // Verify that the candidate exists
    const candidate = await User.findOne({ username });
    if (!candidate || candidate.role !== "candidate") {
      return NextResponse.json(
        { error: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    // Generate certificate hash
    const arrayBuffer = await file.arrayBuffer();
    const hash = createHash("sha256")
      .update(new Uint8Array(arrayBuffer))
      .digest("hex");

    // Generate a unique certificate ID
    const certificateId = crypto.randomUUID();

    // Store certificate in MongoDB
    const certificate = await Certificate.create({
      certificateId,
      candidateId: candidate._id, // Use the verified candidate's ID
      issuerId: session.user.id,
      certificateHash: hash,
      fileData: Buffer.from(arrayBuffer), // Store the actual file data
      metadata: {
        fileName: file.name,
        fileSize: file.size.toString(),
        mimeType: file.type,
      },
      // TODO:
      fileUrl: "will be added later",
    });

    // TODO: Store hash on blockchain
    // const blockchain = new BlockchainService();
    // await blockchain.issueCertificate(
    //   certificateId,
    //   hash,
    //   process.env.ISSUER_PRIVATE_KEY!
    // );

    return NextResponse.json({
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        fileName: certificate.metadata.get("fileName"),
        issueDate: certificate.issueDate,
      },
    });
  } catch (error) {
    console.error("Certificate issuance error:", error);
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = session.user.role;

    let query = {};
    if (role === "candidate") {
      query = { candidateId: session.user.id };
    } else if (role === "issuer") {
      query = { issuerId: session.user.id };
    }

    const certificates = await Certificate.find(query)
      .select("certificateId issueDate metadata")
      .sort({ issueDate: -1 });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Certificate retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve certificates" },
      { status: 500 }
    );
  }
}
