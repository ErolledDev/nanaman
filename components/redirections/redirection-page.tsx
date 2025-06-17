'use client';

import { useEffect } from 'react';
import { RedirectData } from '@/types/redirect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RedirectionPageProps {
  redirection: RedirectData;
  slug: string;
}

export function RedirectionPage({ redirection, slug }: RedirectionPageProps) {
  const handleContinueReading = () => {
    // This will trigger the redirect in the parent component
    window.location.href = `/redirections/${slug}?redirect=true`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/redirections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Redirections
            </Link>
          </Button>
        </div>

        {/* Article Card */}
        <Card className="overflow-hidden">
          {/* Hero Image */}
          {redirection.image && (
            <div className="aspect-video relative">
              <img
                src={redirection.image}
                alt={redirection.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-8">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge>{redirection.type}</Badge>
              {redirection.site_name && (
                <Badge variant="outline">{redirection.site_name}</Badge>
              )}
              <div className="flex items-center text-sm text-gray-500 ml-auto">
                {redirection.author && (
                  <>
                    <User className="mr-1 h-3 w-3" />
                    <span className="mr-3">{redirection.author}</span>
                  </>
                )}
                {redirection.published_time && (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{new Date(redirection.published_time).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {redirection.title}
            </h1>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {redirection.desc}
              </p>
              
              {/* Placeholder content to make it look like a blog post */}
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  This is a preview of the content. The full article contains comprehensive 
                  information about the topic, including detailed analysis, expert insights, 
                  and practical recommendations.
                </p>
                <p>
                  To access the complete article with all the details, research findings, 
                  and additional resources, please click "Continue Reading" below.
                </p>
              </div>
            </div>

            {/* Keywords */}
            {redirection.keywords && (
              <div className="flex items-center gap-2 mb-6">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {redirection.keywords.split(',').map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to read the full article?
                </h3>
                <p className="text-gray-600 mb-4">
                  Continue reading to access the complete content with detailed insights and analysis.
                </p>
                <Button size="lg" onClick={handleContinueReading}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Continue Reading
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{redirection.clicks || 0} readers have continued to this article</span>
                <span>
                  Last updated: {new Date(redirection.updated_at || redirection.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}