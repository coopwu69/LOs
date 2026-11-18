// Short id of the deployed commit, printed on exported documents so anyone can
// tell at a glance which release produced a file ("local" outside Vercel).
export const BUILD_ID = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);
