import { ArticleData } from '@shared/types'

export function useArticleMapping(article : ArticleData) {
    const hasMeaningfulContent = article.text.length > 40
    const title = getTitleFromArticle(article) || article.title
    const text = article.text || ''
    const images = getImagesFromHtml(article.html) || article.image || ''
    const date = new Date(article.date as string).toLocaleDateString()
    const url = getArticleUrlFromHtml(article.html) || article.href || ''

    return {
        hasMeaningfulContent,
        title,
        text,
        images,
        date,
        url
    }
}

function getArticleUrlFromHtml(html : string) : string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const linkElement = doc.querySelector('a');

    if (linkElement && linkElement instanceof HTMLAnchorElement) {
        return linkElement.href;
    }

    return null; // Return null if no link found
}

function getImagesFromHtml(html : string) : HTMLImageElement[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgNodeList = doc.querySelectorAll('img');

    const imgList = Array.from(imgNodeList)

    return imgList
}

function getTitleFromArticle(article : ArticleData) : string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.html, 'text/html');
    const titleElement = doc.querySelector('h1, h2, h3, h4, h5, h6');
    const createdTitle = titleElement?.textContent?.trim()

    const dericedTitleFromText = article.text.trim().slice(0, 40) + '...';

    const isTitleSameAsText = createdTitle && article.text.trim().startsWith(createdTitle);


    if (isTitleSameAsText) {
        return dericedTitleFromText
    }

    return createdTitle || article.title || dericedTitleFromText || null; // Fallback to article.title if no title found
}