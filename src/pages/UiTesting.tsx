import { useEffect, useState } from 'react';
import { Button, Input, Textarea, Select, Checkbox, Label, FormField, Card, BentoBox, Modal, ConfirmModal, useModal, useToast, Drawer, useDrawer } from '@/components/ui';
import { Settings } from 'lucide-react';

export function UiTesting() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const standardModal = useModal();
  const deleteModal = useModal();
  const aiDrawer = useDrawer();
  const { showToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div id="main-content" className="min-h-screen bg-base text-primary p-8 transition-colors duration-300 transition-[filter] ease-out">
      <header className="flex items-center justify-between border-b border-subtle pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-primary">कalam काvya Engine</h1>
          <p className="text-secondary mt-2">Design Token System Test Page</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={aiDrawer.open}
            className="px-6 py-2 rounded border border-subtle bg-surface hover:bg-elevated text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-from/50"
          >
            Open Ghostwriter
          </button>
          <button
            onClick={toggleTheme}
            className="px-6 py-2 rounded border border-subtle bg-surface hover:bg-elevated text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-from/50"
          >
            Toggle Theme: {theme === 'light' ? 'Parchment' : 'Midnight'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl">
        {/* Typography Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Typography</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-ghost text-sm mb-1">Serif (Crimson Pro)</p>
              <p className="font-serif text-3xl">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p className="text-ghost text-sm mb-1">Sans (Inter)</p>
              <p className="font-sans text-xl">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p className="text-ghost text-sm mb-1">Handwriting (Caveat)</p>
              <p className="font-hand text-3xl">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p className="text-ghost text-sm mb-1">Mono (JetBrains Mono)</p>
              <p className="font-mono text-sm">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Color Palette</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Backgrounds */}
            <div className="space-y-2">
              <div className="h-16 rounded border border-subtle bg-base flex items-center justify-center">Base</div>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded border border-subtle bg-surface flex items-center justify-center">Surface</div>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded border border-subtle shadow-md bg-elevated flex items-center justify-center">Elevated</div>
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-3">
              <div className="h-16 rounded border border-subtle bg-glass backdrop-blur-sm flex items-center justify-center bg-checkered">
                Glass (Overlay)
              </div>
            </div>

            {/* Texts */}
            <div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-surface rounded border border-subtle text-center text-primary">Primary Text</div>
              <div className="p-3 bg-surface rounded border border-subtle text-center text-secondary">Secondary Text</div>
              <div className="p-3 bg-surface rounded border border-subtle text-center text-ghost">Ghost Text</div>
            </div>

            {/* Accents */}
            <div className="col-span-2 sm:col-span-3 grid grid-cols-3 gap-4 mt-4 text-white font-medium">
              <div className="h-16 rounded bg-amber-grad shadow-lg flex items-center justify-center shadow-[var(--amber-glow)]">
                Amber Grad
              </div>
              <div className="h-16 rounded bg-sage flex items-center justify-center">
                Sage
              </div>
              <div className="h-16 rounded bg-destructive flex items-center justify-center">
                Clay
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Buttons</h2>
          
          <div className="flex flex-wrap items-end gap-6">
            <div className="space-y-4">
              <p className="text-sm text-ghost font-mono">Primary</p>
              <div className="flex items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-ghost font-mono">Ghost</p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-ghost font-mono">Destructive</p>
              <div className="flex items-center gap-4">
                <Button variant="destructive" size="sm">Small</Button>
                <Button variant="destructive" size="md">Medium</Button>
                <Button variant="destructive" size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-ghost font-mono">States</p>
              <div className="flex items-center gap-4">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button icon={<span>✨</span>}>With Icon</Button>
              </div>
            </div>
          </div>
        </section>
        {/* Form Fields Section */}
        <section className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FormField id="test-input" label="Standard Input">
                <Input placeholder="Enter something..." />
              </FormField>

              <FormField id="test-input-error" label="Input with Error" error="This field is required.">
                <Input placeholder="Error state" defaultValue="Invalid data" />
              </FormField>

              <FormField id="test-textarea" label="Textarea (Auto-resize)">
                <Textarea placeholder="Type a long text here..." autoResize />
              </FormField>
            </div>

            <div className="space-y-6">
              <FormField id="test-select" label="Select Dropdown">
                <Select
                  options={[
                    { value: 'fantasy', label: 'High Fantasy' },
                    { value: 'scifi', label: 'Hard Sci-Fi' },
                    { value: 'mystery', label: 'Cozy Mystery' },
                  ]}
                />
              </FormField>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="indeterminate" checked="indeterminate" />
                <Label htmlFor="indeterminate">Indeterminate state</Label>
              </div>

              <div className="pt-4 space-y-2">
                <Label>Prose Inputs (For Editor)</Label>
                <div className="p-4 bg-surface rounded-lg">
                  <Input variant="prose" placeholder="Prose Title..." defaultValue="Chapter 1" className="text-xl font-serif font-bold" />
                  <Textarea variant="prose" placeholder="Prose Body..." defaultValue="It was a dark and stormy night..." className="mt-2" autoResize />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards & BentoBox Section */}
        <section className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Cards & BentoBox</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card hoverable className="col-span-1 md:col-span-1">
              <h3 className="text-lg font-serif font-semibold text-primary mb-2">Standard Card</h3>
              <p className="text-sm text-secondary">
                This card has the "Quick Resume" hover effect. Notice the lift and amber border glow.
              </p>
            </Card>

            <BentoBox 
              title="Character Details" 
              subtitle="Elara Vance"
              icon={<Settings size={18} />}
              actions={<Button size="sm" variant="ghost">Edit Profile</Button>}
              hoverable
              className="col-span-1 md:col-span-2"
            >
              <div className="py-2 text-sm text-secondary">
                <p>Status: Active | Faction: The Remnant</p>
                <p className="mt-2 text-primary">Elara is a quick-witted scout who navigates the ancient ruins with ease.</p>
              </div>
            </BentoBox>

            <BentoBox 
              variant="compact"
              title="Compact Module" 
              hoverable
              className="col-span-1 md:col-span-1"
            >
              <p className="text-xs text-secondary mt-1">Used for small grid cells in the cast matrix.</p>
            </BentoBox>

            <Card variant="glass" className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-serif font-semibold text-primary mb-2">Glassmorphic Card</h3>
              <p className="text-sm text-secondary">
                Used for overlays, AI drawer components, and floating panels.
              </p>
            </Card>

          </div>
        </section>

        {/* Modals & Dialogs Section */}
        <section className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-2xl font-sans font-semibold border-b border-subtle pb-2">Modals, Dialogs & Toasts</h2>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => standardModal.open()}>Open Standard Modal</Button>
            <Button variant="destructive" onClick={() => deleteModal.open()}>Open Destructive Confirm</Button>
            
            <div className="w-full h-px bg-subtle my-2" />
            
            <Button onClick={() => showToast('Entity saved successfully.', 'success')}>Success Toast</Button>
            <Button onClick={() => showToast('Rate Limited: Waiting for provider...', 'warning')} className="bg-amber-from hover:bg-amber-to text-white">Warning Toast</Button>
            <Button variant="destructive" onClick={() => showToast('Network Error: Cannot reach local AI.', 'error')}>Error Toast</Button>
          </div>
        </section>
      </div>

      <Modal 
        isOpen={standardModal.isOpen} 
        onClose={standardModal.close}
        title="Welcome to कalam काvya"
        description="This is a standard modal dialog. It uses the custom 'animate-modal-content' keyframes and dims the background with a backdrop blur."
      >
        <div className="space-y-4 py-4">
          <p className="text-sm text-primary">You can embed any arbitrary content here.</p>
          <div className="flex justify-end gap-2 mt-6 border-t border-subtle pt-4">
            <Button onClick={standardModal.close}>Got it</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete Character?"
        message="Are you sure you want to delete Elara Vance? This action cannot be undone and will permanently remove her from the cast database."
        confirmLabel="Delete"
        isDestructive
        onConfirm={async () => {
          await new Promise(resolve => setTimeout(resolve, 800)); // simulate network
          console.log("Deleted");
        }}
      />

      <Drawer isOpen={aiDrawer.isOpen} onClose={aiDrawer.close} width="450px">
        <Drawer.Header title="Ghostwriter AI" />
        <Drawer.Body className="space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-subtle">
            <p className="text-sm text-secondary">
              The AI ghostwriter analyzes the current document and world facts to propose text continuations, summarize chapters, or brainstorm ideas.
            </p>
          </div>
          <FormField id="prompt" label="Prompt">
            <Textarea placeholder="Ask Ghostwriter..." className="min-h-[120px]" />
          </FormField>
        </Drawer.Body>
        <Drawer.Footer className="flex justify-end gap-3">
          <Button variant="ghost" onClick={aiDrawer.close}>Cancel</Button>
          <Button>Generate</Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
}

export default UiTesting;
