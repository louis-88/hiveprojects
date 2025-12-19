
export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  linkUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  gallery?: string[];
  websiteUrl: string;
  githubUrl?: string;
  announcementUrl?: string;
  contactUrl?: string;
  featured?: boolean;
  status?: 'Live/Released' | 'Alpha' | 'Beta' | 'Development';
  team?: TeamMember[];
  supporters?: TeamMember[];
  isOpenSource?: boolean;
  timeline?: TimelineEvent[];
  lastEdited?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export type ViewType = 'home' | 'faq' | 'add-project' | 'categories' | 'favorites' | 'project-detail' | 'developers' | 'developer-detail';
