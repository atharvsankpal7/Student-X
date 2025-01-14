import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/certificate';
import CertificateRequest from '@/lib/models/certificate-request';

export async function GET(
  req: Request,
  { params }: { params: { certificateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const certificate = await Certificate.findOne({
      certificateId: params.certificateId,
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Check access permissions
    const isOwner = certificate.candidateId === session.user.id;
    const isIssuer = certificate.issuerId === session.user.id;
    
    if (!isOwner && !isIssuer) {
      // For organizations, check if they have approved access
      if (session.user.role === 'organization') {
        const hasAccess = await CertificateRequest.findOne({
          organizationId: session.user.id,
          certificateId: params.certificateId,
          status: 'approved',
          accessExpiryDate: { $gt: new Date() }
        });

        if (!hasAccess) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Create response with PDF file
    return new NextResponse(certificate.fileData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${certificate.metadata.get('fileName')}"`,
      },
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}