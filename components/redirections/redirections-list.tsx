'use client';

import { useState } from 'react';
import { RedirectData } from '@/types/redirect';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RedirectionsListProps {
  redirections: Record<string, RedirectData>;
}

export function RedirectionsList({ redirections }: RedirectionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const redirectEntries = Object.entries(redirections);
  const filteredEntries = redirectEntries.filter(([slug, data]) => {
    const query = searchQuery.toLowerCase();
    return (
      slug.toLowerCase().includes(query) ||
      data.title.toLowerCase().includes(query) ||
      data.desc.toLowerCase().includes(query) ||
      data.keywords.toLowerCase().includes(query) ||
      data.type.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search redirections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Results */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            {searchQuery ? 'No redirections found matching your search.' : 'No redirections available yet.'}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEntries.map(([slug, data]) => (
            <Card key={slug} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image */}
                  {data.image && (
                    <div className="lg:w-48 flex-shrink-0">
                      <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-32 lg:h-28 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{data.type}</Badge>
                        <Badge variant="outline">{data.clicks || 0} clicks</Badge>
                        {data.site_name && (
                          <Badge variant="outline">{data.site_name}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {data.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {data.desc}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Keywords:</span> {data.keywords}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/redirections/${slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href={`/redirections/${slug}?redirect=true`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Continue Reading
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}