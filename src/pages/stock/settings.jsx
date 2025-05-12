import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategorieManager from '@/composants/stock/CategorieManager';
import TypeManager from '@/composants/stock/TypeManager';
import SourceManager from '@/composants/stock/SourceManager';
import ReferenceManager from '@/composants/stock/ReferenceManager';

export default function StockSettings() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Paramètres du stock</h1>
      
      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="references">Références</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategorieManager />
        </TabsContent>

        <TabsContent value="types">
          <TypeManager />
        </TabsContent>

        <TabsContent value="sources">
          <SourceManager />
        </TabsContent>

        <TabsContent value="references">
          <ReferenceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
