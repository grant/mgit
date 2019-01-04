import {loadAPICredentials} from '../github/auth';
export async function status() {
  await loadAPICredentials();
  console.log('status');
}