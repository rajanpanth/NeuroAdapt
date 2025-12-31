import { useState, useEffect } from 'react';
import { Document } from '@/types/document';

const STORAGE_KEY = 'docs-clone-documents';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setDocuments(parsed.map((doc: Document) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      })));
    }
    setIsLoading(false);
  }, []);

  const saveToStorage = (docs: Document[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  };

  const createDocument = (): Document => {
    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: 'Untitled Document',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveToStorage(updated);
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const updated = documents.map(doc =>
      doc.id === id ? { ...doc, ...updates, updatedAt: new Date() } : doc
    );
    setDocuments(updated);
    saveToStorage(updated);
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(doc => doc.id !== id);
    setDocuments(updated);
    saveToStorage(updated);
  };

  const getDocument = (id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  };

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
  };
};
