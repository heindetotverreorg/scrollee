import { defineStore } from 'pinia'
import { ref, computed, Ref, unref } from 'vue'
import { ArticleData } from '@shared/types'

export const useStreamStore = defineStore('stream', () => {
    // state
    const streams = ref({}) as Ref<Record<string, ArticleData[]>>
    const bundledStreams = ref([]) as Ref<ArticleData[]>

    // getters
    const getBundledStreams = computed(() => {
        const streamNames = [...new Set(unref(bundledStreams).map(article => article.streamName))]
        const result: ArticleData[] = []

        for (const streamName of streamNames) {
            const streamArticles = unref(bundledStreams).filter(article => article.streamName === streamName)
            const randomArticle = streamArticles[Math.floor(Math.random() * streamArticles.length)]
            if (randomArticle) {
                result.push(randomArticle)
            }
        }

        // Shuffle the result array to ensure random stream order
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]]
        }

        return result
    })

    const getStreamsByName = (streamName: string) => {
        return unref(streams)[streamName] || []
    }
    const removeStreamByName = (streamName: string) => {
        if (unref(streams)[streamName]) {
            delete unref(streams)[streamName]
            console.log('Removed stream: ', streamName)
            // Remove articles from bundledStreams
            bundledStreams.value = unref(bundledStreams).filter(article => article.streamName !== streamName)
            console.log('Removed articles from bundledStreams for stream: ', streamName)
            console.log('Total bundled articles length: ', unref(bundledStreams).length)
        } else {
            console.warn(`Stream with name ${streamName} does not exist`)
        }
    }

    // actions
    const setStreamArticles = (articles: ArticleData[], streamRootUrl: string, streamName: string) => {
        console.log('Total bundled articles length: ', unref(bundledStreams).length)
        if (!articles || !Array.isArray(articles)) {
            console.error('Invalid articles data provided to setStreamArticles')
            return
        }

        if (!unref(streams)[streamName]) {
            unref(streams)[streamName] = []
        }

        const updatedArticlesForBundling = articles.map(article => {
            return {
                ...article,
                streamRootUrl: streamRootUrl,
                streamName: streamName
            }
        })

        unref(streams)[streamName] = updatedArticlesForBundling

        // Add articles to bundledStreams
        bundledStreams.value.push(...updatedArticlesForBundling)

        console.log('Added length: ', updatedArticlesForBundling.length)
        console.log('Total bundled articles length: ', unref(bundledStreams).length)
    }


    return {
        getBundledStreams,
        getStreamsByName,
        setStreamArticles,
        removeStreamByName
    }
})