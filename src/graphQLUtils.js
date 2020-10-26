// Main generic GraphQL request
async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    'https://catch-em-all.ap-south-1.aws.cloud.dgraph.io/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operationsDoc,
        operationName,
        variables,
      }),
    }
  )

  return await result.json()
}

const fetchAllPokemonOperationsDoc = `
  query fetchAllPokemon {
    queryPokemon {
      id
      name
      captured
      imgUrl
      pokemonTypes
    }
  }
`

function fetchAllPokemon() {
  return fetchGraphQL(fetchAllPokemonOperationsDoc, 'fetchAllPokemon', {})
}

// Fetch Pokemon by Type
const fetchPokemonOfCertainTypeOperationsDoc = (pokemonType) => `
  query fetchPokemonOfCertainType {
    queryPokemon(filter: { pokemonTypes: { eq: [${pokemonType}] } }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
    }
  }
`

function fetchPokemonOfCertainType(pokemonType) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeOperationsDoc(pokemonType),
    'fetchPokemonOfCertainType',
    {}
  )
}

const fetchPokemonByCapturedStatusOperationsDoc = (isCaptured) => `
  query fetchPokemonByCapturedStatus {
    queryPokemon(filter: { captured: ${isCaptured} }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
    }
  }
`

function fetchPokemonByCapturedStatus(isCaptured) {
  return fetchGraphQL(
    fetchPokemonByCapturedStatusOperationsDoc(isCaptured),
    'fetchPokemonByCapturedStatus',
    {}
  )
}

// Fetch Pokemon by Type and by Captured Status
const fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc = ({
  pokemonType,
  isCaptured,
}) => `
  query fetchPokemonOfCertainTypeAndByCapturedStatus {
    queryPokemon(filter: { captured: ${isCaptured}, pokemonTypes: { eq: [${pokemonType}] } }) {
      id
      name
      captured
      imgUrl
      pokemonTypes
    }
  }
`

function fetchPokemonOfCertainTypeAndByCapturedStatus({
  pokemonType,
  isCaptured,
}) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc({
      pokemonType,
      isCaptured,
    }),
    'fetchPokemonOfCertainTypeAndByCapturedStatus',
    {}
  )
}
export function fetchPokemon({ pokemonType, isCaptured }) {
  if (pokemonType !== 'Any' && isCaptured !== 'Any') {
    return fetchPokemonOfCertainTypeAndByCapturedStatus({
      pokemonType,
      isCaptured: isCaptured === 'Captured',
    })
  } else if (pokemonType !== 'Any') {
    return fetchPokemonOfCertainType(pokemonType)
  } else if (isCaptured !== 'Any') {
    return fetchPokemonByCapturedStatus(isCaptured === 'Captured')
  }

  return fetchAllPokemon()
}

const updatePokemonCapturedStatusOperationsDoc = (
  pokemonId,
  newIsCapturedValue
) => `
  mutation updatePokemonCapturedStatus {
    updatePokemon(input: {filter: {id: {eq: ${pokemonId}}}, set: {captured: ${newIsCapturedValue}}}) {
      pokemon {
        id
        name
        captured
        imgUrl
        pokemonTypes
      }
    }
  }
`

export function updatePokemonCapturedStatus(pokemonId, newIsCapturedValue) {
  return fetchGraphQL(
    updatePokemonCapturedStatusOperationsDoc(pokemonId, newIsCapturedValue),
    'updatePokemonCapturedStatus',
    {}
  )
}
