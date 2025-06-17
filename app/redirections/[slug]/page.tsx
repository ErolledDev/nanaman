import { notFound, redirect as nextRedirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { RedirectData } from '@/types/redirect';
import { Metadata } from 'next';
import { RedirectionPage } from '@/components/redirections/redirection-page';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getRedirection(slug: string): Promise<RedirectData | null> {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized - cannot fetch redirection');
      return null;
    }
    
    const doc = await adminDb.collection('redirections').doc(slug).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as RedirectData;
  } catch (error) {
    console.error('Error fetching redirection:', error);
    return null;
  }
}

async function incrementClick(slug: string) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized - cannot increment click');
      return;
    }
    
    const docRef = adminDb.collection('redirections').doc(slug);
    await docRef.update({
      clicks: adminDb.FieldValue.increment(1),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error incrementing click:', error);
  }
}

export async function generateStaticParams() {
  try {
    if (!adminDb) {
      console.warn('Firebase Admin not initialized, returning empty static params');
      console.warn('This will cause build errors with output: export. Please fix Firebase Admin configuration.');
      return [];
    }

    const snapshot = await adminDb.collection('redirections').get();
    const params = snapshot.docs.map((doc: any) => ({
      slug: doc.id,
    }));

    console.log(`Generated ${params.length} static params for redirections`);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    console.warn('Returning empty params - this will cause build errors with output: export');
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const redirection = await getRedirection(params.slug);
  
  if (!redirection) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: redirection.title,
    description: redirection.desc,
    keywords: redirection.keywords,
    authors: [{ name: redirection.author || 'thisisio' }],
    creator: redirection.author || 'thisisio',
    publisher: redirection.site_name || 'thisisio',
    alternates: {
      canonical: redirection.canonical || redirection.url,
    },
    openGraph: {
      title: redirection.title,
      description: redirection.desc,
      url: redirection.canonical || redirection.url,
      siteName: redirection.site_name || 'thisisio',
      images: [
        {
          url: redirection.image,
          width: 1200,
          height: 630,
          alt: redirection.title,
        },
      ],
      locale: 'en_US',
      type: redirection.type as any,
      publishedTime: redirection.published_time,
      modifiedTime: redirection.modified_time || redirection.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: redirection.title,
      description: redirection.desc,
      images: [redirection.image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RedirectionSlugPage({ params, searchParams }: Props) {
  const redirection = await getRedirection(params.slug);
  
  if (!redirection) {
    notFound();
  }

  // Check if this is a direct redirect request
  const shouldRedirect = searchParams.redirect === 'true';
  
  if (shouldRedirect) {
    // Increment click count and redirect
    await incrementClick(params.slug);
    nextRedirect(redirection.url);
  }

  return <RedirectionPage redirection={redirection} slug={params.slug} />;
}