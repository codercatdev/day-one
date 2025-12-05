import { ComponentType, useEffect, useState } from 'react'
import { Tool, useClient, useSchema } from 'sanity'
import { defineQuery } from 'groq'
import { Box, Button, Card, Flex, Heading, Inline, Spinner, Stack, Text } from '@sanity/ui'
import DocTypeGrid from './DocTypeGrid'
import { CheckmarkCircleIcon } from '@sanity/icons'
import DocTypeItem from './DocTypeItem'
import { checkForFieldsMissingInSchema } from './checkForFieldsMissingInSchema'
import { handleUnsetDeprecatedFields } from './handleUnsetDeprecatedFields'
import HowItWorks from './HowItWorks'

export interface CheckedTypes {
  type: string
  deprecatedFields?: string[]
}

const CleanUpTool: ComponentType<{
  tool: Tool
}> = () => {
  // * MISC
  const schema = useSchema()
  const client = useClient({ apiVersion: '2025-12-01' }).withConfig({ perspective: 'drafts' })

  // * STATES
  const [loading, setLoading] = useState(false)

  /** State to hold all document types fetched from the dataset */
  const [docTypes, setDocTypes] = useState<Array<string>>([])
  /** State to hold checked document types with deprecated fields */
  const [checkedTypes, setCheckedTypes] = useState<Array<CheckedTypes>>([])
  /** check has run on all document types */
  const [checked, setChecked] = useState(false)
  /** State to indicate if all document types were checked and all deprecated fields were unset */
  const [allGood, setAllGood] = useState(false)

  // * FETCH ALL EXISTING DOCUMENT TYPES
  useEffect(() => {
    setLoading(true)
    const query = defineQuery(
      `array::unique(*._type)[!(@ in path('sanity.**') || @ in path('system.**') || @ in ['archive.schedule','assist.instruction.context','tasks.task'])]`,
    )
    client
      .fetch(query, {}, { tag: 'unused-fields-tool' })
      .then((types: Array<string>) => {
        setDocTypes(types)
      })
      .finally(() => setLoading(false))
      .catch(console.error)
  }, [])

  return (
    <Card padding={6} height={'fill'}>
      <Stack space={4}>
        <Heading as={'h1'} align={'center'}>
          Unset all deprecated Fields
        </Heading>
        <Flex gap={4} direction={'column'} justify={'center'} align={'center'} padding={4}>
          <HowItWorks />
          {loading && (
            <Box>
              <Inline space={3}>
                <Text>
                  {!checked
                    ? 'Checking for fields missing in schema for all document types in your dataset ...'
                    : 'Unsetting deprecated fields one document at a time...'}
                </Text>
                <Spinner />
              </Inline>
            </Box>
          )}
          {allGood && (
            <Card tone={'positive'} shadow={1} padding={3}>
              <Inline space={3}>
                <CheckmarkCircleIcon />
                <Text>
                  All document types are in sync with the schema. No deprecated fields found.
                </Text>
              </Inline>
            </Card>
          )}
        </Flex>

        <Flex justify={'center'} gap={3} padding={4}>
          <Button
            mode={'default'}
            onClick={() =>
              checkForFieldsMissingInSchema({
                docTypes: docTypes,
                client: client,
                schema: schema,
                loading: loading,
                setLoading: setLoading,
                setCheckedTypes: setCheckedTypes,
                setChecked: setChecked,
              })
            }
            text={'Run check'}
            disabled={loading || checkedTypes?.length > 0}
          />
          <Button
            mode={'default'}
            text={'Unset all deprecated Fields'}
            onClick={() =>
              handleUnsetDeprecatedFields({
                setLoading: setLoading,
                checkedTypes: checkedTypes,
                client: client,
                setAllGood: setAllGood,
              })
            }
            disabled={loading || !checked || checkedTypes.length === 0}
          />
        </Flex>
        {docTypes && !allGood && (
          <DocTypeGrid>
            {docTypes.map((docType) => (
              <DocTypeItem
                checkedTypes={checkedTypes}
                docType={docType}
                checked={checked}
                loading={loading}
                schema={schema}
              />
            ))}
          </DocTypeGrid>
        )}
      </Stack>
    </Card>
  )
}

export default CleanUpTool
