import { memberHandlers } from './members';
import { projectHandlers } from './projects';
import { studyHandlers } from './study';
import { activityHandlers } from './activities';
import { statsHandlers } from './stats';

export const handlers = [
  ...memberHandlers,
  ...projectHandlers,
  ...studyHandlers,
  ...activityHandlers,
  ...statsHandlers,
];
