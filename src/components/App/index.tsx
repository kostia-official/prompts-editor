import React, { useState } from 'react';
import { Wrapper, Header } from './styled';
import { ImportFiles } from '../ImportFiles';
import { ExportFiles } from '../ExportFiles';
import { Editor } from '../Editor';
import { Tabs, Tab } from '@mui/material';
import { Catalog } from '../Catalog';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Wrapper>
      <Header>
        <ImportFiles />
        <ExportFiles />
      </Header>

      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
        <Tab value={0} label="Catalog" />
        <Tab value={1} label="Editor" />
      </Tabs>

      {activeTab === 0 && <Catalog />}
      {activeTab === 1 && <Editor />}
    </Wrapper>
  );
};
