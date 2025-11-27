export interface AlternateIconsPlugin {
    changeIcon(options: {
        alias: string;
        aliases: string[];
    }): Promise<void>;
    resetIcon(options: {
        defaultAlias?: string;
        aliases: string[];
    }): Promise<void>;
}
