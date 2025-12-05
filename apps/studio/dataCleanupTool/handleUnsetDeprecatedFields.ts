import {defineQuery} from 'groq'
import {Dispatch, SetStateAction} from 'react'
import {CheckedTypes} from './Tool'
import {SanityClient} from 'sanity'

export const handleUnsetDeprecatedFields = async ({
  setLoading,
  checkedTypes,
  client,
  setAllGood,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>
  checkedTypes: CheckedTypes[]
  client: SanityClient
  setAllGood: Dispatch<SetStateAction<boolean>>
}) => {
  // lets start with loading
  setLoading(true)
  for (const typeInfo of checkedTypes) {
    const {type, deprecatedFields} = typeInfo
    // if no deprecated fields, continue to next type
    if (!deprecatedFields || deprecatedFields.length === 0) continue

    // fetch all documents of this type and return their _originalId (which we need to patch)
    const definedFieldFilter = deprecatedFields.map((field) => `defined(${field})`).join(' || ')
    const query = defineQuery(`*[_type == $docType && (${definedFieldFilter})]._originalId`)

    const documents = await client
      .fetch(query, {docType: type}, {tag: `unset-deprecated-fields-${type}`})
      .catch((err) => {
        console.error(`Error fetching documents for type ${type}:`, err)
        setLoading(false)
        // ** you might add something nice here to indicate an error state in the UI
      })
    // iterate over each document and unset the deprecated fields
    for (const doc of documents) {
      const patch = client.patch(doc)

      await patch
        .unset(deprecatedFields)
        // .dryRun set to true for safety; change to `false` to actually commit changes AFTER testing this thoroughly! there is no undoing
        .commit({dryRun: true, tag: `unset-deprecated-fields`})
        .then((res) => {
          console.log(
            `Unset deprecated fields for document ${doc} of type ${type} - ${deprecatedFields.map((field) => field).join(', ')}`,
          )
        })
        .catch((err) => {
          console.error(
            `Error unsetting deprecated fields for document ${doc} of type ${type}:`,
            err,
          )
        })
    }
  }
  setLoading(false)
  setAllGood(true)
}
