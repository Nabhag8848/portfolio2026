export const profiles = {
  github: "https://github.com/Nabhag8848",
  twitter: "https://x.com/NabhagMotivaras",
  linkedin: "https://linkedin.com/in/nabhagmotivaras",
  leetcode: "https://leetcode.com/u/NabhagMotivaras/",
  mail: "mailto:motivaras.nabhag@gmail.com",
};

export const profileRedirects = [
  { path: "/github", to: profiles.github },
  { path: "/twitter", to: profiles.twitter },
  { path: "/x", to: profiles.twitter },
  { path: "/linkedin", to: profiles.linkedin },
  { path: "/leetcode", to: profiles.leetcode },
  { path: "/mail", to: profiles.mail },
  { path: "/email", to: profiles.mail },
];
