import styled from 'styled-components'

export default styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  padding: 2rem;
  row-gap: 1rem;
  column-gap: 0.5rem;
`
