import {loadAPICredentials} from '../github/auth';
export async function clone() {
  await loadAPICredentials();
  console.log('clone');
}