import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/certificate';
// import { BlockchainService } from '@/lib/blockchain';

export async function POST(req: Request) {
  try {
    const { certificateId } = await req.json();

    await dbConnect();
    const certificate = await Certificate.findOne({ certificateId });
    
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }
    // TODO: Verify certificate on blockchain
    // const blockchain = new BlockchainService();
    // const isValid = await blockchain.verifyCertificate(
    //   certificateId,
    //   certificate.certificateHash
    // );

    return NextResponse.json({
      isValid : true,
      certificate: {
        id: certificate.certificateId,
        issueDate: certificate.issueDate,
        metadata: certificate.metadata,
      },
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}