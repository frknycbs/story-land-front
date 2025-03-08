// StoriesContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { CategoryInfo, Story } from '../types';

interface ResourcesContextType {
  stories: Story[];
  setStories: (stories: Story[]) => void;
  categoryInfo: CategoryInfo[];
  setCategoryInfo: (categoryInfo: CategoryInfo[]) => void;
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

export const ResourcesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo[]>([]);

  return (
    <ResourcesContext.Provider value={{ stories, setStories, categoryInfo, setCategoryInfo}}>
      {children}
    </ResourcesContext.Provider>
  );
};

// Custom hook to use the context
export const useResources = () => {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};