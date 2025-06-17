'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, ExternalLink, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RedirectData } from '@/types/redirect';
import { toast } from 'sonner';
import Link from 'next/link';

export function ManageRedirects() {
  const [redirects, setRedirects] = useState<Record<string, RedirectData>>({});
  const [filteredRedirects, setFilteredRedirects] = useState<Record<string, RedirectData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; slug: string; title: string }>({
    open: false,
    slug: '',
    title: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'redirections'), orderBy('created_at', 'desc'));
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

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRedirects(redirects);
    } else {
      const filtered: Record<string, RedirectData> = {};
      Object.entries(redirects).forEach(([slug, data]) => {
        if (
          slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.keywords.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          filtered[slug] = data;
        }
      });
      setFilteredRedirects(filtered);
    }
  }, [redirects, searchQuery]);

  const handleDelete = async (slug: string) => {
    try {
      await deleteDoc(doc(db, 'redirections', slug));
      toast.success('Redirect deleted successfully');
      setDeleteDialog({ open: false, slug: '', title: '' });
    } catch (error) {
      toast.error('Failed to delete redirect');
    }
  };

  const redirectEntries = Object.entries(filteredRedirects);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Redirects</CardTitle>
        <CardDescription>
          View, edit, and delete your existing SEO redirections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search redirects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="secondary">
            {redirectEntries.length} redirects
          </Badge>
        </div>

        {/* Redirects List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading redirects...</div>
          ) : redirectEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No redirects found matching your search.' : 'No redirects created yet.'}
            </div>
          ) : (
            redirectEntries.map(([slug, data]) => (
              <div key={slug} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{data.title}</h3>
                    <Badge variant="outline">{data.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{data.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>/{slug}</span>
                    <span>•</span>
                    <span>{data.clicks || 0} clicks</span>
                    <span>•</span>
                    <span>Created {new Date(data.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/redirections/${slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        const url = `${window.location.origin}/redirections/${slug}?redirect=true`;
                        navigator.clipboard.writeText(url);
                        toast.success('Redirect URL copied to clipboard');
                      }}>
                        Copy Redirect URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const url = `${window.location.origin}/redirections/${slug}`;
                        navigator.clipboard.writeText(url);
                        toast.success('Preview URL copied to clipboard');
                      }}>
                        Copy Preview URL
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteDialog({ open: true, slug, title: data.title })}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, slug: '', title: '' })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Redirect</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(deleteDialog.slug)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}