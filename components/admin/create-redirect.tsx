'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RedirectForm } from '@/types/redirect';

const redirectSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required').max(160, 'Title must be 160 characters or less'),
  desc: z.string().min(1, 'Description is required').max(300, 'Description must be 300 characters or less'),
  url: z.string().url('Must be a valid URL'),
  image: z.string().url('Must be a valid image URL'),
  keywords: z.string().min(1, 'Keywords are required'),
  site_name: z.string().min(1, 'Site name is required'),
  type: z.string().min(1, 'Type is required'),
  canonical: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  author: z.string().optional(),
});

export function CreateRedirect() {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<RedirectForm>({
    resolver: zodResolver(redirectSchema),
    defaultValues: {
      slug: '',
      title: '',
      desc: '',
      url: '',
      image: '',
      keywords: '',
      site_name: 'thisisio',
      type: 'website',
      canonical: '',
      author: '',
    },
  });

  const onSubmit = async (data: RedirectForm) => {
    setLoading(true);
    
    try {
      const redirectData = {
        ...data,
        canonical: data.canonical || data.url,
        author: data.author || 'thisisio',
        clicks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_time: new Date().toISOString(),
      };

      await setDoc(doc(db, 'redirections', data.slug), redirectData);
      
      toast.success('Redirect created successfully!');
      form.reset();
    } catch (error: any) {
      console.error('Error creating redirect:', error);
      toast.error(error.message || 'Failed to create redirect');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      form.setValue('slug', slug);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Redirect
        </CardTitle>
        <CardDescription>
          Create a new SEO-optimized redirection with custom meta tags and Open Graph data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the page title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="url-friendly-slug" />
                      </FormControl>
                      <Button type="button" onClick={generateSlug} variant="outline" size="sm">
                        Generate
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter the page description" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/article" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="seo, blog, website" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="thisisio" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canonical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/canonical" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Author name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Redirect
                  </>
                )}
              </Button>
              
              {form.getValues('slug') && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const slug = form.getValues('slug');
                    window.open(`/redirections/${slug}`, '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}