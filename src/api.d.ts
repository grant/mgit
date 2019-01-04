/**
 * Type interfaces for the GitHub API
 */
interface Pager {
  /**
   * Results per page (max 100)
   */
  per_page?: number;
  /**
   * Page number of the results to fetch.
   */
  page?: number;
}