// src/utils/updateHreflangTags.js

export function updateHreflangTags(currentLang, languages) {
    const headElement = document.querySelector('head');
    const existingLinks = document.querySelectorAll('link[rel="alternate"]');
    existingLinks.forEach(link => headElement.removeChild(link)); // Remove existing hreflang tags
  
    languages.forEach(lang => {
      const linkElement = document.createElement('link');
      linkElement.rel = 'alternate';
      linkElement.hreflang = lang.code;
      linkElement.href = `${window.location.origin}/${lang.code}`;
      headElement.appendChild(linkElement);
    });
  
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${window.location.origin}/${currentLang}`;
    headElement.appendChild(defaultLink);
  }