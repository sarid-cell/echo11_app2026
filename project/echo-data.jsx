// ECHO.11 — content data
const IMG = {
  hero: 'https://echo-11-site.vercel.app/hero.png',
  astroOpen: 'https://echo-11-site.vercel.app/astro-eyes-open.png',
  astroClosed: 'https://echo-11-site.vercel.app/astro-eyes-closed.png',
  ghost: 'https://echo-11-site.vercel.app/ghost-machine.png',
  tools: 'https://echo-11-site.vercel.app/unlimited-tools.png',
};

const ARTICLES = [
  {
    id: 'ghost',
    badge: 'New',
    kicker: 'Essay',
    title: 'The Ghost in the Machine: Botox, AI, and the Augmented Authenticity Paradox',
    dek: 'Why Using AI Feels Like Cheating — even When It Isn\u2019t.',
    img: IMG.ghost,
    read: '7 min',
    url: 'https://substack.com/home/post/p-186104472',
    body: [
      'We have a strange relationship with enhancement. We accept the contoured cheekbone, the whitened smile, the filtered photograph \u2014 yet the moment a sentence is shaped by a model, something in us recoils. It feels like cheating. But cheating against what, exactly?',
      'Authenticity was never the absence of tools. It was the presence of intention. The painter\u2019s brush, the writer\u2019s thesaurus, the surgeon\u2019s scalpel \u2014 each is a mediator between the self we are and the self we mean to project. AI is only the newest, and the most uncanny, member of that lineage.',
      'The discomfort is real, but it is not moral. It is perceptual. We are watching the boundary between the made and the born dissolve in real time, and the vertigo of that dissolve is what we have mistaken for guilt.',
    ],
    quote: 'Authenticity was never the absence of tools. It was the presence of intention.',
  },
  {
    id: 'tools',
    badge: null,
    kicker: 'Essay',
    title: 'AI Gave Us Unlimited Tools. So Why Are We Still Stuck?',
    dek: 'Because belief, not technology, has become the real bottleneck in decision-making, growth, and identity.',
    img: IMG.tools,
    read: '6 min',
    url: 'https://substack.com/home/post/p-186866209',
    body: [
      'For the first time in history, the constraint is no longer capability. Anyone can generate, draft, design, ship. The cost of making has collapsed to nearly zero. And yet \u2014 paralysis. More options, less movement.',
      'The bottleneck moved. It used to live in our hands; now it lives in our heads. When everything is possible, the scarce resource is not skill but conviction \u2014 the willingness to choose one signal and silence the rest.',
      'Growth in 2026 is not a tooling problem. It is a belief problem. The people who win are not the ones with the best model. They are the ones who trust themselves enough to commit.',
    ],
    quote: 'When everything is possible, the scarce resource is not skill but conviction.',
  },
  {
    id: 'signal',
    badge: null,
    kicker: 'Field Note',
    title: 'The Attention Economy Is Eating Its Young',
    dek: 'We optimized for the click and forgot we were training humans to scroll past meaning.',
    img: IMG.hero,
    read: '4 min',
    url: 'https://shirasarid.substack.com/',
    body: [
      'Every interface is a teacher. It rewards some behaviors and punishes others, and over time it shapes the people who use it. We built machines to capture attention and were surprised when attention became the thing that broke.',
      'The next decade of design is a decade of repair \u2014 building digital spaces that return something to the people who enter them, instead of only extracting.',
    ],
    quote: 'Every interface is a teacher.',
  },
  {
    id: 'human',
    badge: null,
    kicker: 'Essay',
    title: 'The Human Edge: Intuition as Infrastructure',
    dek: 'Technology is code; intuition is the spark. What happens when we treat the gut as a system worth engineering?',
    img: IMG.astroOpen,
    read: '5 min',
    url: 'https://shirasarid.substack.com/',
    body: [
      'We have spent a century trying to make intuition obsolete \u2014 to replace the hunch with the dashboard. But the best operators have never stopped trusting the signal beneath the data.',
      'Intuition is not the opposite of analysis. It is compressed analysis \u2014 thousands of prior observations collapsed into a single felt sense. The future belongs to those who can move fluidly between the two.',
    ],
    quote: 'Intuition is compressed analysis \u2014 a felt sense built from thousands of observations.',
  },
];

const EPISODES = [
  { n: '01', title: 'The Belief Bottleneck', guest: 'Solo', dur: '38:12', art: IMG.astroClosed },
  { n: '02', title: 'Decoding the Noise: Psychology Meets GenAI', guest: 'Solo', dur: '44:51', art: IMG.tools },
  { n: '03', title: 'Augmented Authenticity', guest: 'Solo', dur: '41:07', art: IMG.ghost },
  { n: '04', title: 'Women, Tech, and the Creative Playground', guest: 'Solo', dur: '36:29', art: IMG.astroOpen },
];

const PILLARS = [
  { n: '01', h: 'The Human Edge', p: 'Technology is code; intuition is the spark. We empower women to lead the revolution, turning \u201Ccomplex\u201D tech into a creative playground.' },
  { n: '02', h: 'Generative AI', p: 'We leverage algorithms to decode the noise \u2014 using AI not just to create content, but to curate precision and focus for the neurodivergent mind.' },
  { n: '03', h: 'Future-Proof Strategy', p: 'Algorithms change daily, but human nature remains. We fuse consumer psychology with GenAI to build resilient narratives for 2026.' },
];

const SOCIALS = [
  { label: 'Substack', sub: 'Fresh insights, weekly', url: 'https://shirasarid.substack.com/' },
  { label: 'LinkedIn', sub: 'in/shirasarid', url: 'https://linkedin.com/in/shirasarid' },
  { label: 'Instagram', sub: '@shira.sarid', url: 'https://instagram.com/shira.sarid' },
  { label: 'Apple Podcasts', sub: 'CTRL+HUMAN', url: 'https://podcasts.apple.com/us/podcast/ctrl-human-is-a-podcast-created-by-shira-sarid/id1812866120' },
  { label: 'Pinterest', sub: 'shirasarid', url: 'https://pinterest.com/shirasarid' },
];

Object.assign(window, { IMG, ARTICLES, EPISODES, PILLARS, SOCIALS });
