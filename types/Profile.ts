export interface Link {
  name: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  headline: string;
  bio: string;
  links: Link[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

