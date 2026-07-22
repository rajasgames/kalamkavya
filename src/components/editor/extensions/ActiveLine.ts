import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const activeLinePluginKey = new PluginKey('activeLine');

export const ActiveLine = Extension.create({
  name: 'activeLine',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: activeLinePluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            const { selection, doc } = tr;
            if (!selection) return oldState;
            
            const { $from, empty } = selection;
            if (!empty) return DecorationSet.empty;

            // Only highlight if we are at least depth 1 (inside a block node)
            if ($from.depth < 1) {
              return DecorationSet.empty;
            }

            const blockNodePos = $from.before(1);
            const blockNode = $from.node(1);

            if (!blockNode || !blockNode.isBlock) {
              return DecorationSet.empty;
            }

            const deco = Decoration.node(blockNodePos, blockNodePos + blockNode.nodeSize, {
              class: 'tiptap-active-line',
            });

            return DecorationSet.create(doc, [deco]);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
