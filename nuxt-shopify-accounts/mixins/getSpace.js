import getSpace from '../queries/getSpaceQuery.gql'

export default (client) => {
  return client.query({
    query: getSpace
  })
}
