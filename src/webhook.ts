export interface Event_ping {
    ping: 'ok'
}

export interface Event_post {
    post: {
        id: number
        name: string | null
        username: string
        avatar_template: string
        created_at: string
        cooked: string
        post_number: number
        post_type: number
        updated_at: string
        reply_count: number
        reply_to_post_number: number | null
        quote_count: number
        incoming_link_count: number
        reads: number
        score: number
        topic_id: number
        topic_slug: string
        topic_title: string
        category_id: number | null
        display_username: string | null
        primary_group_name: string | null
        flair_name: string | null
        flair_group_id: number | null
        version: number
        user_title: string | null
        bookmarked: boolean
        raw: string
        moderator: boolean
        admin: boolean
        staff: boolean
        user_id: number
        hidden: boolean
        trust_level: number
        deleted_at: string | null
        user_deleted: boolean
        edit_reason: string | null
        wiki: boolean
        reviewable_id: number
        reviewable_score_count: number
        reviewable_score_pending_count: number
        topic_posts_count: number
        topic_filtered_posts_count: number
        topic_archetype: string
        category_slug: string | null
    }
}
