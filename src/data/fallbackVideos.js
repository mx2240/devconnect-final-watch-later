/* Built-in sample catalog, used when the live Wikimedia Commons feed is
   unreachable (offline / network failure) or when an error is simulated.
   These records point at real, well-known files on Wikimedia Commons so the
   thumbnails still load whenever the network is available. */

const thumb = (base) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${base}?width=480`

const file = (base) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${base}`

export const FALLBACK_VIDEOS = [
  {
    id: 'sample-001',
    title: 'Zooming into the southern spiral NGC 300 (ESO 1037b)',
    description:
      'A zoom animation into the southern spiral galaxy NGC 300 — a Wikimedia Commons sample video.',
    thumbnail: thumb('Zooming_into_the_southern_spiral_NGC_300_%28ESO_1037b%29.webm'),
    channel: 'Beria',
    publishedAt: '2012-12-03T17:24:47Z',
    duration: 38,
    url: file('Zooming_into_the_southern_spiral_NGC_300_%28ESO_1037b%29.webm'),
  },
  {
    id: 'sample-002',
    title: 'Falkirk Wheel Timelapse, Scotland - Diliff',
    description:
      'A timelapse of the Falkirk Wheel boat lift in Scotland — a Wikimedia Commons sample video.',
    thumbnail: thumb('Falkirk_Wheel_Timelapse%2C_Scotland_-_Diliff.webm'),
    channel: 'Diliff',
    publishedAt: '2014-07-02T11:58:16Z',
    duration: 10,
    url: file('Falkirk_Wheel_Timelapse%2C_Scotland_-_Diliff.webm'),
  },
  {
    id: 'sample-003',
    title: 'The General (1926)',
    description:
      'Buster Keaton in the classic silent film The General — a Wikimedia Commons sample video.',
    thumbnail: thumb('The_General_%281926%29.webm'),
    channel: 'Racconish',
    publishedAt: '2022-03-02T06:48:07Z',
    duration: 4552,
    url: file('The_General_%281926%29.webm'),
  },
  {
    id: 'sample-004',
    title: 'The Mystery of the Leaping Fish (1916)',
    description:
      'A silent comedy short starring Douglas Fairbanks — a Wikimedia Commons sample video.',
    thumbnail: thumb('The_Mystery_of_the_Leaping_Fish_%281916%29.webm'),
    channel: 'Racconish',
    publishedAt: '2022-10-21T18:40:10Z',
    duration: 1669,
    url: file('The_Mystery_of_the_Leaping_Fish_%281916%29.webm'),
  },
  {
    id: 'sample-005',
    title: 'National Advisory Committee for Aeronautics wind tests (1946)',
    description:
      'Historic wind-tunnel test footage of a Boeing 307 from 1946 — a Wikimedia Commons sample video.',
    thumbnail: thumb('National_Advisory_Committee_for_Aeronautics_wind_tests_%281946%29.webm'),
    channel: 'Crisco 1492',
    publishedAt: '2014-11-06T14:12:20Z',
    duration: 117,
    url: file('National_Advisory_Committee_for_Aeronautics_wind_tests_%281946%29.webm'),
  },
  {
    id: 'sample-006',
    title: 'Cyrano de Bergerac (1950)',
    description:
      'The 1950 comedy-drama starring José Ferrer — a Wikimedia Commons sample video.',
    thumbnail: thumb('Cyrano_de_Bergerac_%281950%29.webm'),
    channel: 'Racconish',
    publishedAt: '2025-02-15T12:40:10Z',
    duration: 6785,
    url: file('Cyrano_de_Bergerac_%281950%29.webm'),
  },
  {
    id: 'sample-007',
    title: 'Trefoil knot',
    description:
      'An animation of a trefoil knot rotating — a Wikimedia Commons sample video.',
    thumbnail: thumb('Trefoil_knot.webm'),
    channel: 'Rodrigo.Argenton',
    publishedAt: '2016-12-19T15:11:15Z',
    duration: 13,
    url: file('Trefoil_knot.webm'),
  },
  {
    id: 'sample-008',
    title: 'Safety Last (1923)',
    description:
      'Harold Lloyd dangles from a skyscraper clock in this silent classic — a Wikimedia Commons sample video.',
    thumbnail: thumb('Safety_Last_%281923%29.webm'),
    channel: 'Racconish',
    publishedAt: '2020-01-11T21:00:23Z',
    duration: 4362,
    url: file('Safety_Last_%281923%29.webm'),
  },
  {
    id: 'sample-009',
    title: 'Le Voyage dans la lune (black and white, 1902)',
    description:
      "Georges Méliès’ landmark silent film A Trip to the Moon — a Wikimedia Commons sample video.",
    thumbnail: thumb('Le_Voyage_dans_la_lune_%28black_and_white%2C_1902%29.webm'),
    channel: 'Racconish',
    publishedAt: '2019-05-22T16:15:02Z',
    duration: 772,
    url: file('Le_Voyage_dans_la_lune_%28black_and_white%2C_1902%29.webm'),
  },
  {
    id: 'sample-010',
    title: 'Draining the Oceans video by NASA',
    description:
      'A NASA visualization of the world’s coasts with the oceans drained — a Wikimedia Commons sample video.',
    thumbnail: thumb('Draining_the_Oceans_video_by_NASA.webm'),
    channel: 'Eatcha',
    publishedAt: '2020-02-18T18:10:37Z',
    duration: 51,
    url: file('Draining_the_Oceans_video_by_NASA.webm'),
  },
  {
    id: 'sample-011',
    title: 'Collapse of Arecibo Radio Telescope',
    description:
      'Footage of the December 2020 collapse of the Arecibo Observatory — a Wikimedia Commons sample video.',
    thumbnail: thumb('Collapse_of_Arecibo_Radio_Telescope_01.webm'),
    channel: 'Ohsin',
    publishedAt: '2020-12-03T17:09:25Z',
    duration: 46,
    url: file('Collapse_of_Arecibo_Radio_Telescope_01.webm'),
  },
  {
    id: 'sample-012',
    title: 'Dart impact replay',
    description:
      'A replay of NASA’s DART spacecraft striking the asteroid Dimorphos — a Wikimedia Commons sample video.',
    thumbnail: thumb('Dart_impact_replay.webm'),
    channel: 'Racconish',
    publishedAt: '2022-11-19T07:27:24Z',
    duration: 39,
    url: file('Dart_impact_replay.webm'),
  },
  {
    id: 'sample-013',
    title: 'Gymnothorax javanicus (by night)',
    description:
      'A giant moray eel filmed at night — a Wikimedia Commons sample video.',
    thumbnail: thumb('Gymnothorax_javanicus_%28by_night%29.webm'),
    channel: 'Ericsfr',
    publishedAt: '2015-08-13T12:01:30Z',
    duration: 24,
    url: file('Gymnothorax_javanicus_%28by_night%29.webm'),
  },
  {
    id: 'sample-014',
    title: 'FEZ trial gameplay HD',
    description:
      'Gameplay footage from the indie platformer FEZ — a Wikimedia Commons sample video.',
    thumbnail: thumb('FEZ_trial_gameplay_HD.webm'),
    channel: 'Czar',
    publishedAt: '2018-09-08T22:45:04Z',
    duration: 390,
    url: file('FEZ_trial_gameplay_HD.webm'),
  },
  {
    id: 'sample-015',
    title: 'View of the Colosseum, Rome (1914)',
    description:
      'Historic early film footage of Rome’s Colosseum — a Wikimedia Commons sample video.',
    thumbnail: thumb('View_of_the_Colosseum%2C_Rome%2C_1914.webm'),
    channel: 'Racconish',
    publishedAt: '2019-08-02T11:40:10Z',
    duration: 668,
    url: file('View_of_the_Colosseum%2C_Rome%2C_1914.webm'),
  },
]
