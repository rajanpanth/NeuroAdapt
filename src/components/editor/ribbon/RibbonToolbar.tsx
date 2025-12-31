import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HomeTab } from './tabs/HomeTab';
import { InsertTab } from './tabs/InsertTab';
import { PageLayoutTab } from './tabs/PageLayoutTab';
import { ReferencesTab } from './tabs/ReferencesTab';
import { ReviewTab } from './tabs/ReviewTab';
import { ViewTab } from './tabs/ViewTab';

interface RibbonToolbarProps {
  editor: Editor | null;
  onToggleComments: () => void;
  onZoomChange: (zoom: number) => void;
  zoom: number;
  showRulers: boolean;
  onToggleRulers: () => void;
  pageSize: 'a4' | 'letter';
  onPageSizeChange: (size: 'a4' | 'letter') => void;
  margins: 'normal' | 'narrow' | 'wide';
  onMarginsChange: (margins: 'normal' | 'narrow' | 'wide') => void;
  orientation: 'portrait' | 'landscape';
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

export const RibbonToolbar = ({
  editor,
  onToggleComments,
  onZoomChange,
  zoom,
  showRulers,
  onToggleRulers,
  pageSize,
  onPageSizeChange,
  margins,
  onMarginsChange,
  orientation,
  onOrientationChange,
}: RibbonToolbarProps) => {
  const [activeTab, setActiveTab] = useState('home');

  if (!editor) return null;

  return (
    <div className="border-b border-border bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-9 w-full justify-start rounded-none border-b border-border bg-muted/30 px-2">
          <TabsTrigger value="home" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            Home
          </TabsTrigger>
          <TabsTrigger value="insert" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            Insert
          </TabsTrigger>
          <TabsTrigger value="page-layout" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            Page Layout
          </TabsTrigger>
          <TabsTrigger value="references" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            References
          </TabsTrigger>
          <TabsTrigger value="review" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            Review
          </TabsTrigger>
          <TabsTrigger value="view" className="text-xs px-3 py-1.5 data-[state=active]:bg-background">
            View
          </TabsTrigger>
        </TabsList>

        <div className="p-2 min-h-[80px]">
          <TabsContent value="home" className="m-0">
            <HomeTab editor={editor} />
          </TabsContent>
          <TabsContent value="insert" className="m-0">
            <InsertTab editor={editor} />
          </TabsContent>
          <TabsContent value="page-layout" className="m-0">
            <PageLayoutTab
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              margins={margins}
              onMarginsChange={onMarginsChange}
              orientation={orientation}
              onOrientationChange={onOrientationChange}
              editor={editor}
            />
          </TabsContent>
          <TabsContent value="references" className="m-0">
            <ReferencesTab editor={editor} />
          </TabsContent>
          <TabsContent value="review" className="m-0">
            <ReviewTab editor={editor} onToggleComments={onToggleComments} />
          </TabsContent>
          <TabsContent value="view" className="m-0">
            <ViewTab
              zoom={zoom}
              onZoomChange={onZoomChange}
              showRulers={showRulers}
              onToggleRulers={onToggleRulers}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
