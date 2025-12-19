
import { Project } from '../types';

export const dbuzz: Project = {
  id: 'dbuzz',
  name: 'D.Buzz',
  description: 'D.Buzz is a censorship-resistant micro-blogging platform built on the Hive blockchain. Short form content for the modern web.',
  category: 'Hive Interfaces (Frontends)',
  thumbnail: 'https://d.buzz/images/logo.png',
  websiteUrl: 'https://d.buzz',
  githubUrl: 'https://github.com/dbuzz',
  status: 'Live/Released',
  isOpenSource: true,
  lastEdited: 'Oct 23, 2023',
  team: [
    { name: 'chrisrice', role: 'Founder', avatar: 'https://images.hive.blog/u/chrisrice/avatar' }
  ],
  timeline: [
    { 
      date: 'Aug. 2020', 
      title: 'Micro-blogging Revolution', 
      description: 'D.Buzz enters the Hive ecosystem to provide a fast-paced alternative to long-form blogging.',
      linkUrl: 'https://d.buzz/@dbuzz/the-future-of-micro-blogging'
    }
  ]
};
