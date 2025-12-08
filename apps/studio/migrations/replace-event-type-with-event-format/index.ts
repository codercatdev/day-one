import { defineMigration, at, setIfMissing, unset, insert } from 'sanity/migrate'

const from = 'eventType'
const to = 'format'
const idempotenceKey = 'xyz'

export default defineMigration({
  id: 'replace-event-type-with-event-format',
  title: 'Replace event type with event format',
  documentTypes: ["event"],
  filter: '_type == "event" && defined(eventType) && !defined(format)',

  migrate: {
    document(doc, context) {
      if ((doc?._migrations as string[] || []).includes(idempotenceKey)) {
        // Document already migrated, so we can skip
        return
      }
      return [
        at(to, setIfMissing(doc[from])),
        at(from, unset()),
        at('_migrations', setIfMissing([])),
        at('_migrations', insert(idempotenceKey, 'after', 0)),
      ]
    }
  }
})
