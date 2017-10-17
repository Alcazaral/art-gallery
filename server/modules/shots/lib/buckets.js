import db from '../../../database/client.js';

const DEFAULT_BUCKET_NAME = "default";

export async function createBucket(userId, name) {
  name = name || DEFAULT_BUCKET_NAME;

  const bucket = await db.one(`
    INSERT INTO buckets (user_id, name)
    VALUES($1, $2)
    RETURNING id, name`,
    [
      userId,
      name,
    ],
  );

  return bucket;
}

export async function getDefaultBucket(userId) {
  let bucket = await db.oneOrNone(
    `SELECT id, name FROM buckets WHERE user_id = $1 and name = $2 LIMIT 1`,
    [
      userId,
      DEFAULT_BUCKET_NAME,
    ],
  );

  if (!bucket) {
    bucket = await createBucket(userId);
  }

  return bucket;
}
