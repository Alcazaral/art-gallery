import db from '../../../database/client';

const squel = require('squel').useFlavour('postgres');

const debug = require('debug')('app:api:shots:model');

async function get({
  userId,
  gameId,
  armyId,
  time,
  sort = 'most_likes',
  offset = 0,
  limit = 30,
}) {
  const query = squel.select()
    .field('s.id')
    .field('s.user_id')
    .field('s.created')
    .field('s.title')
    .field('s.description')
    // .field('a.game_id')
    .field('s.army_id')
    .field('s.bucket_id')
    .field('s.url')
    .field('s.image')
    .field('s.attachments')
    .field('s.likes_count')
    .field('s.views_count')
    .field('u.username')
    .field('u.image as user_image')
    .from('shots as s')
    .left_join('users', 'u', 'u.id = s.user_id')
    .left_join('armies', 'a', 'a.id = s.army_id')
    .offset(offset)
    .limit(limit);

  if (userId) {
    query
    .left_join('user_shots_likes', 'l', 'l.shot_url = s.url AND l.user_id = $1')
    .field('l.liked');
  }

  if (gameId) {
    query.where('s.game_id = $2');
  }

  if (armyId) {
    query.where('s.army_id = $3');
  }

  if (time) {
    query.where(`s.created > (localtimestamp - interval '$4 days')`);
  }

  switch (sort) {
    case 'most_recent':
      query.order('s.created', false);
      break;
    case 'least_recent':
      query.order('s.created', true);
      break;
    case 'most_likes':
      query.order('s.likes_count', false);
      break;
    case 'least_likes':
      query.order('s.likes_count', true);
      break;
    default:
      throw new Error('Invalid sort option');
  }

  query.order('s.id', false);

  debug(query.toString());

  const shots = await db.any(query.toString(), [
    userId,
    gameId,
    armyId,
    time,
  ]);

  return shots;
}

async function search({ userId, textQuery, offset = 0, limit = 30 }) {
  const query = squel.select()
    .field('s_u.id')
    .field('s_u.user_id')
    .field('s_u.created')
    .field('s_u.title')
    .field('s_u.description')
    .field('a.game_id')
    .field('s_u.army_id')
    .field('s_u.bucket_id')
    .field('s_u.url')
    .field('s_u.image')
    .field('s_u.attachments')
    .field('s_u.likes_count')
    .field('s_u.views_count')
    .field('s_u.username')
    .field('s_u.user_image')
    .from('search_index as s_u')
    .left_join('armies', 'a', 'a.id = s_u.army_id')
    .where('s_u.document @@ to_tsquery($1)')
    .where('ts_rank(s_u.document, to_tsquery($1)) > 0')
    .order('ts_rank(s_u.document, to_tsquery($1))', false)
    .order('s_u.created', false)
    .offset(offset)
    .limit(limit);

  if (userId) {
    query
    .left_join('user_shots_likes', 'l',
      'l.shot_url = s_u.url AND l.user_id = $2')
    .field('l.liked');
  }

  debug(query.toString());

  const shots = await db.any(query.toString(), [
    textQuery,
    userId,
  ]);

  return shots;
}

module.exports = { get, search };
