import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import CertificateRequest from '@/lib/models/certificate-request';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'organization') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { candidateId, certificateId } = await req.json();
    await dbConnect();

    // Check if there's already a pending request
    const existingRequest = await CertificateRequest.findOne({
      organizationId: session.user.id,
      candidateId,
      certificateId,
      status: 'pending',
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A pending request already exists' },
        { status: 400 }
      );
    }

    const request = await CertificateRequest.create({
      organizationId: session.user.id,
      candidateId,
      certificateId,
      status: 'pending',
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error('Request creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const query = session.user.role === 'candidate'
      ? { candidateId: session.user.id }
      : { organizationId: session.user.id };

    const requests = await CertificateRequest.find(query)
      .populate('certificateId')
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Request retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve requests' },
      { status: 500 }
    );
  }
}