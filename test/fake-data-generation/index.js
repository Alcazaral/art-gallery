
// *********************** CONNECT TO DB ***********************

const options = {
  error: function onDbError(err, e) {
    console.error('DB client error: ', err.message);
  },
};
const pgp = require('pg-promise')(options);
const db = pgp({
  host: 'database', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'rubylens',
  user: 'rubylens',
  password: 'changethis',
});

// *********************** Generate all the stuff ***********************

const chance = require('chance').Chance();
const _ = require('lodash');
const shortId = require('shortid');

const shotImages = [
  'B1JpPNBTx-ORC.jpg',
  'Hy4fOESpe-Ork_icon.png',
  'Hkw7ONrpg-Orks_Icon.png',
  'S1iV_NH6g-paintings-sacred-digital-art-science-fiction-sisters-of-battle-airbrushed-adeptus-sororitas-2250x_wallpaperbeautiful_82.jpg',
  'ryaLdNB6g-THE_EMPEROR__S_FINEST_by_kingmong.jpg',
  'rkid_Nrae-vengeance___warhammer_40_000__conquest_by_jubjubjedi-d8mkppx.jpg',
  'S1y5dEHag-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  'HJrj_4rTg-warhammer_40_000__space_marine_by_jjcool87-d4du7f7.png',
  'HJi3uNBpx-warhammer_40_000_champion_of_chaos_undivided_by_pavel_sokov-d6758if.jpg',
  'Bkia_VHTg-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg',
];

const userImages = [
  '224c13f0-64af-4c29-b8be-9080647282be.JPEG',
  '858525f9-9823-433e-93dd-27298eaa1102.JPEG',
  '77be3aeb-02c9-4bf4-8194-32cbb31b708a.JPEG',
  '2c7e9c49-ded6-45e1-9c79-21c5d8a7e257.JPEG',
  'b071c72c-f514-423d-a8b5-c806e2b2776b.PNG',
  '242454f2-96a8-4e0e-811b-757791724c18.PNG',
  'a0e3254b-a5c8-45ea-9495-b66b8957e6c6.PNG',
  'df888d6e-6245-44be-9ac5-9e3a861c95c4.PNG',
  '5f4a91da-fb34-4622-9d19-85e943761bc3.PNG',
  '3ed3f97e-79c5-4fdb-b9b6-a4f246700ad7.PNG',
  '81dfa7f6-06d4-4190-aae7-ca3057401032.JPEG',
];

const usersInfo = userImages.reduce((acc, image) => {
  acc.push({
    username: chance.name(),
    image,
    email: chance.email(),
    location: `${chance.city()} ${chance.country()}`,
    role: 'member',
    register_step: 'registered',
    register_mode: 'email',
    pass_digest: '$2a$10$1l2XFwywAPwCUvXka19j9Osrn/AwKuilG0W9YFeA6PPqmwFblbUw2',
  });
  return acc;
}, []);

const usersCs = new pgp.helpers.ColumnSet([
  'username',
  'image',
  'email',
  'location',
  'role',
  'register_step',
  'register_mode',
  'pass_digest'],
  { table: 'users' });

const usersQuery = pgp.helpers.insert(usersInfo, usersCs) + 'RETURNING *';

let users;
db.any(usersQuery)
  .then(usersRes => {
    users = usersRes;
    console.log('users created!', usersRes);

    const buckets = usersRes.reduce((acc, user) => {
      acc.push({
        user_id: user.id,
        name: 'default',
      });
      return acc;
    }, []);

    const bucketsCs = new pgp.helpers.ColumnSet([
      'user_id',
      'name'],
      { table: 'buckets' });

    const bucketsQuery = pgp.helpers.insert(buckets, bucketsCs) + 'RETURNING *';

    return db.any(bucketsQuery);
  })
  .then(buckets => {
    console.log('default buckets created', buckets);

    const shots = [];
    for (const user of users) {
      const bucket = _.find(buckets, ['user_id', user.id]);
      for (let i = 0; i < 1000; i++) {
        for (const shotImage of shotImages) {
          shots.push({
            user_id: user.id,
            title: chance.sentence({ words: 5 }),
            description: chance.paragraph(),
            army_id: chance.integer({ min: 1, max: 113 }),
            bucket_id: bucket.id,
            url: `${shortId.generate()}-${chance.word()}`,
            image: shotImage,
            attachments: '{}',
            views_count: chance.integer({ min: 0, max: 10000 }),
            likes_count: chance.integer({ min: 0, max: 10000 }),
          });
        }
      }
    }

    const shotsCs = new pgp.helpers.ColumnSet([
      'user_id',
      'title',
      'description',
      'army_id',
      'bucket_id',
      'url',
      'image',
      'attachments',
      'views_count',
      'likes_count'],
      { table: 'shots' });

    const shotsQuery = pgp.helpers.insert(shots, shotsCs) + 'RETURNING *';

    return db.any(shotsQuery);
  })
  .then(shots => {
    console.log('========== SHOTS ========== ');
    console.log(shots);
  })
  .catch(error => {
    console.log('error creating users', error);
  });
