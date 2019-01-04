import {loadAPICredentials} from '../github/auth';
export async function pull() {
  await loadAPICredentials();
  console.log('pull');
}