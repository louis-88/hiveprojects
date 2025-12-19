
import { Project } from '../types';

export const hiveBlog: Project = {
  id: 'hive-blog',
  name: 'Hive.blog',
  description: 'The reference implementation of the Hive Condenser. It is the official gateway and social interface for the Hive blockchain.',
  category: 'Hive Interfaces (Frontends)',
  thumbnail: 'https://hive.blog/images/hive-blog-logo.png',
  websiteUrl: 'https://hive.blog',
  githubUrl: 'https://github.com/hive-project/condenser',
  status: 'Live/Released',
  isOpenSource: true,
  lastEdited: 'Oct 23, 2023',
  team: [
    { name: 'blocktrades', role: 'Core Dev Team', avatar: 'https://images.hive.blog/u/blocktrades/avatar' }
  ],
  timeline: [
    { 
      date: 'Mar. 20, 2020', 
      title: 'The Genesis', 
      description: 'Hive.blog launched as the primary frontend following the hardfork from Steem.',
      linkUrl: 'https://hive.blog/hive/@hiveio/announcing-the-launch-of-hive-blockchain'
    }
  ]
};
