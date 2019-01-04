import {loadAPICredentials} from '../github/auth';
export async function push() {
  await loadAPICredentials();
  console.log('push');
}