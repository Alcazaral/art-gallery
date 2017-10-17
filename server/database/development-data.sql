
INSERT INTO users (
  id,
  username,
  email,
  location,
  role,
  register_step,
  register_mode,
  pass_digest
)
VALUES
(1000000, 'Johnny', 'Johnny@email.com', 'UK', 'member', 'registered', 'email', '$2a$10$1l2XFwywAPwCUvXka19j9Osrn/AwKuilG0W9YFeA6PPqmwFblbUw2'),
(1000001, 'nid_warrior', 'nid_warrior@email.com', 'Birmingham, UK', 'member', 'registered', 'email', '$2a$10$1l2XFwywAPwCUvXka19j9Osrn/AwKuilG0W9YFeA6PPqmwFblbUw2'),
(1000002, 'taupainter22', 'taupainter22@email.com', 'Leeds, UK', 'member', 'registered', 'email', '$2a$10$1l2XFwywAPwCUvXka19j9Osrn/AwKuilG0W9YFeA6PPqmwFblbUw2');

INSERT INTO buckets (id, user_id, name)
VALUES
(1000000, 1000000, 'default'),
(1000001, 1000001, 'default'),
(1000002, 1000002, 'default');

INSERT INTO shots (
  user_id,
  title,
  description,
  army_id,
  bucket_id,
  url,
  image,
  attachments
)
VALUES
(
  1000000,
  'My awesome design',
  'my awesome description',
  28,
  1000000,
  'ryabi232e3g-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000000,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000000,
  'Sy0bo2l3x-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000000,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000000,
  'BJVLz6g2l-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000000,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000000,
  'B1HvMTe2g-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000000,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000000,
  'r1WuzTx3x-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000001,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000001,
  'r1WuATx3x2-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000001,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000001,
  'rk1YM6lnx-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000001,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000001,
  'rJ_Fzaxhx-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000001,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000001,
  'r1Q5dzTl3l-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000001,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000001,
  'H165fTene-my-awesome-design',
  'ByxxV0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000002,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000002,
  'BkCjz6lnl-my-awesome-design',
  'ByxxVj0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000002,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000002,
  'S1FhjMpx3x-my-awesome-design',
  'ByxxVj0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000002,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000002,
  'HyLpGhTlng-my-awesome-design',
  'ByxxVh0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000002,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000002,
  'Sy10zhpxnl-my-awesome-design',
  'ByxxhVd0xne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
),
(
  1000002,
  'My awesome design',
  'my awesome description',
  1,
  28,
  1000002,
  'Hkw0fd6ghe-my-awesome-design',
  'ByxxVdxne-warhammer_40_000__conquest___gift_of_isha_by_jbcasacop-d7wqeem.jpg',
  '{"SkRpYnx2g-warhammer_40k_conquest___suffering_by_corbella-d8t2r2u.jpg"}'
);
