import cron from 'node-cron';

import { deleteDisabledWorkspaces } from './jobs/delete-disabled-workspaces';

cron.schedule('0 0 * * *', deleteDisabledWorkspaces); // every day at 00:00
