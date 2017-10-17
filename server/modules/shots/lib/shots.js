import db from '../../../database/client.js';

async function setUserLike(userId, shotId, shotUrl) {
  db.one(`
    INSERT INTO user_shots_likes
    (shot_id, shot_url, user_id)
    VALUES
    ($1, $2, $3)
    RETURNING shot_id, user_id`, [
      shotId,
      shotUrl,
      userId,
    ]);
}

async function removeUserLike(userId, shotId) {
  db.one(`
    DELETE FROM user_shots_likes WHERE user_id = $1 and shot_id = $2
    RETURNING shot_id, user_id`, [
      userId, shotId,
    ]);
}

async function increaseLikeCount(shotId) {
  await db.one(`
    UPDATE shots
    SET likes_count = likes_count + 1
    WHERE id = $1
    RETURNING likes_count
    `, shotId);
}

async function decreaseLikeCount(shotId) {
  await db.one(`
    UPDATE shots
    SET likes_count = likes_count - 1
    WHERE id = $1
    RETURNING likes_count
    `, shotId);
}

async function increaseViewCount(shotId) {
  await db.one(`
    UPDATE shots
    SET views_count = views_count + 1
    WHERE id = $1
    RETURNING views_count
    `, shotId);
}

async function loadShotForUser(shotUrl, userId) {
  const shot = await db.oneOrNone(`
    SELECT
      s.id,
      s.user_id,
      s.created,
      s.title,
      s.description,
      a.game_id,
      s.army_id,
      s.bucket_id,
      s.url,
      s.image,
      s.attachments,
      s.likes_count,
      s.views_count,
      u.username,
      l.liked
     FROM shots as s
     LEFT JOIN users as u ON u.id = s.user_id
     LEFT JOIN user_shots_likes as l
      ON l.shot_url = s.url AND l.user_id = $1
     LEFT JOIN armies as a ON (a.id = s.army_id)
     WHERE s.url = $2
  `, [
    userId,
    shotUrl,
  ]);

  return shot;
}

async function loadShot(shotUrl) {
  const shot = await db.oneOrNone(`
    SELECT
      s.id,
      s.user_id,
      s.created,
      s.title,
      s.description,
      a.game_id,
      s.army_id,
      s.bucket_id,
      s.url,
      s.image,
      s.attachments,
      s.likes_count,
      s.views_count,
      u.username
     FROM shots as s
     LEFT JOIN users as u ON u.id = s.user_id
     LEFT JOIN armies as a ON (a.id = s.army_id)
     WHERE s.url = $1
  `, [
    shotUrl,
  ]);

  return shot;
}

async function loadMoreByUser(userId, skipUrl) {
  const shots = await db.any(`
    SELECT url, image FROM shots WHERE user_id = $1 AND url <> $2 LIMIT 4
  `, [
    userId,
    skipUrl,
  ]);

  return shots;
}

async function getGames() {
  const data = await db.many(
    `SELECT
      armies.id as army_id,
      game_id,
      armies.name as army_name,
      games.name as game_name
    FROM armies, games
    WHERE games.id = armies.game_id
    ORDER BY games.id DESC`);

  const games = [];
  let game = {};

  data.forEach((row) => {
    if (game.id !== row.game_id) {
      if ({}.hasOwnProperty.call(game, 'id')) {
        games.push(game);
      }

      game = {
        id: row.game_id,
        name: row.game_name,
        armies: [],
      };
    }

    game.armies.push({
      id: row.army_id,
      name: row.army_name,
    });
  });

  games.push(game);

  return games;
}

module.exports = {
  getGames,
  loadShotForUser,
  loadMoreByUser,
  increaseViewCount,
  setUserLike,
  removeUserLike,
  loadShot,
  increaseLikeCount,
  decreaseLikeCount,
};
