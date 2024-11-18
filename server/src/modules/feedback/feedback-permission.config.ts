import { TPermission } from 'src/types/permission.type';

export const FeedbackPermissionsList: TPermission[] = [
  {
    permission_name: 'feedback-create',
    description: 'Create feedback',
  },
  {
    permission_name: 'feedback-read',
    description: 'Read feedback',
  },
  {
    permission_name: 'feedback-update',
    description: 'Update feedback',
  },
  {
    permission_name: 'feedback-delete',
    description: 'Delete feedback',
  },
];
