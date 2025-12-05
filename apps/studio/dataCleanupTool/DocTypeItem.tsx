import {ComponentType} from 'react'
import {CheckedTypes} from './Tool'
import {Box, Card, Inline, Stack, Text} from '@sanity/ui'
import {CheckmarkCircleIcon, WarningOutlineIcon} from '@sanity/icons'
import {Schema} from 'sanity'

const DocTypeItem: ComponentType<{
  checkedTypes: CheckedTypes[]
  docType: string
  checked: boolean
  loading: boolean
  schema: Schema
}> = ({checkedTypes, docType, loading, checked, schema}) => {
  // find deprecated fields for this doc type
  const deprecatedFields = checkedTypes.find((type) => type.type === docType)?.deprecatedFields
  // check if there are deprecated fields
  const hasDeprecatedFields = deprecatedFields && deprecatedFields.length > 0

  return (
    <Card
      key={docType}
      marginBottom={2}
      as={'li'}
      tone={hasDeprecatedFields ? 'caution' : 'default'}
      padding={1}
    >
      <Stack space={2}>
        <Inline space={3}>
          <Text as={'p'} weight={hasDeprecatedFields ? 'bold' : 'regular'}>
            {schema.get(docType)?.title || docType}
          </Text>
          <Card
            tone={!checked ? 'default' : checked && hasDeprecatedFields ? 'caution' : 'positive'}
            muted={!checked}
          >
            {deprecatedFields && deprecatedFields?.length > 0 ? (
              <WarningOutlineIcon />
            ) : !loading && checked ? (
              <CheckmarkCircleIcon />
            ) : null}
          </Card>
        </Inline>
        {checked && deprecatedFields && deprecatedFields.length > 0 && (
          <Box marginLeft={2}>
            <Box paddingBottom={2}>
              <Text size={1} weight="semibold">
                Unused fields:
              </Text>
            </Box>
            <Stack space={3} marginTop={1} as={'ul'} style={{listStyleType: 'disc !important'}}>
              {deprecatedFields.map((field) => (
                <Box
                  key={field}
                  as={'li'}
                  style={{
                    listStyleType: 'disc !important',
                    marginLeft: '0.5rem',
                    listStylePosition: 'outside',
                  }}
                >
                  <Text size={1}>- {field}</Text>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
export default DocTypeItem
