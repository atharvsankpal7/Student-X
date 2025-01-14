import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import CertificateRequest from '@/lib/models/certificate-request';

export async function PUT(
  req: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'candidate') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, accessDuration } = await req.json();
    
    await dbConnect();
    const request = await CertificateRequest.findById(params.requestId);
    
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.candidateId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate expiry date if request is approved
    let accessExpiryDate = null;
    if (status === 'approved' && accessDuration) {
      accessExpiryDate = new Date();
      accessExpiryDate.setDate(accessExpiryDate.getDate() + accessDuration);
    }

    // Update request
    const updatedRequest = await CertificateRequest.findByIdAndUpdate(
      params.requestId,
      {
        status,
        responseDate: new Date(),
        accessExpiryDate,
      },
      { new: true }
    );

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Request update error:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}