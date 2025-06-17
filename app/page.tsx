import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shield, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ExternalLink className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">SEO Redirection System</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A powerful SEO redirection and content management system designed for optimal search engine performance and user experience.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ExternalLink className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Redirections</h3>
            <p className="text-gray-600">
              Create SEO-optimized redirections with custom meta tags, descriptions, and Open Graph data.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Management</h3>
            <p className="text-gray-600">
              Protected admin panel with Firebase authentication for secure content management.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Tracking</h3>
            <p className="text-gray-600">
              Monitor click-through rates and performance metrics for all your redirections.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/redirections">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Redirections
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Access the admin panel to manage your SEO redirections and track analytics.
          </p>
        </div>
      </div>
    </div>
  );
}