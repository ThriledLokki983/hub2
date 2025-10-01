export interface FooterProps {
  // Define your props here
  children?: React.ReactNode;
  [key: string]: any;
}

interface CookiePolicy {
  body: string;
  categories: Category[];
  cookies: Cookies;
  title: string;
  translations: Translations
}
export interface Category {
  description: string;
  key: string;
  title: string;
}

interface Cookies {
  title: string;
  headers: Headers;
  items: Item[]
}

interface Headers {
  category: string;
  duration: string;
  first_party: string;
  name: string;
  persistent: string;
  provider: string;
  purpose: string;
  session: string;
  third_party: string;
  type: string;
}

interface Item {
  category: string;
  category_key: string;
  duration: string;
  first_party: boolean;
  name: string;
  persistent: boolean;
  provider:string;
  purpose: string;
  session: boolean;
  third_party: boolean;
  type: string;
}

interface Translations {
  allow: string;
  allow_all: string;
  allow_strict: string;
  block: string;
  block_all: string;
  cookie_warning: string;
  review_settings: string;
  save_settings: string;
}

export interface DataContent {
  body:string;
}

interface DataWithTitle {
  body: string;
  title: string;
}

interface Link {
  link: string;
  title: string;
}

interface LinksData {
  termsandconditions: Link;
  whistleblower: Link;
}

interface Section {
  index: number;
  title: string;
  body: string;
}

interface Privacy {
  body: string;
  title: string;
  sections: Section[];
}

interface Settings {
  invert: boolean;
  language: string;
  version: number;
}


export interface FooterData {
  cookie_policy: CookiePolicy;
  copyright: DataContent;
  disclaimer: DataWithTitle;
  domain: string[];
  links: LinksData;
  privacy: Privacy;
  settings: Settings;
  site_provider: DataWithTitle;
}
