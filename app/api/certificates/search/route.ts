import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Certificate from '@/lib/models/certificate';
import User from '@/lib/models/user';
import CertificateRequest from '@/lib/models/certificate-request';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await dbConnect();
    
    // Find the candidate by username
    const candidate = await User.findOne({ username, role: 'candidate' });
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Get certificates for the candidate
    const certificates = await Certificate.find({
      candidateId: candidate._id,
      status: 'active',
    }).select('certificateId issueDate metadata');

    // If organization is requesting, check access permissions
    const isOrganization = session.user.role === 'organization';
    if (isOrganization) {
      // Get approved requests for this organization
      const approvedRequests = await CertificateRequest.find({
        organizationId: session.user.id,
        candidateId: candidate._id,
        status: 'approved',
        accessExpiryDate: { $gt: new Date() }
      }).select('certificateId');

      const approvedCertIds = approvedRequests.map(req => req.certificateId);

      // Return limited info for certificates without approved access
      const certificatesWithAccess = certificates.map(cert => ({
        certificateId: cert.certificateId,
        issueDate: cert.issueDate,
        metadata: {
          fileName: cert.metadata.get('fileName'),
        },
        hasAccess: approvedCertIds.includes(cert.certificateId),
      }));

      return NextResponse.json({ certificates: certificatesWithAccess });
    }

    // For non-organization users, return basic certificate info
    return NextResponse.json({ 
      certificates: certificates.map(cert => ({
        certificateId: cert.certificateId,
        issueDate: cert.issueDate,
        metadata: {
          fileName: cert.metadata.get('fileName'),
        }
      }))
    });
  } catch (error) {
    console.error('Certificate search error:', error);
    return NextResponse.json(
      { error: 'Failed to search certificates' },
      { status: 500 }
    );
  }
}