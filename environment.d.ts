declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOMTOM_API_KEY: string
            [key: string]: string | undefined
        }
    }
}

export { }
