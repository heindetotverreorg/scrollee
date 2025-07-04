import { ArticleData } from '@shared/types'
export function useArticleMapping(article : ArticleData) {
    const hasMeaningfulContent = article.text.length > 40
    const title = article.title || article.text.slice(0, 40) + '...'
    const text = article.text || ''
    const image = article.image || 'https://via.placeholder.com/150'
    const date = new Date(article.date as string).toLocaleDateString()


    return {
        hasMeaningfulContent,
        title,
        text,
        image,
        date
    }
}