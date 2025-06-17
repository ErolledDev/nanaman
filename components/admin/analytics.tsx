'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, MousePointer, Globe } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RedirectData } from '@/types/redirect';

export function Analytics() {
  const [redirects, setRedirects] = useState<Record<string, RedirectData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'redirections'), orderBy('clicks', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const redirectsData: Record<string, RedirectData> = {};
      snapshot.forEach((doc) => {
        redirectsData[doc.id] = doc.data() as RedirectData;
      });
      setRedirects(redirectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const redirectEntries = Object.entries(redirects);
  const totalClicks = redirectEntries.reduce((sum, [, data]) => sum + (data.clicks || 0), 0);
  const totalRedirects = redirectEntries.length;
  const topPerformers = redirectEntries
    .filter(([, data]) => (data.clicks || 0) > 0)
    .sort(([, a], [, b]) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 10);
  
  const maxClicks = Math.max(...topPerformers.map(([, data]) => data.clicks || 0));
  const contentTypes = redirectEntries.reduce((acc, [, data]) => {
    acc[data.type] = (acc[data.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Redirects</p>
                <p className="text-2xl font-bold text-gray-900">{totalRedirects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointer className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRedirects > 0 ? Math.round(totalClicks / totalRedirects) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Content Types</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(contentTypes).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Redirects</CardTitle>
            <CardDescription>
              Redirects ranked by click-through rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No clicks recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {topPerformers.map(([slug, data], index) => (
                  <div key={slug} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <span className="font-medium text-sm truncate">{data.title}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">/{slug}</div>
                      <Progress value={(data.clicks || 0) / maxClicks * 100} className="h-2" />
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-bold text-lg">{data.clicks || 0}</div>
                      <div className="text-xs text-gray-500">clicks</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Content Types</CardTitle>
            <CardDescription>
              Distribution of redirect content types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(contentTypes).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No content types recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(contentTypes)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{type}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(count / totalRedirects) * 100} 
                          className="w-24 h-2" 
                        />
                        <span className="font-medium min-w-0">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Redirects</CardTitle>
          <CardDescription>
            Latest created redirections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {redirectEntries
              .sort(([, a], [, b]) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
              .slice(0, 5)
              .map(([slug, data]) => (
                <div key={slug} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{data.title}</span>
                      <Badge variant="outline">{data.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(data.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-medium">{data.clicks || 0} clicks</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}