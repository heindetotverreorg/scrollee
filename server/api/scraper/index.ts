const fetchScrapingResult = async (streamConfig : Record<string, any>) => {
    const { streamName } = streamConfig
    return await $fetch(`http://localhost:3001/api/scraper/${streamName}`, {
        method: 'POST',
        body: JSON.stringify(streamConfig),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

export {
    fetchScrapingResult
}