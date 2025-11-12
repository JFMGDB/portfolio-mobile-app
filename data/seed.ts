import { Education, Experience, Profile } from '@/types/Profile';

export const PROFILE_DATA: Profile = {
  name: 'JFMGDB',
  headline: 'Senior Frontend/Full-Stack Engineer & Product Manager',
  bio: 'Engenheiro de software sênior apaixonado por construir produtos escaláveis e de alta qualidade com foco em React, React Native e ecossistemas de nuvem. Este é um aplicativo de portfólio dinâmico.',
  links: [
    {
      name: 'GitHub',
      url: 'https://github.com/JFMGDB',
      icon: 'github',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/jfmgdb',
      icon: 'linkedin',
    },
  ],
};

export const EDUCATION_DATA: Education[] = [
  {
    institution: 'Universidade Federal',
    degree: 'Bacharelado em Ciência da Computação',
    period: '2015 - 2019',
    description: 'Formação em ciência da computação com foco em desenvolvimento de software e arquitetura de sistemas.',
  },
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    role: 'Engenheiro de Software Sênior',
    company: 'Startup Veloce',
    period: '2020 - 2022',
    description: 'Desenvolvimento de aplicações web e mobile escaláveis usando React, React Native e Node.js. Liderança técnica de equipes de desenvolvimento.',
  },
  {
    role: 'Product Manager & Tech Lead',
    company: 'TechCorp',
    period: '2022 - Presente',
    description: 'Gestão de produto e liderança técnica, definindo estratégias de produto e arquitetura de sistemas em nuvem.',
  },
];

