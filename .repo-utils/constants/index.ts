export const ORG = 'rapidstack';

/**
 * These are arranged in the order they should be built
 */
export const PACKAGES = [
  // 'types', // dependents: all other packages
  // 'test-utils', // dependents: all other packages
  // 'cloud', // dependents: all plugin package
  // 'lambda', // dependents: all plugin packages
  'react', // dependents: all plugin packages
  // 'create',
  // 'plugin-example',
];

// Structure pertaining to plugins:
export const PLUGIN_DIRS = ['cloud', 'lambda', 'react', 'assets'];
export const PLUGIN_ASSET_DIRS = ['static-sites', 'lambda-functions', 'lambda-edge-functions', 'cloudfront-functions'];
