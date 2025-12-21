import { Project } from '../types';

export const binance: Project = {
  id: 'binance',
  name: 'Binance',
  description: '.',
  category: 'CEX - Centralized Exchanges',
  status: 'Live/Released',
  isOpenSource: false,
  lastEdited: 'Dec 21, 2025',
  websiteUrl: 'https://www.binance.com/en/trade/HIVE_USDT',
  // Fix: add required thumbnail property
  thumbnail: 'https://hive.io/images/exchanges/binance.svg',
  logo: 'https://hive.io/images/exchanges/binance.svg'
};