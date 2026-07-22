import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui';
import { AppInitializer, Layout } from '@/components/layout';
import { TitleBar } from '@/components/shared';

// Pages
import UiTesting from '@/pages/UiTesting';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ManuscriptLayout } from '@/pages/Manuscript/ManuscriptLayout';
import { ManuscriptPlanner } from '@/pages/Manuscript/ManuscriptPlanner';
import { ManuscriptOutline } from '@/pages/Manuscript/ManuscriptOutline';
import { CastLayout } from '@/pages/Cast/CastLayout';
import { ToolkitLayout } from '@/pages/Toolkit/ToolkitLayout';

import { WorldBibleLayout } from '@/pages/WorldBible/WorldBibleLayout';

function App() {
  return (
    <ToastProvider>
        <BrowserRouter>
          <TitleBar />
          <AppInitializer>
            <Routes>
              {/* App Shell Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="manuscript/editor" element={<ManuscriptLayout />} />
                <Route path="manuscript/planner" element={<ManuscriptPlanner />} />
                <Route path="manuscript/outline" element={<ManuscriptOutline />} />
                <Route path="world-bible" element={<WorldBibleLayout />} />
                <Route path="cast/:view" element={<CastLayout />} />
                <Route path="toolkit/:view" element={<ToolkitLayout />} />
              </Route>
              
              {/* Standalone Testing Page */}
              <Route path="/ui-testing" element={<UiTesting />} />
            </Routes>
          </AppInitializer>
        </BrowserRouter>
      </ToastProvider>
  );
}

export default App;
