
import { Project } from '../types';

export const splinterlands: Project = {
  id: 'splinterlands',
  name: 'Splinterlands',
  description:'Splinterlands is a fast-paced digital trading card game (TCG) powered by the Hive blockchain. Players truly own their cards and in-game assets as NFTs, and can battle, trade, rent, and earn rewards through competitive gameplay.',
  category: 'Games',
  thumbnail: 'https://images.hive.blog/u/splinterlands/avatar',
  gallery: [
    'https://images.hive.blog/u/splinterlands/cover',
    'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/beta/Spineback%20Turtle_lv4_gold.png',
    'https://d36mxiodymuqjm.cloudfront.net/cards_by_level/untamed/Cornealus_lv3.png'
  ],
  websiteUrl: 'https://splinterlands.com',
  announcementUrl: 'https://docs.splinterlands.com/',
  contactUrl: 'https://discord.com/invite/splinterlands',
  status: 'Live/Released',
  isOpenSource: false,
  lastEdited: 'Dec 12, 2025',
  team: [
    {
      name: 'aggroed',
      role: 'Co-founder',
      avatar: 'https://images.hive.blog/u/aggroed/avatar'
    },
    {
      name: 'yabapmatt',
      role: 'Co-founder / Lead Developer',
      avatar: 'https://images.hive.blog/u/yabapmatt/avatar'
    }
  ],
  supporters: [
    {
      name: 'splinterlands',
      role: 'Official account & updates',
      avatar: 'https://images.hive.blog/u/splinterlands/avatar'
    },
    {
      name: 'peakmonsters',
      role: 'Community tooling (stats/market/rentals)',
      avatar: 'https://images.hive.blog/u/peakmonsters/avatar'
    },
    {
      name: 'splintertalk',
      role: 'Community & content ecosystem (SPT)',
      avatar: 'https://images.hive.blog/u/splintertalk/avatar'
    },
    {
      name: 'tehox',
      role: 'Splintercards (community card database)',
      avatar: 'https://images.hive.blog/u/tehox/avatar'
    }
  ],
  timeline: [
    {
      date: 'May 26, 2018',
      title: 'Launch (Steem Monsters)',
      description: 'The game is announced and launched under the original name “Steem Monsters”.',
      linkUrl: 'https://docs.splinterlands.com/company/timeline/history-2018'
    },
    {
      date: 'June 1, 2020',
      title: 'Migration to Hive',
      description: 'Splinterlands officially migrates to the Hive blockchain.',
      linkUrl: 'https://docs.splinterlands.com/company/timeline/history-2020'
    },
    {
      date: 'May 27, 2021',
      title: 'SPS announced',
      description: 'Upcoming governance token Splintershards (SPS) is announced.',
      linkUrl: 'https://docs.splinterlands.com/company/timeline/history-2021'
    }
  ]
};
