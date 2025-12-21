import { Category } from './types';
import { projects as modularProjects } from './projects/index';

export const categories: Category[] = [
  { id: 'account', name: 'Account Creation Tools', description: 'A service or a tool which helps you create a Hive account, with or without verification' },
  { id: 'explorers', name: 'Block explorers', description: 'Tools which fives a possibility to browse the content of a blockchain, block by block, on low level' },
  { id: 'bots', name: 'Bots', description: 'Tools/scripts which automatically interact with Hive Blockchain' },
  { id: 'exchanges', name: 'Exchanges', description: 'Places where you can sell/buy your HIVE and HBD tokens' },
  { id: 'defi', name: 'DeFi', description: 'Decentralized Finance (DeFi) apps, including financial tools, trading platforms, and NFT ecosystems' },
  { id: 'games', name: 'Games', description: 'All kind of games powered by the Hive blockchain' },
  { id: 'interfaces', name: 'Hive Interfaces (Frontends)', description: 'User-friendly interfaces for Hive network' },
  { id: 'programming', name: 'Programming Tools', description: 'Useful library or tool for software developers' },
  { id: 'specialized', name: 'Specialized Hive Interfaces', description: 'Dedicated Hive interfaces for specific types of content (Video, Finance, Travel, etc)' },
  { id: 'wallets', name: 'Wallets', description: 'A tool which help you manage keys, your password, and do various things with your account' },
  { id: 'witness', name: 'Witness Tools', description: 'Tools/scripts useful for witnesses' },
  { id: 'other', name: 'Other', description: 'Other projecs' },
];

export const projects = modularProjects;