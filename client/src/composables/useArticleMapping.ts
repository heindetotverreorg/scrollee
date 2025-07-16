import { ArticleData } from '@shared/types'
import { computed, unref, Ref } from 'vue'

export function useArticleMapping(
    article : Ref<ArticleData>,
    streamRootUrl : Ref<string>
) {
    const hasMeaningfulContent = computed(() => unref(article).text.length > 40)
    const title = computed(() => getTitleFromArticle(unref(article)) || unref(article).title)
    const text = computed(() => unref(article).text || '')
    const images = computed(() => getImagesFromHtml(unref(article).html) || unref(article).image || '')
    const date = computed(() => new Date(unref(article).date as string).toLocaleDateString())
    const url = computed(() => getArticleUrlFromHtml(unref(article).html, unref(streamRootUrl)) || unref(article).href || '')
    const createdAt = computed(() => unref(article).createdAt || new Date().toISOString())

    return {
        hasMeaningfulContent,
        title,
        text,
        images,
        date,
        url,
        createdAt
    }
}

function getArticleUrlFromHtml(html : string, streamRootUrl : string) : string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const linkElement = doc.querySelector('a');

    if (linkElement && linkElement instanceof HTMLAnchorElement) {

        const path = linkElement.pathname || '';

        const combinedUrl = `${streamRootUrl}${path}`;

        return combinedUrl
    }

    return null; // Return null if no link found
}

function getImagesFromHtml(html : string) : HTMLImageElement[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imgNodeList = doc.querySelectorAll('img');

    const imgList = Array.from(imgNodeList)

    const uniqueImgList = imgList.filter((img, index) => {
        return imgList.findIndex(i => i.src === img.src) === index;
    });

    return uniqueImgList
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