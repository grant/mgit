import {loadAPICredentials} from '../github/auth';
export async function list() {
  console.log('Listing repos...');
  await loadAPICredentials();
}