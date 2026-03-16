// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  if (!locals.user || locals.user.role !== 'admin') {
    error(403, 'Forbidden');
  }
  return { user: locals.user };
};
