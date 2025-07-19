import { defineStore } from 'pinia'
import { ref, computed, Ref, unref } from 'vue'
import { ArticleData } from '@shared/types'

export const useStreamStore = defineStore('stream', () => {
    // state
    const streams = ref({}) as Ref<Record<string, ArticleData[]>>
    const bundledStreams = ref([]) as Ref<ArticleData[]>

    // getters
    const getBundledStreams = computed(() => {
        // return unref(bundledStreams)
        const streamNames = [...new Set(unref(bundledStreams).map(article => article.streamName))]
        const result: ArticleData[] = []
        let currentIndex = 0
        
        while (result.length < unref(bundledStreams).length) {
            const currentStreamName = streamNames[currentIndex]
            const article = unref(bundledStreams).find(
                a => a.streamName === currentStreamName && !result.includes(a)
            )
            if (article) result.push(article)
            currentIndex = (currentIndex + 1) % streamNames.length
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