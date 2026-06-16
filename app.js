/* =====================================================================
   AJ Curry — Portfolio
   Content (verbatim from ajcurry.com) + interactions.
   Rendered data-driven so the copy lives in one place and stays exact.
   ===================================================================== */
(() => {
  'use strict';

  /* ---------- tiny DOM helper (textContent-safe for all glyphs) ---------- */
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(c => c && n.appendChild(c));
    return n;
  };

  /* ============================== DATA ============================== */

  // em → emphasized (ink, 600); plain → body. Mirrors the design's segments.
  const E = (t) => ({ t, em: true });
  const T = (t) => ({ t, em: false });

  const highlights = [
    { n: '01', icon: 'award', segs: [T('Winner of the '), E('2019 Emmy Award'), T(' for Outstanding Trans-Media Sports Coverage')] },
    { n: '02', icon: 'gem', segs: [T('Was a lead on the team that launched the '), E('officially licensed NFT product'), T(', NFL ALL DAY')] },
    { n: '03', icon: 'star', segs: [T('Named to The Athletic’s NFL '), E('40 Under 40'), T(' List')] },
    { n: '04', icon: 'tv', segs: [E('Produced a national commercial'), T(' for the NFL which aired across primetime games')] },
    { n: '05', icon: 'music', segs: [T('Helped lead the first ever music partnership to '), E('bring Quavo to NBA Top Shot')] },
    { n: '06', icon: 'video', segs: [T('Conceptualized and produced the '), E('NFL’s Showtime Cam'), T(', sponsored by Twitter and Bud Light, which won the Clio grand award for best in Social Media')] },
    { n: '07', icon: 'grid', segs: [T('Created the '), E('NFL’s first-ever Emerging Platforms team'), T(' to manage’s the NFL’s social presence on new, Gen-Z focused channels')] },
    { n: '08', icon: 'mic', segs: [T('Featured speaker and panelist at '), E('SXSW, NFL Network’s Total Access, Twitter’s Sports Summit'), T(', and more.')] },
    { n: '09', icon: 'broadcast', segs: [T('Served as a lead producer for the NFL’s first-ever Draft-A-Thon livestream, contributing to the '), E('100M raised by the NFL for COVID relief')] },
    { n: '10', icon: 'sparkle', segs: [T('Helped '), E('print tweets on Super Bowl confetti'), T(' in partnership with Twitter')] },
    { n: '11', icon: 'users', segs: [T('Led the '), E('community strategy across products'), T(' for Dapper Labs')] },
    { n: '12', icon: 'play', segs: [E('Taught the Commissioner'), T(' the Toosie Slide which he debuted on the NFL’s TikTok account')] }
  ];

  // Simple stroke icons (24×24) for each highlight.
  const _svg = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const ICONS = {
    award: _svg('<circle cx="12" cy="8" r="5"/><path d="M8.5 12.6 7 21l5-3 5 3-1.5-8.4"/>'),
    gem: _svg('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18"/><path d="M8.5 3 7 9l5 12 5-12-1.5-6"/>'),
    star: _svg('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19l1-5.8L3.5 9.2l5.9-.9z"/>'),
    tv: _svg('<rect x="2" y="6.5" width="20" height="13" rx="2"/><path d="m8 22 4-3 4 3"/><path d="M3 6.5 7.5 2M21 6.5 16.5 2"/>'),
    music: _svg('<path d="M9 18V5l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="15" r="3"/>'),
    video: _svg('<path d="m16 9 5-3v12l-5-3"/><rect x="2" y="6" width="14" height="12" rx="2"/>'),
    grid: _svg('<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>'),
    mic: _svg('<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/>'),
    broadcast: _svg('<circle cx="12" cy="12" r="2"/><path d="M16.5 7.5a6 6 0 0 1 0 9M7.5 16.5a6 6 0 0 1 0-9M19.5 4.5a10 10 0 0 1 0 15M4.5 19.5a10 10 0 0 1 0-15"/>'),
    sparkle: _svg('<path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2"/>'),
    users: _svg('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M20.5 20a5.6 5.6 0 0 0-4-5.4"/>'),
    play: _svg('<circle cx="12" cy="12" r="9"/><path d="M10 8.4 16 12l-6 3.6z"/>')
  };

  const roles = [
    { dates: 'Jan 2025 — Present', title: 'Vice President, Social Content', org: 'Fiume Capital', desc: 'Elevated to Vice President with a key focus on Thrill Sports and its properties, Power Slap, Nitro Circus, and Street League Skateboarding, overseeing the marketing, social, and content teams.' },
    { dates: 'Apr 2023 — Jan 2025', title: 'Sr Director, Social Content Strategy', org: 'Fiume Capital', desc: 'Served as the lead social, marketing, influencer, and content operating partner for the entire Fiume Capital portfolio.' },
    { dates: 'May 2021 — Apr 2023', title: 'Marketing / Community Lead', org: 'Dapper Labs', desc: 'Oversaw development, marketing, athlete engagement, and community growth of the NFL’s flagship product with Dapper.' },
    { dates: 'May 2019 — May 2021', title: 'Senior Manager, Social Content', org: 'NFL', desc: 'Led cross-platform social innovation and tentpole content activations for the NFL, launching new channels, campaigns, and creator programs to drive youth engagement and platform partnerships.' },
    { dates: 'Aug 2018 — May 2019', title: 'Manager, Social Content', org: 'NFL', desc: 'Oversaw creative production and original content strategy for NFL social channels, leading a multi-faceted creative team and driving high-impact storytelling.' },
    { dates: 'Apr 2016 — Aug 2018', title: 'Social Content Producer', org: 'NFL', desc: 'Launched the NFL’s official Snapchat Discover channel, and created original graphics, animations, and live content for NFL social with a key focus on driving engagement through innovative storytelling.' },
    { dates: 'Sep 2014 — Apr 2016', title: 'Manager, Sports Marketing', org: 'Lineage Interactive', desc: 'Managed social strategy and content for 20+ top-tier professional athletes, driving growth through consistent brand development, always-on programming, and authentic fan engagement.' }
  ];

  const awards = [
    { name: 'Sports Emmys', groups: [
      { year: '2020', items: [{ medal: '🏆 ', title: 'Best Trans-Media Sports Coverage', href: 'https://twitter.com/sportsemmys/status/1293357658993561606?lang=en', detail: 'Winner for NFL 100 Greatest & All-Time Team' }] }
    ]},
    { name: 'Clios', groups: [
      { year: '2021', items: [{ medal: '🏆 ', title: 'Social Media', href: 'https://clios.com/sports/winner/social-media/national-football-league/nfl-showtimecam-98863', detail: 'Clio Sports Grand Winner for NFL #ShowtimeCam' }] },
      { year: '2020', items: [
        { medal: '🥈 ', title: 'Social Media, Single Platform', href: 'https://clios.com/sports/winner/social-media/nfl-twitter/twitter-confetti-super-bowl-liv-83104', detail: 'Silver Winner for Twitter Confetti: Super Bowl LIV' },
        { medal: '', title: 'Partnerships, Sponsorships and Collaborations', href: 'https://clios.com/sports/winner/partnerships-sponsorships-collaborations/nfl-twitter/twitter-confetti-super-bowl-liv-83107', detail: 'Shortlist for Twitter Confetti: Super Bowl LIV' }
      ]}
    ]},
    { name: 'Sports Business Journal', groups: [
      { year: '2021', items: [{ medal: '', title: 'Best in Sports Social Media', href: 'https://www.sportsbusinessjournal.com/Journal/Issues/2011/03/14/People-and-Pop-Culture', detail: 'Finalist for NFL #ShowtimeCam' }] }
    ]},
    { name: 'Webby Awards', groups: [
      { year: '2020', items: [
        { medal: '🏆 ', title: 'Best in Sports', href: 'https://winners.webbyawards.com/2020/social/general-social/sports/129864/nfl-tiktok', detail: 'Winner for NFL TikTok' },
        { medal: '', title: 'Best Social Video Series', href: 'https://winners.webbyawards.com/2020/social/features/best-social-video-series/129871/nfl-draft-letters', detail: 'Nominee for NFL Draft Letters' },
        { medal: '', title: 'Best Sports Series & Campaigns', href: 'https://winners.webbyawards.com/2020/social/social-content-series-campaigns/sports-series-campaigns/128977/nfl100', detail: 'Nominee for #NFL100' }
      ]},
      { year: '2019', items: [{ medal: '', title: 'Best Overall Social Presence - Brand', href: 'https://winners.webbyawards.com/2019/social/features/best-overall-social-presence-brand/94651/nfl-social-lab', detail: 'Nominee for NFL Social Lab' }] }
    ]},
    { name: 'Shorty Awards', groups: [
      { year: '2020', items: [
        { medal: '🥇 ', title: 'Best TikTok Partnership', href: 'https://shortyawards.com/12th/nfls-weready-tiktok-campaign', detail: 'Gold Distinction for NFL’S #WEREADY TIKTOK CAMPAIGN' },
        { medal: '🥈 ', title: 'Best GIFs', href: 'https://shortyawards.com/12th/nfls-official-giphy-account', detail: 'Silver Distinction for NFL’S OFFICIAL GIPHY ACCOUNT' },
        { medal: '', title: 'Best Use of TikTok', href: 'https://shortyawards.com/12th/nfls-weready-tiktok-campaign', detail: 'Finalist for NFL’S #WEREADY TIKTOK CAMPAIGN' },
        { medal: '', title: 'Best Hashtag', href: 'https://shortyawards.com/12th/nfl100-a-year-long-celebration', detail: 'Finalist for #NFL100: A YEAR-LONG CELEBRATION' },
        { medal: '', title: 'Best Snapchat Discover', href: 'https://shortyawards.com/12th/nfl-shows-on-snapchat', detail: 'Finalist for NFL SHOWS ON SNAPCHAT' }
      ]},
      { year: '2019', items: [
        { medal: '🏆 ', title: 'Best Meme', href: 'https://shortyawards.com/11th/ron-from-accounting', detail: 'Winner for RON FROM ACCOUNTING' },
        { medal: '🥇 ', title: 'Best Comedy Video', href: 'https://shortyawards.com/11th/nfl-rookies-draw-team-logos', detail: 'Gold Distinction for NFL ROOKIES DRAW TEAM LOGOS' },
        { medal: '🥇 ', title: 'Best Graphics', href: 'https://shortyawards.com/11th/nfl-social-lab', detail: 'Gold Distinction for NFL SOCIAL LAB' },
        { medal: '🥇 ', title: 'Best Instagram Presence', href: 'https://shortyawards.com/11th/nfl-throwback-instagram-account', detail: 'Gold Distinction for NFL THROWBACK ON INSTAGRAM' },
        { medal: '', title: 'Best Images', href: 'https://shortyawards.com/11th/nfl-pro-football-hall-of-fame-2018-goats', detail: 'Finalist for NFL PRO FOOTBALL HALL OF FAME G.O.A.T.S' },
        { medal: '', title: 'Best Snapchat Presence', href: 'https://shortyawards.com/11th/nfl-snapchat', detail: 'Finalist for NFL SNAPCHAT' },
        { medal: '', title: 'Best Snapchat Discover Story', href: 'https://shortyawards.com/11th/nfl-snapchat-highlights-edition', detail: 'Finalist for NFL HIGHLIGHTS - A NEW NFL SNAPCHAT DISCOVER STORY' }
      ]},
      { year: '2018', items: [
        { medal: '', title: 'Best Art Direction', href: 'https://shortyawards.com/10th/nfl-social-media-creative-lab', detail: 'Finalist for NFL SOCIAL MEDIA CREATIVE LAB' },
        { medal: '', title: 'Best Graphics', href: 'https://shortyawards.com/10th/nfls-social-lab', detail: 'Finalist for NFL SOCIAL CREATIVE LAB' },
        { medal: '', title: 'Best in Sports', href: 'https://shortyawards.com/10th/thecheckdown-2', detail: 'Finalist for @THECHECKDOWN' },
        { medal: '', title: 'Best Snapchat Presence', href: 'https://shortyawards.com/10th/nfl-snapchat-discover-live-story-and-my-story', detail: 'Finalist for THE NFL ON SNAPCHAT' }
      ]},
      { year: '2017', items: [{ medal: '🏆 ', title: 'Best Snapchat Discover Story', href: 'https://shortyawards.com/9th/nfl-snapchat-discover-themed-power-rankings', detail: 'Winner for NFL SNAPCHAT DISCOVER: THEMED POWER RANKINGS' }] }
    ]},
    { name: 'Hashtag Sports', groups: [
      { year: '2021', items: [{ medal: '', title: 'Most Creative Engagement During the Sports Pause', href: 'https://www.hashtagsports.com/awards/shortlist-2021/tiktok-tailgate', detail: 'Finalist for TikTok Tailgate' }] },
      { year: '2020', items: [
        { medal: '🏆 ', title: 'Best Big Game Spot or Stunt', href: 'https://hashtagsports.com/awards/shortlist-2020/nfl-twitter-super-bowl-confetti', detail: 'Winner for #NFLTwitter Super Bowl Confetti 2020' },
        { medal: '🏆 ', title: 'Most Creative Partnership Without An Athlete Or Influencer', href: 'https://hashtagsports.com/awards/shortlist-2020/nfl-twitter-super-bowl-confetti', detail: 'for #NFLTwitter Super Bowl Confetti 2020' },
        { medal: '', title: 'Best Social Media Campaign', href: 'https://mobile.twitter.com/HashtagSports/status/1303783027097698304', detail: 'Finalist for #NFL100: A Year-Long Celebration' },
        { medal: '', title: 'Best Original Content or Series', href: 'https://mobile.twitter.com/HashtagSports/status/1303748155624894464', detail: 'Finalist for NFL Draft Letters' },
        { medal: '', title: 'Best Use of Technology', href: 'https://mobile.twitter.com/HashtagSports/status/1303776842495778817', detail: 'Finalist for NFL Super Bowl LIV Lens' },
        { medal: '', title: 'Outstanding Use of Snapchat', href: 'https://mobile.twitter.com/HashtagSports/status/1303760161715228674', detail: 'Finalist for NFL Shows on Snapchat' }
      ]},
      { year: '2019', items: [
        { medal: '🏆 ', title: 'Outstanding Use of Snapchat', href: 'https://awards.hashtagsports.com/shortlist-2019/nfl-highlights', detail: 'Winner for NFL Highlights - Snapchat Discover Story' },
        { medal: '🏆 ', title: 'Outstanding Use of Instagram', href: 'https://awards.hashtagsports.com/shortlist-2019/nfl-throwback', detail: 'Winner for NFL Throwback' },
        { medal: '', title: 'Best Real-Time Engagement', href: 'https://awards.hashtagsports.com/shortlist-2019/custom-fantasy-team-logos', detail: 'Finalist for Real-Time Custom Fantasy Team Logos' },
        { medal: '', title: 'Best Social Media Campaign', href: 'https://awards.hashtagsports.com/shortlist-2019/brees-a-thon', detail: 'Finalist for Brees-A-Thon By The Checkdown' },
        { medal: '', title: 'Best Multi-Platform Campaign', href: 'https://awards.hashtagsports.com/shortlist-2019/rookies-drawing-logos', detail: 'Finalist for Rookies Drawing Logos' }
      ]}
    ]}
  ];

  const projects = [
    { title: 'NFL All Day Open Beta Launch', roles: ['Content Shoot PM', 'Community Marketing Lead'], tag: 'Campaign', cta: 'Watch the spot', href: 'https://twitter.com/NFLALLDAY/status/1560235359098781696' },
    { title: 'NFL’s #ShowtimeCam', roles: ['DRI', 'Lead Producer'], tag: 'Production', cta: 'Learn more', href: 'https://twitter.com/NFL/status/1380651337566674946' },
    { title: 'Twitter Confetti', roles: ['DRI', 'Lead Producer'], tag: 'Activation', cta: 'Learn more', href: 'https://www.gq.com/story/super-bowl-tweet-confetti-chiefs' },
    { title: 'Top Shot’s First Access Unlocked Experience', roles: ['DRI', 'Experiential Marketing Lead'], tag: 'Experiential', cta: 'Learn more', href: 'https://blog.nbatopshot.com/posts/nba-finals-access-unlocked' },
    { title: 'Rookies Drawing Logos', roles: ['DRI', 'Producer and Editor'], tag: 'Series', cta: 'Watch', href: 'https://www.youtube.com/watch?t=2s&v=NA_lwx2_31g' },
    { title: 'NFL100 Campaign', roles: ['Social Marketing and Strategy Lead'], tag: 'Campaign', cta: 'Learn more', href: 'https://www.nflsociallab.com/nfl-100' },
    { title: 'Launched NFL on TikTok', roles: ['DRI'], tag: 'Channel', cta: 'Learn more', href: 'https://www.nflsociallab.com/nfl-tiktok' },
    { title: 'NFL All Day at SB LVI', roles: ['Community Marketing Lead'], tag: 'Activation', cta: 'Learn more', href: 'https://twitter.com/NFLALLDAY/status/1492205257287340034' },
    { title: 'TikTok Tailgate', roles: ['DRI', 'Partnership Lead', 'Lead Producer'], tag: 'Partnership', cta: 'Learn more', href: 'https://www.hashtagsports.com/awards/shortlist-2021/tiktok-tailgate' },
    { title: 'Draft-A-Thon Live', roles: ['DRI', 'Lead Producer'], tag: 'Livestream', cta: 'Learn more', href: 'https://nflcommunications.com/Pages/NFL-UNVEILS-PLANS-FOR-2020-DRAFT-A-THON-LIVE-STREAM.aspx' },
    { title: 'Draft Letters', roles: ['DRI', 'Lead Producer'], tag: 'Series', cta: 'Learn more', href: 'https://www.nflsociallab.com/nfl-draft-letters' },
    { title: 'Pro Bowl Guinness World Records', roles: ['DRI', 'Executive Producer'], tag: 'Production', cta: 'Watch', href: 'https://www.youtube.com/watch?v=g1SDdZxdv9o' },
    { title: 'Commissioner Virtual Handshake', roles: ['DRI', 'Lead Producer'], tag: 'Moment', cta: 'Learn more', href: 'https://people.com/sports/nfl-draftee-jerry-jeudy-commissioner-roger-goodell-tiktok-video/' },
    { title: 'Quavo Joins NBA Top Shot', roles: ['DRI', 'Athlete Partnerships Lead'], tag: 'Partnership', cta: 'Learn more', href: 'https://hypebeast.com/2021/7/quavo-nba-top-shot-finals-pack' },
    { title: 'Charli D’Amelio x JLo at Super Bowl', roles: ['DRI'], tag: 'Moment', cta: 'Learn more', href: 'https://www.insider.com/charli-damelio-met-j-lo-exclusive-not-dating-lilhuddy-yet-2020-2' },
    { title: 'NFL Player Giphy Reactions', roles: ['DRI', 'Lead Producer'], tag: 'Series', cta: 'Learn more', href: 'https://shortyawards.com/12th/nfls-official-giphy-account' },
    { title: 'NFL Shows on Snapchat', roles: ['DRI', 'Executive Producer'], tag: 'Channel', cta: 'Learn more', href: 'https://shortyawards.com/12th/nfl-shows-on-snapchat' },
    { title: 'NFL x Instagram Playmakers Program', roles: ['Social Lead'], tag: 'Program', cta: 'Learn more', href: 'https://www.si.com/nfl/2020/11/06/nfl-generation-z-fans-social-instagram' },
    { title: 'Real Talk with the NFL Snapchat Show', roles: ['DRI', 'Executive Producer'], tag: 'Series', cta: 'Learn more', href: 'https://frontofficesports.com/real-talk-nfl-snapchat/' },
    { title: 'NFL Draft Plinko', roles: ['DRI', 'Executive Producer'], tag: 'Production', cta: 'Learn more', href: 'https://nypost.com/2019/04/25/nfl-draft-plinko-knew-quinnen-williams-was-going-to-be-picked-by-jets/' }
  ];

  const press = [
    { title: 'Dana White, Ronda Rousey Achieve 100M Milestone Hours Before UFC 317', desc: 'If Dana White wanted to draw attention to UFC 317, he chose the ideal accomplice—and no, not the fighters at Power Slap.', cta: 'Read', href: 'https://www.essentiallysports.com/ufc-mma-news-dana-white-ronda-rousey-achieve-hundred-million-milestone-hours-before-ufc-317/' },
    { title: '‘More views than Taylor Swift’ — Footage of Power Slap star blowing kiss after eating hit breaks the internet', desc: 'Power Slap continues to rack up a ridiculous amount of social media views.', cta: 'Read', href: 'https://talksport.com/mma/1666102/taylor-swift-power-slap-kiss-footage-views/' },
    { title: 'How the NFL Competes for—and Wins Over—Younger Fans’ Attention', desc: 'The league’s strategy includes transforming its players into influencers.', cta: 'Read', href: 'https://www.adweek.com/brand-marketing/how-the-nfl-competes-for-and-wins-over-younger-fans-attention/' },
    { title: 'TikTok Dives Deeper Into Long-Form Sports Content', desc: 'Through live streams and content series, the social media platform has recently explored these efforts with sports brands like Jordan Brand and the NFL.', cta: 'Read', href: 'https://frontofficesports.com/tiktok-long-form-content/' },
    { title: 'The NFL Doubles Down on its Snapchat Strategy as Other Media Partners Scale Back', desc: 'The NFL says its audience doubled viewership of its highlights video to 2 million this year.', cta: 'Read', href: 'https://adage.com/article/digital/nfl-future-snapchat/316026' },
    { title: 'Sports Leagues Helping Fans Escape Through TikTok', desc: 'With few live sports events going on, the NBA, NFL, NHL, and MLB are each using TikTok to distract fans from their uncertain realities.', cta: 'Read', href: 'https://frontofficesports.com/big-four-sports-tiktok/' },
    { title: 'Sports Brands Learning To Be Musically Creative On TikTok', desc: 'TikTok’s recent music regulations are forcing digital and social media workers in sports to be more creative with their content.', cta: 'Read', href: 'https://frntofficesport.com/tiktok-sports-original-music/' },
    { title: 'How the NFL used TikTok to Build Authentic Fan Connections', desc: 'The pro football league is generating fan engagement on TikTok comments.', cta: 'Read', href: 'https://www.prweek.com/article/1705979/nfl-used-tiktok-build-authentic-fan-connections' },
    { title: 'NFL Tackles Social Justice On “Real Talk” Snapchat Show', desc: 'NFL, Snapchat come together with launch of social justice show, “Real Talk.”', cta: 'Read', href: 'https://frontofficesports.com/real-talk-nfl-snapchat/' },
    { title: 'KFC, American Eagle, and other household names break down how they built their TikTok followings', desc: 'The 42-minute recorded session broke down in detail why TikTok is the place to advertise — and included plenty of case studies on how to make it big on TikTok.', cta: 'Read', href: 'https://www.businessinsider.com/tiktok-pitch-deck-how-household-names-american-eagle-kfc-built-followings-2021-6' },
    { title: 'How Ocean Spray, NFL embed nostalgia in TikToks to tap ‘culture-defining’ moments', desc: 'Panelists at SXSW detailed how to initiate a strong strategy, from mastering the platform’s nuances to understanding what drives its community to engage.', cta: 'Read', href: 'https://www.marketingdive.com/news/how-ocean-spray-nfl-embed-nostalgia-in-tiktoks-to-tap-culture-defining-m/596834/' },
    { title: 'How Iconic Brands Use TikTok To Engage With Fans: SXSW 2021 Edition', desc: 'During this year’s SXSW Conference, there was one session that really stood out to me, and that was “Driving Culture Through Content.”', cta: 'Read', href: 'https://www.elicitmagazine.com/sxsw-2021-how-to-use-tiktok/' },
    { title: 'How A TikTok Video Changed Arby’s Marketing, and Other Brand Stories from SXSW', desc: 'TikTok brings marketers from Arby’s, NFL, Ocean Spray, HBO Max, McDonald’s and Gatorade to virtual festival.', cta: 'Read', href: 'https://adage.com/article/special-report-sxsw/how-tiktok-video-changed-arbys-marketing-and-other-brand-stories-sxsw/2322151' },
    { title: 'Bradley Grad Curry Part Of History Making Super Bowl For Women', desc: 'Flash forward seven years, AJ is the senior manager of social content for the NFL with five Super Bowl’s under her belt.', cta: 'Read', href: 'https://www.centralillinoisproud.com/sports/local-sports/bradley-grad-curry-part-of-history-making-super-bowl-for-women/' },
    { title: 'Clubhouse and the NFL Team Up for the Draft', desc: 'It’s the audio platform’s first partnership with a sports league.', cta: 'Read', href: 'https://www.adweek.com/social-marketing/clubhouse-and-the-nfl-team-up-for-the-draft/' },
    { title: 'For the First Time, a Woman Called the Shots at the Super Bowl', desc: 'NFL referee Sarah Thomas became the first woman to ever officiate a Super Bowl game.', cta: 'Read', href: 'https://thestoryexchange.org/nfl-sarah-thomas-first-female-referee-officiate-super-bowl-lv/' },
    { title: 'Driving Culture Through Content | SXSW 2021', desc: 'Learn how brands are navigating TikTok’s participatory nature to seize their own cultural moments and connect with an engaged community in an authentic way.', cta: 'Watch', href: 'https://www.youtube.com/watch?v=N9ZBtIJ1JJA' },
    { title: 'Ballerz Nation #3: AJ Curry of NFL All Day', desc: 'NFL All Day Community Lead, AJ Curry, steps up to quarterback the Guest spot in episode #3 of Ballerz Nation.', cta: 'Watch', href: 'https://www.youtube.com/watch?v=zvs3mnVwStc' },
    { title: '“It starts with us. It starts with our allies. It starts with our leadership.”', desc: 'Colleen Wolfe, Aisha Chaney, AJ Curry, and Stacey Dales on creating environments in sports where women are supported and heard.', cta: 'Watch', href: 'https://www.facebook.com/watch/?v=3486138221410380' },
    { title: '“I want there to be more of me. I’m tired of being the only one.”', desc: 'Colleen Wolfe, Aisha Chaney, AJ Curry, and Stacey Dales discuss the many obstacles of being a woman in a male-dominated sports industry.', cta: 'Watch', href: 'https://www.facebook.com/watch/?v=1575909595907735' },
    { title: '“If you see something wrong, speak up. Say something.”', desc: 'Colleen Wolfe, Aisha Chaney, AJ Curry, and Stacey Dales discuss the importance of allies and how we can better support women in the workplace.', cta: 'Watch', href: 'https://www.facebook.com/watch/?v=604698030448346' }
  ];

  const panelists = [
    { event: 'AdWeek’s “BrandWeek Sports”', date: 'Nov 2020' },
    { event: 'SXSW’s “Driving Culture Through Content”', date: 'May 2021' },
    { event: 'Twitter’s “2020 Sports Summit”', date: 'June 2020' },
    { event: 'TikTok’s “Future of Sports Entertainment”', date: 'Sep 2019' },
    { event: 'Michigan Sport Business Conference', date: 'Oct 2020' }
  ];

  /* ============================ RENDER ============================ */

  // ---- Highlights — icon accordion ----
  const hlGrid = document.getElementById('hl-grid');
  highlights.forEach((h) => {
    const copy = el('p', { class: 'hl-tile-copy' });
    h.segs.forEach((s) => copy.appendChild(s.em ? el('em', { text: s.t }) : document.createTextNode(s.t)));
    const face = el('span', { class: 'hl-tile-face' }, [
      el('span', { class: 'hl-tile-num', text: h.n }),
      el('span', { class: 'hl-tile-icon', html: ICONS[h.icon] || ICONS.star })
    ]);
    const tile = el('div', {
      class: 'hl-tile', tabindex: '0', role: 'group', 'aria-label': copy.textContent
    }, [face, el('div', { class: 'hl-tile-text' }, copy)]);
    hlGrid.appendChild(tile);
  });

  // ---- Accordion factory ----
  const makeAccItem = (openByDefault, btnContent, panelContent) => {
    const sign = el('span', { class: 'acc-sign', 'aria-hidden': 'true', text: openByDefault ? '–' : '+' });
    const btn = el('button', { class: 'acc-btn', type: 'button', 'aria-expanded': String(openByDefault) }, btnContent(sign));
    const panel = el('div', { class: 'acc-panel' }, el('div', { class: 'acc-panel-inner' }, panelContent));
    const item = el('div', { class: 'acc-item' + (openByDefault ? ' open' : '') }, [btn, panel]);
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      sign.textContent = open ? '–' : '+';
    });
    return item;
  };

  // ---- Career ----
  const careerAcc = document.getElementById('career-acc');
  roles.forEach((r, i) => {
    careerAcc.appendChild(makeAccItem(
      i === 0,
      (sign) => {
        const btn = el('div', { class: 'role-btn' }, [
          el('span', { class: 'role-dates', text: r.dates }),
          el('span', null, [
            el('span', { class: 'role-title', text: r.title }),
            el('span', { class: 'role-org', text: r.org })
          ]),
          sign
        ]);
        return btn;
      },
      el('p', { class: 'role-desc', text: r.desc })
    ));
  });
  // role-btn must be the button's grid; flatten one wrapper level
  // (makeAccItem appends btnContent as the button's children)

  // ---- Awards ----
  const awardsAcc = document.getElementById('awards-acc');
  awards.forEach((o, i) => {
    const count = o.groups.reduce((n, g) => n + g.items.length, 0);
    const groupsWrap = el('div', { class: 'award-groups' });
    o.groups.forEach((g) => {
      const items = el('div', { class: 'award-items' });
      g.items.forEach((it) => {
        const row = el('div', { class: 'award-item' }, [
          el('span', { class: 'award-medal', text: it.medal }),
          el('a', { class: 'award-link', href: it.href, target: '_blank', rel: 'noopener', text: it.title }),
          document.createTextNode(' — ' + it.detail)
        ]);
        items.appendChild(row);
      });
      groupsWrap.appendChild(el('div', { class: 'award-group' }, [
        el('div', { class: 'award-year', text: g.year }),
        items
      ]));
    });
    awardsAcc.appendChild(makeAccItem(
      i === 0,
      (sign) => el('div', { class: 'award-btn' }, [
        el('span', { class: 'award-head' }, [
          el('span', { class: 'award-name', text: o.name }),
          el('span', { class: 'award-tally', text: count + ' honors' })
        ]),
        sign
      ]),
      groupsWrap
    ));
  });

  // ---- Projects ----
  const rail = document.getElementById('proj-rail');
  projects.forEach((p) => {
    const rolesWrap = el('div', { class: 'proj-roles' },
      p.roles.map((role) => el('span', { class: 'proj-role', text: role })));
    rail.appendChild(el('article', { class: 'proj' }, [
      el('a', { class: 'proj-media', href: p.href, target: '_blank', rel: 'noopener' },
        el('div', { class: 'proj-img' }, [
          el('span', { class: 'proj-tag', text: p.tag }),
          el('span', { class: 'proj-badge', 'aria-hidden': 'true', text: '↗' })
        ])),
      el('h3', { class: 'proj-title', text: p.title }),
      rolesWrap,
      el('a', { class: 'proj-cta', href: p.href, target: '_blank', rel: 'noopener', text: p.cta })
    ]));
  });

  // ---- Press ----
  const PRESS_VISIBLE = 6;
  const pressGrid = document.getElementById('press-grid');
  const pressToggle = document.getElementById('press-toggle');
  press.forEach((a, i) => {
    pressGrid.appendChild(el('a', {
      class: 'press-card' + (i >= PRESS_VISIBLE ? ' hidden' : ''),
      href: a.href, target: '_blank', rel: 'noopener'
    }, [
      el('span', { class: 'press-cta', text: a.cta }),
      el('h3', { class: 'press-title', text: a.title }),
      el('p', { class: 'press-desc', text: a.desc })
    ]));
  });
  let pressOpen = false;
  const setPressLabel = () => {
    pressToggle.textContent = pressOpen ? 'Show less' : ('Show all ' + press.length + ' features');
  };
  setPressLabel();
  pressToggle.addEventListener('click', () => {
    pressOpen = !pressOpen;
    pressGrid.querySelectorAll('.press-card').forEach((c, i) => {
      if (i >= PRESS_VISIBLE) c.classList.toggle('hidden', !pressOpen);
    });
    setPressLabel();
  });

  // ---- Panelists ----
  const panelGrid = document.getElementById('panelist-grid');
  panelists.forEach((pn) => {
    panelGrid.appendChild(el('div', { class: 'panelist' }, [
      el('span', { class: 'panelist-event', text: pn.event }),
      el('span', { class: 'panelist-date', text: pn.date })
    ]));
  });

  // ---- Split section titles into characters (staggered reveal) ----
  document.querySelectorAll('.section-title').forEach((title) => {
    const text = title.textContent;
    title.textContent = '';
    let i = 0;
    Array.from(text).forEach((ch) => {
      if (ch === ' ') { title.appendChild(document.createTextNode(' ')); return; }
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = ch;
      span.style.setProperty('--i', i++);
      title.appendChild(span);
    });
  });

  /* ========================= INTERACTIONS ========================= */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Reveal on scroll (progressive enhancement + robust fallback) ----
  // `.reveal` is visible by default; it is only hidden for the entrance
  // animation once `js-anim` is on <html>. So if scripts are blocked the
  // content still shows.
  const root = document.documentElement;
  if ('IntersectionObserver' in window && !reduceMotion) {
    root.classList.add('js-anim');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
    // Some embedded / occluded preview frames never advance CSS transitions,
    // so a `.reveal` element freezes at its hidden start value (opacity:0) and
    // the page reads as blank. After the entrance should have finished, if the
    // in-view hero is still not visible, abandon the animation: dropping
    // `js-anim` reverts every `.reveal` to its natural, fully-visible state
    // with no transition left to freeze. (setTimeout still fires in
    // backgrounded tabs, where rAF/transitions may not.)
    setTimeout(() => {
      const probe = document.querySelector('.hero .reveal');
      if (!probe || parseFloat(getComputedStyle(probe).opacity) < 0.9) {
        root.classList.remove('js-anim');
      }
    }, 1500);
  }
  // else (no IntersectionObserver / reduced motion): `js-anim` is never set,
  // so all content stays visible.

  // ---- Nav: shadow, link reveal, active section ----
  const nav = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('.navlink'));
  const sectionIds = ['highlights', 'career', 'awards', 'projects', 'press'];

  const onScrollNav = () => {
    const y = window.pageYOffset;
    nav.classList.toggle('scrolled', y > 16);
    nav.classList.toggle('show-links', y > window.innerHeight * 0.55);

    const mid = window.innerHeight * 0.35;
    let current = '';
    sectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top <= mid) current = id;
    });
    navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };

  // ---- Parallax: drift each portrait photo within its frame ----
  const pxEls = Array.from(document.querySelectorAll('.js-parallax'));
  const parallax = () => {
    if (reduceMotion) return;
    pxEls.forEach((elx) => {
      const frame = elx.parentElement; // .qspread-photo
      if (!frame) return;
      const r = frame.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      const speed = parseFloat(elx.getAttribute('data-speed')) || 0.1;
      elx.style.transform = 'translateY(' + (-center * speed).toFixed(1) + 'px)';
    });
  };

  // ---- rAF-throttled scroll loop ----
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollNav(); parallax(); ticking = false; });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { onScrollNav(); parallax(); }, { passive: true });
  onScrollNav();
  parallax();

  // ---- Projects rail: drag-to-scroll + prev/next ----
  const track = document.getElementById('proj-rail');
  if (track) {
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; track.style.cursor = 'grabbing'; }
      track.scrollLeft = sl - dx;
    });
    const up = () => { down = false; track.style.cursor = 'grab'; };
    track.addEventListener('pointerup', up);
    track.addEventListener('pointerleave', up);
    track.addEventListener('pointercancel', up);
    // Suppress the click that follows a drag so cards don't navigate mid-drag.
    track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    const scrollProjects = (dir) => {
      const card = track.querySelector('.proj');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      const w = card ? card.getBoundingClientRect().width + gap : 340;
      track.scrollBy({ left: dir * w * 1.5, behavior: 'smooth' });
    };
    document.getElementById('proj-prev').addEventListener('click', () => scrollProjects(-1));
    document.getElementById('proj-next').addEventListener('click', () => scrollProjects(1));
  }
})();
