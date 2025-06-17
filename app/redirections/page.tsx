import { adminDb } from '@/lib/firebase-admin';
import { RedirectData } from '@/types/redirect';
import { RedirectionsList } from '@/components/redirections/redirections-list';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'All Redirections - SEO Redirection System',
  description: 'Browse all available SEO-optimized redirections and content',
  openGraph: {
    title: 'All Redirections - SEO Redirection System',
    description: 'Browse all available SEO-optimized redirections and content',
    type: 'website',
  },
};

async function getRedirections(): Promise<Record<string, RedirectData>> {
  try {
    const snapshot = await adminDb.collection('redirections').get();
    const redirections: Record<string, RedirectData> = {};
    
    snapshot.forEach((doc) => {
      redirections[doc.id] = doc.data() as RedirectData;
    });
    
    return redirections;
  } catch (error) {
    console.error('Error fetching redirections:', error);
    return {};
  }
}

export default async function RedirectionsPage() {
  const redirections = await getRedirections();
  const redirectionEntries = Object.entries(redirections);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Redirections</h1>
            <p className="text-gray-600">
              Browse our collection of SEO-optimized content and redirections
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ExternalLink className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-blue-600">{redirectionEntries.length}</h3>
            <p className="text-gray-600">Total Redirections</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-green-600">
              {redirectionEntries.reduce((sum, [, data]) => sum + (data.clicks || 0), 0)}
            </h3>
            <p className="text-gray-600">Total Clicks</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-purple-600">
              {new Set(redirectionEntries.map(([, data]) => data.type)).size}
            </h3>
            <p className="text-gray-600">Content Types</p>
          </div>
        </div>

        {/* Redirections List */}
        <RedirectionsList redirections={redirections} />
      </div>
    </div>
  );
}