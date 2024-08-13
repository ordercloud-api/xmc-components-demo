/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Me, ProductCollection } from 'ordercloud-javascript-sdk'
import { FormEvent, useCallback, useEffect, useState } from 'react'

import { IconButton } from '@chakra-ui/react'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { useOcSelector } from 'src/redux/ocStore'

export default function FavoritesListButton() {
  // props: React.JSX.IntrinsicAttributes &
  //   React.ClassAttributes<HTMLButtonElement> &
  //   React.ButtonHTMLAttributes<HTMLButtonElement>
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { isAnonymous } = useOcSelector((s: any) => ({
    isAnonymous: s.ocAuth.isAnonymous,
  }))
  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [favoritesList, setFavoritesList] = useState([] as ProductCollection[])

  useEffect(() => {
    const initialize = async () => {
      // favorites stuff
      if (isAnonymous) return
      const favoritesList = await Me.ListProductCollections({ sortBy: ['Name'] })
      setFavoritesList(favoritesList.Items)
    }
    initialize()
  }, [isAnonymous])

  const addItem = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('added item to favorites')
  }, [])
  const removeItem = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log('removed item from favorites')
  }, [])

  const handleWishlistChange = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setIsFavorited((e) => !e)
    // A login is required before adding an item to the wishlist
    if (isAnonymous) {
      window.location.replace('/login')
    }

    setLoading(true)

    try {
      if (favoritesList) {
        await removeItem(e)
      } else {
        await addItem(e)
      }

      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <IconButton
      variant="outline"
      size="sm"
      aspectRatio="1 / 1 "
      fontSize="1.25em"
      onClick={handleWishlistChange}
      aria-label="Add to wishlist"
      color={isFavorited ? 'red.500' : 'inherit'}
      icon={isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
    />
  )
}
