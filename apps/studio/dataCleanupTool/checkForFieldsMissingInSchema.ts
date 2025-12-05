import {defineQuery} from 'groq'
import {ObjectSchemaType, SanityClient, Schema} from 'sanity'
import {Dispatch, SetStateAction} from 'react'
import {CheckedTypes} from './Tool'

export const checkForFieldsMissingInSchema = async ({
  docTypes,
  client,
  schema,
  setLoading,
  setCheckedTypes,
  setChecked,
}: {
  docTypes: Array<string>
  client: SanityClient
  schema: Schema
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  setCheckedTypes: Dispatch<SetStateAction<CheckedTypes[]>>
  setChecked: Dispatch<SetStateAction<boolean>>
}) => {
  // let's start with loading
  setLoading(true)
  // initialize results array
  const results: Array<CheckedTypes> = []

  for (const docType of docTypes) {
    // to check each document type, we fetch all documents of that type with all fields
    const query = defineQuery(`*[_type == $docType]`)
    const documents = await client
      .fetch(query, {docType}, {tag: `unused-fields-tool-${docType}`})
      .catch((err) => {
        console.error(`Error fetching documents for type ${docType}:`, err)
        setLoading(false)
      })
    // get the schema type for the current document type (documents are objects with an ID)
    const schemaType = schema.get(docType) as ObjectSchemaType | undefined
    // if schema type is not found, log a warning and continue to the next document type
    if (!schemaType) {
      console.warn(`Schema type for ${docType} not found`)
      continue
    }
    // get all field names defined in the schema for the current document type
    const schemaFieldNames = schemaType.fields.map((field) => field.name)
    // initialize a set to hold deprecated fields
    const deprecatedFieldsSet = new Set<string>()
    // iterate over each document of the current type
    for (const doc of documents) {
      Object.keys(doc).forEach((fieldName) => {
        // if the field name is not in the schema field names and is not a system field, add it to the deprecated fields set
        if (
          !schemaFieldNames.includes(fieldName) &&
          fieldName !== '_type' &&
          fieldName !== '_id' &&
          fieldName !== '_rev' &&
          fieldName !== '_updatedAt' &&
          fieldName !== '_createdAt' &&
          fieldName !== '_key' &&
          fieldName !== '_system' &&
          fieldName !== '_originalId'
        ) {
          deprecatedFieldsSet.add(fieldName)
        }
      })
    }
    // if any deprecated fields were found, add them to the results array
    if (deprecatedFieldsSet.size > 0) {
      results.push({type: docType, deprecatedFields: Array.from(deprecatedFieldsSet)})
    }
  }
  // update state with the results
  setCheckedTypes(results)
  // finished loading
  setLoading(false)
  // mark checking as complete
  setChecked(true)
}
