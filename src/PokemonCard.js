import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import { updatePokemonCapturedStatus } from './graphQLUtils'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    boxShadow:'5px 5px 5px #A9A9A9',
    backgroundColor:'#D3D3D3',
    borderRadius:'15px'
  },
  avatar: {
    height: theme.spacing(16),
    borderRadius: 0,
    marginBottom: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'center',
  },
}))

export function PokemonCard({ pokemon, fetchPokedexData }) {
  const classes = useStyles()

  const handleCapturedChange = async () => {
    const { errors } = await updatePokemonCapturedStatus(
      pokemon.id,
      !pokemon.captured
    )

    if (errors) {
      console.error(errors)
    }

    fetchPokedexData()
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <img
          alt={pokemon.name}
          src={pokemon.imgUrl}
          className={classes.avatar}
        />
        <Typography variant="h5" component="h2">
          {pokemon.name}
        </Typography>
        <Typography color="textSecondary">
          {pokemon.pokemonTypes.join(', ')}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <FormControlLabel
          control={
            <Switch
              checked={pokemon.captured}
              onChange={handleCapturedChange}
              name="captured"
              color="primary"
            />
          }
          label="Capture"
        />
      </CardActions>
    </Card>
  )
}
