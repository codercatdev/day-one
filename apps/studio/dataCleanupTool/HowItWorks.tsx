import {ComponentType, useCallback, useState} from 'react'
import {Box, Button, Card, Dialog, Flex, Text} from '@sanity/ui'

const HowItWorks: ComponentType = () => {
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  return (
    <>
      <Button mode={'ghost'} onClick={onOpen} text={'How this tool works'} />
      {open && (
        <Dialog
          header="How this tool works"
          id="dialog-how-it-works"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Box padding={4}>
            <Flex gap={4} direction={'column'} justify={'center'} align={'center'} padding={4}>
              <Box>
                <Text>
                  This tool helps you to find any fields that have been removed from the schema long
                  ago and you forgot to run a migration script.
                </Text>
              </Box>
              <Box>
                <Text>
                  It first fetches all (non-sanity) document types, and displays them below. Open
                  the console in your browser dev tools to see detailed logs.
                </Text>
              </Box>
              <Box>
                <Text>
                  First you need to click "Run check". This will iterates over each document type
                  and fetch all documents and checks if their fields exist in the schema for the
                  type.
                </Text>
              </Box>
              <Box>
                <Text>
                  When all document types have been checked, you will see which fields are
                  deprecated (aka not defined in the schema anymore). You can then click "Unset all
                  deprecated Fields" to remove them from all documents.
                </Text>
              </Box>
              <Card tone={'caution'} padding={2}>
                <Text weight={'semibold'}>
                  Make sure to test this first in a non-production environment, and back up your
                  data before changing the dryRun commit option in{' '}
                  <code>handleUnsetDeprecatedFields</code> to false!
                </Text>
              </Card>
            </Flex>
          </Box>
        </Dialog>
      )}
    </>
  )
}
export default HowItWorks
