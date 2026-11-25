import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { eyeIcon, eyeOffIcon } from './icons';

const PLUGIN_ID = 'jupyter-cell-hide-toggle:plugin';
const COMMAND_ID = 'jupyter-cell-hide-toggle:toggle-hidden';
const METADATA_KEY = 'hidden';

/**
 * Check whether the currently active cell has the `hidden` metadata flag set.
 *
 * @param notebookTracker - The notebook tracker instance
 * @returns True if the active cell's `hidden` metadata is true
 */
function isActiveCellHidden(notebookTracker: INotebookTracker): boolean {
  const activeCell = notebookTracker.activeCell;
  if (!activeCell) {
    return false;
  }
  return activeCell.model.getMetadata(METADATA_KEY) === true;
}

/**
 * Initialization data for the jupyter-cell-hide-toggle extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  description:
    'A JupyterLab extension that toggles metadata {"hidden": true/false} upon press of a button in the cell toolbar',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    const { commands } = app;

    commands.addCommand(COMMAND_ID, {
      label: 'Toggle Cell Hidden',
      caption: () =>
        isActiveCellHidden(notebookTracker) ? 'Show Cell' : 'Hide Cell',
      icon: () => (isActiveCellHidden(notebookTracker) ? eyeOffIcon : eyeIcon),
      isEnabled: () => notebookTracker.activeCell !== null,
      execute: () => {
        const activeCell = notebookTracker.activeCell;
        if (!activeCell) {
          return;
        }
        const currentlyHidden =
          activeCell.model.getMetadata(METADATA_KEY) === true;
        activeCell.model.setMetadata(METADATA_KEY, !currentlyHidden);
        commands.notifyCommandChanged(COMMAND_ID);
      }
    });

    notebookTracker.activeCellChanged.connect(() => {
      commands.notifyCommandChanged(COMMAND_ID);
    });
  }
};

export default plugin;
