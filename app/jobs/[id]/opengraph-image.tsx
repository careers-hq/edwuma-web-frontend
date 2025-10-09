import { ImageResponse } from 'next/og';
import { jobsApiService } from '@/lib/api/jobs';
import { extractJobId } from '@/lib/utils/slug';

export const runtime = 'edge';
export const alt = 'Job Posting';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = extractJobId(id);

  try {
    const response = await jobsApiService.getJob(jobId);
    
    if (!response.success || !response.data) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            Job Not Found
          </div>
        ),
        { ...size }
      );
    }

    const job = response.data;
    const company = job.companies[0];
    const location = job.locations[0];

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #52c46e 0%, #3fa85e 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              Edwuma
            </div>
          </div>

          {/* Job Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Job Title */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '90%',
              }}
            >
              {job.title}
            </div>

            {/* Company & Location */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {company?.name || 'Top Company'}
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: 'rgba(255, 255, 255, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                📍 {location?.city || location?.country || 'Africa'}
                {job.work_mode.value === 'remote' && ' • 🏠 Remote'}
              </div>
            </div>
          </div>

          {/* Footer - Salary & Type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '20px',
              }}
            >
              {job.salary.min && job.salary.max && (
                <div
                  style={{
                    fontSize: 24,
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                  }}
                >
                  💰 {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                </div>
              )}
              <div
                style={{
                  fontSize: 24,
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '10px 20px',
                  borderRadius: '8px',
                }}
              >
                {job.job_type.label}
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              edwuma.com
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #52c46e 0%, #3fa85e 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Edwuma - Jobs in Africa
        </div>
      ),
      { ...size }
    );
  }
}

