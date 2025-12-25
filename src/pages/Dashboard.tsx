import { useNavigate } from 'react-router-dom';
import { useDocuments } from '@/hooks/useDocuments';
import { Header } from '@/components/layout/Header';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { CreateDocumentCard } from '@/components/documents/CreateDocumentCard';
import { toast } from '@/hooks/use-toast';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents, createDocument, deleteDocument, isLoading } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreate = () => {
    const doc = createDocument();
    navigate(`/document/${doc.id}`);
    toast({
      title: 'Document created',
      description: 'Your new document is ready to edit.',
    });
  };

  const handleOpen = (id: string) => {
    navigate(`/document/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
    toast({
      title: 'Document deleted',
      description: 'The document has been permanently removed.',
      variant: 'destructive',
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-primary/10 via-accent/20 to-background rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome to Docs</h1>
                <p className="text-muted-foreground">Create and edit documents with ease</p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Start a new document</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <CreateDocumentCard onCreate={handleCreate} />
          </div>
        </section>

        {/* Recent Documents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent documents</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredDocuments.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onOpen={handleOpen}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
              <FileText className="h-12 w-12 mx-auto text-muted mb-4" />
              <h3 className="font-medium mb-1">No documents yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first document to get started
              </p>
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
              <Search className="h-12 w-12 mx-auto text-muted mb-4" />
              <h3 className="font-medium mb-1">No matching documents</h3>
              <p className="text-sm text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
