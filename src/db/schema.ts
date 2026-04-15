import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ───────────────────────────────────────────────────────────────────

export const newsSourceEnum = pgEnum('news_source', [
  'ESPN',
  'AS',
  'MARCA',
  'EL_TIEMPO',
  'OTHER',
])

export const playerPositionEnum = pgEnum('player_position', [
  'POR', // Portero
  'DEF', // Defensa
  'MED', // Centrocampista
  'DEL', // Delantero
  'ENT', // Entrenador
])

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// NextAuth tables (required by @auth/drizzle-adapter)
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
})

// ─── News ─────────────────────────────────────────────────────────────────────

export const newsItems = pgTable('news_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  externalUrl: text('external_url').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  imageUrl: text('image_url'),
  source: newsSourceEnum('source').notNull().default('OTHER'),
  publishedAt: timestamp('published_at'),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
})

// ─── Players ──────────────────────────────────────────────────────────────────

export const players = pgTable('players', {
  id: text('id').primaryKey(), // slug: 'luis-diaz'
  name: text('name').notNull(),
  position: playerPositionEnum('position').notNull(),
  club: text('club').notNull(),
  number: integer('number'),
  imageUrl: text('image_url'),
  bio: text('bio'),
  goals: integer('goals').default(0),
  assists: integer('assists').default(0),
  caps: integer('caps').default(0), // partidos internacionales
  hypeCount: integer('hype_count').default(0).notNull(),
})

// ─── Player Hypes ─────────────────────────────────────────────────────────────

export const playerHypes = pgTable(
  'player_hypes',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    playerId: text('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueHype: uniqueIndex('unique_player_hype').on(table.userId, table.playerId),
  })
)

// ─── Comments ─────────────────────────────────────────────────────────────────

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  newsId: uuid('news_id').references(() => newsItems.id, { onDelete: 'cascade' }),
  playerId: text('player_id').references(() => players.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'), // self-reference for threaded replies
  likesCount: integer('likes_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Comment Likes ────────────────────────────────────────────────────────────

export const commentLikes = pgTable(
  'comment_likes',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').notNull().references(() => comments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueLike: uniqueIndex('unique_comment_like').on(table.userId, table.commentId),
  })
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  hypes: many(playerHypes),
  commentLikes: many(commentLikes),
  sessions: many(sessions),
}))

export const playersRelations = relations(players, ({ many }) => ({
  comments: many(comments),
  hypes: many(playerHypes),
}))

export const newsItemsRelations = relations(newsItems, ({ many }) => ({
  comments: many(comments),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  newsItem: one(newsItems, { fields: [comments.newsId], references: [newsItems.id] }),
  player: one(players, { fields: [comments.playerId], references: [players.id] }),
  likes: many(commentLikes),
}))
