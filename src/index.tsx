import { Context, Schema } from 'koishi'
import {} from '@koishijs/plugin-server'
import {} from 'koishi-plugin-w-as-forward'

import dedent from 'dedent'

import { Event_topic } from './webhook'
import packageJson from '../package.json'

export const name = 'w-discourse'

export const inject = [ 'server' ]

export interface Config {
    selfId: string
    guildsToBroadcast: string[]
    webhookPath: string
}

export const Config: Schema<Config> = Schema.object({
    selfId: Schema.string().description('Bot ID'),
    guildsToBroadcast: Schema.array(Schema.string()).description('要广播消息的群'),
    webhookPath: Schema.string().default('/discourse').description('Webhook 路径'),
})

export const response = (resp:
    | { status: 'ok', broadcast_count?: number }
    | { status: 'ignored' }
    | { status: 'error', reason: string }
) => ({
    app: 'webmoe',
    version: packageJson.version,
    ...resp
})

// TODO: move formatters to config
export const eventFormatters = {
    'topic_created': ({ topic }: Event_topic) => {
        return dedent`
            【Web.Moe】萌网新帖推送

             标题：${topic.title}
             作者：${topic.created_by.username}
             链接：https://web.moe/t/topic/${topic.id}
        `
    },
    'ping': () => {
        return '【Web.Moe】Pong'
    }
}

export function apply(ctx: Context, config: Config) {
    ctx.server.post(config.webhookPath, async (ktx) => {
        const eventName = ktx.request.headers['x-discourse-event'] as string
        const event = ktx.request.body
        ctx.logger.info('New event [%s]: %o', eventName, event)

        const bot = ctx.bots[config.selfId]
        if (! bot) {
            ctx.logger.warn('Bot %s not found', config.selfId)
            ktx.body = response({ status: 'error', reason: 'Bot not found' })
            return
        }
        if (bot.status !== 1) {
            ctx.logger.warn('Bot %s is not online', config.selfId)
            ktx.body = response({ status: 'error', reason: 'Bot is not online' })
            return
        }
        if (eventName in eventFormatters) {
            const message = eventFormatters[eventName](event)
            bot.broadcast(config.guildsToBroadcast, <as-forward level='never'>{ message }</as-forward>)
            ktx.body = response({ status: 'ok', broadcast_count: config.guildsToBroadcast.length })
        }
        else {
            ktx.body = response({ status: 'ignored' })
        }
    })

    ctx.server.get(config.webhookPath, async (ktx) => {
        ktx.body = response({ status: 'ok' })
    })
}
